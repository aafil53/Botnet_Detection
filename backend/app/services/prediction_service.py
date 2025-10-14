import numpy as np
import pandas as pd
import torch
import torch.nn.functional as F
from sklearn.neighbors import kneighbors_graph
from torch_geometric.data import Data
from torch_geometric.utils import add_self_loops
from typing import Dict, Tuple
import warnings
warnings.filterwarnings('ignore')

from app.ml_models.loader import model_loader


# 42 feature names in exact order used during training
FEATURE_NAMES = [
    'Flow Duration', 'Tot Fwd Pkts', 'Tot Bwd Pkts', 'TotLen Fwd Pkts',
    'TotLen Bwd Pkts', 'Fwd Pkt Len Max', 'Fwd Pkt Len Min', 'Fwd Pkt Len Mean',
    'Fwd Pkt Len Std', 'Bwd Pkt Len Max', 'Bwd Pkt Len Min', 'Bwd Pkt Len Mean',
    'Bwd Pkt Len Std', 'Flow Byts/s', 'Flow Pkts/s', 'Flow IAT Mean',
    'Flow IAT Std', 'Flow IAT Max', 'Flow IAT Min', 'Fwd IAT Mean',
    'Fwd IAT Std', 'Bwd IAT Mean', 'Bwd IAT Std', 'Fwd Header Len',
    'Bwd Header Len', 'Fwd Pkts/s', 'Bwd Pkts/s', 'Pkt Len Min',
    'Pkt Len Max', 'Pkt Len Mean', 'Pkt Len Std', 'FIN Flag Cnt',
    'SYN Flag Cnt', 'RST Flag Cnt', 'ACK Flag Cnt', 'Pkt Size Avg',
    'Fwd Seg Size Avg', 'Bwd Seg Size Avg', 'Active Mean', 'Active Std',
    'Idle Mean', 'Idle Std'
]


def extract_features(sample: Dict) -> Dict[str, float]:
    """
    Extract 42 features from dataset sample
    Handles missing features gracefully
    """
    features = {}
    for feature_name in FEATURE_NAMES:
        if feature_name in sample:
            features[feature_name] = float(sample[feature_name])
        else:
            features[feature_name] = 0.0  # Default for missing features
    return features


def preprocess_features(features: Dict[str, float]) -> np.ndarray:
    """
    Convert feature dict to numpy array and handle NaN/Inf values
    """
    # Create DataFrame for easier handling
    df = pd.DataFrame([features])
    
    # Replace NaN with 0
    df = df.fillna(0)
    
    # Replace infinite values with large numbers
    df = df.replace([np.inf], 1e10)
    df = df.replace([-np.inf], -1e10)
    
    # Ensure correct order
    ordered_values = [df[col].values[0] for col in FEATURE_NAMES]
    
    return np.array(ordered_values).reshape(1, -1)


def predict_lstm(features: Dict[str, float]) -> Tuple[int, float, float]:
    """
    Predict using LSTM model
    
    Returns:
        (prediction, probability, confidence)
    """
    # Load model
    model, scaler = model_loader.load_lstm()
    
    # Extract and preprocess features
    feature_dict = extract_features(features)
    X = preprocess_features(feature_dict)
    
    # Scale features
    X_scaled = scaler.transform(X)
    
    # Reshape for LSTM: (batch_size, sequence_length=1, features)
    X_lstm = X_scaled.reshape(X_scaled.shape[0], 1, X_scaled.shape[1])
    
    # Predict
    probs = model.predict(X_lstm, verbose=0).flatten()
    prob = float(probs[0])
    pred = int(prob > 0.5)
    
    # Confidence: distance from decision boundary (0.5)
    confidence = float(abs(prob - 0.5) * 2)
    
    return pred, prob, confidence


def predict_gcn(features: Dict[str, float]) -> Tuple[int, float, float]:
    """
    Predict using GCN model
    
    Returns:
        (prediction, probability, confidence)
    """
    # Load model
    model, scaler, feature_info = model_loader.load_gcn()
    device = model_loader.device
    
    # Extract and preprocess features
    feature_dict = extract_features(features)
    X = preprocess_features(feature_dict)
    
    # Scale features
    X_scaled = scaler.transform(X)
    
    # Create KNN graph (for single sample, create minimal self-connected graph)
    if X_scaled.shape[0] == 1:
        # Single node: self-loop only
        edge_index = torch.tensor([[0], [0]], dtype=torch.long)
    else:
        # Multiple nodes: create KNN graph
        knn_graph = kneighbors_graph(
            X_scaled,
            n_neighbors=min(8, X_scaled.shape[0]),
            mode='connectivity',
            include_self=False,
            metric='cosine'
        )
        edge_indices = np.array(knn_graph.nonzero())
        edge_index = torch.tensor(edge_indices, dtype=torch.long)
    
    # Add self-loops
    edge_index, _ = add_self_loops(edge_index, num_nodes=X_scaled.shape[0])
    
    # Create graph data
    node_features = torch.tensor(X_scaled, dtype=torch.float32).to(device)
    graph_data = Data(x=node_features, edge_index=edge_index.to(device))
    
    # Predict
    model.eval()
    with torch.no_grad():
        logits = model(graph_data.x, graph_data.edge_index)
        probs = F.softmax(logits, dim=1)
        pred = logits.argmax(dim=1).cpu().numpy()[0]
        prob = probs[:, 1].cpu().numpy()[0]
        confidence = probs.max(dim=1)[0].cpu().numpy()[0]
    
    return int(pred), float(prob), float(confidence)


def create_meta_features(
    lstm_prob: float,
    gcn_prob: float,
    lstm_conf: float,
    gcn_conf: float,
    lstm_pred: int,
    gcn_pred: int
) -> np.ndarray:
    """
    Create 18 meta-features for ensemble model
    Same as used during training
    """
    features = []
    
    # Base probabilities and confidences
    features.append(lstm_prob)
    features.append(gcn_prob)
    features.append(lstm_conf)
    features.append(gcn_conf)
    
    # Agreement
    features.append(float(lstm_pred == gcn_pred))
    
    # Probability differences and combinations
    features.append(abs(lstm_prob - gcn_prob))
    features.append(lstm_prob * gcn_prob)
    features.append(lstm_prob + gcn_prob)
    
    # Confidence differences and combinations
    features.append(abs(lstm_conf - gcn_conf))
    features.append(lstm_conf * gcn_conf)
    
    # Distance from decision boundary
    features.append(abs(lstm_prob - 0.5))
    features.append(abs(gcn_prob - 0.5))
    
    # Max and min probabilities
    features.append(max(lstm_prob, gcn_prob))
    features.append(min(lstm_prob, gcn_prob))
    
    # Entropy-based uncertainty
    lstm_entropy = -(lstm_prob * np.log(lstm_prob + 1e-10) +
                     (1 - lstm_prob) * np.log(1 - lstm_prob + 1e-10))
    gcn_entropy = -(gcn_prob * np.log(gcn_prob + 1e-10) +
                    (1 - gcn_prob) * np.log(1 - gcn_prob + 1e-10))
    
    features.append(lstm_entropy)
    features.append(gcn_entropy)
    features.append(lstm_entropy * gcn_entropy)
    
    # Weighted average by confidence
    total_conf = lstm_conf + gcn_conf + 1e-8
    weighted_prob = (lstm_conf / total_conf) * lstm_prob + (gcn_conf / total_conf) * gcn_prob
    features.append(weighted_prob)
    
    return np.array(features).reshape(1, -1)


def predict_ensemble(features: Dict[str, float]) -> Tuple[int, float, float]:
    """
    Predict using ensemble model (LSTM + GCN + Meta-learner)
    
    Returns:
        (prediction, probability, confidence)
    """
    # Get base model predictions
    lstm_pred, lstm_prob, lstm_conf = predict_lstm(features)
    gcn_pred, gcn_prob, gcn_conf = predict_gcn(features)
    
    # Load meta-learner
    meta_learner = model_loader.load_ensemble()
    
    # Create meta-features
    meta_features = create_meta_features(
        lstm_prob, gcn_prob, lstm_conf, gcn_conf, lstm_pred, gcn_pred
    )
    
    # Predict with meta-learner
    ensemble_probs = meta_learner.predict_proba(meta_features)[:, 1]
    pred = int(ensemble_probs[0] > 0.5)
    prob = float(ensemble_probs[0])
    confidence = float(abs(prob - 0.5) * 2)
    
    return pred, prob, confidence
