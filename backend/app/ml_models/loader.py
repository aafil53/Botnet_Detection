import tensorflow as tf
import torch
import joblib
import numpy as np
from pathlib import Path
from typing import Optional
import warnings
warnings.filterwarnings('ignore')


class ModelLoader:
    """
    Singleton class to load and cache ML models
    Loads models only once and reuses them
    """
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.initialized = False
        return cls._instance
    
    def __init__(self):
        if not self.initialized:
            self.base_path = Path(__file__).parent / "saved_models"
            
            # Model instances
            self.lstm_model: Optional[tf.keras.Model] = None
            self.gcn_model: Optional[torch.nn.Module] = None
            self.ensemble_model = None
            
            # Scalers
            self.lstm_scaler = None
            self.gcn_scaler = None
            self.gcn_feature_info = None
            
            # Device for PyTorch
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            
            self.initialized = True
            print(f"🔧 ModelLoader initialized. Device: {self.device}")
    
    def load_lstm(self):
        """Load LSTM model and scaler"""
        if self.lstm_model is None:
            try:
                print("📦 Loading LSTM model...")
                self.lstm_model = tf.keras.models.load_model(
                    str(self.base_path / "lstm_final_model.keras")
                )
                self.lstm_scaler = joblib.load(
                    str(self.base_path / "lstm_scaler.pkl")
                )
                print("✅ LSTM model loaded successfully")
            except Exception as e:
                print(f"❌ Error loading LSTM: {e}")
                raise
        return self.lstm_model, self.lstm_scaler
    
    def load_gcn(self):
        """Load GCN model, scaler, and feature info"""
        if self.gcn_model is None:
            try:
                print("📦 Loading GCN model...")
                from app.ml_models.gcn_architecture import EnhancedGCN42
                
                # Load checkpoint
                checkpoint = torch.load(
                    str(self.base_path / "enhanced_gcn_42feat_best.pth"),
                    map_location=self.device
                )
                
                # Load scaler and feature info
                self.gcn_scaler = joblib.load(
                    str(self.base_path / "enhanced_gcn_scaler.pkl")
                )
                self.gcn_feature_info = joblib.load(
                    str(self.base_path / "enhanced_gcn_feature_info.pkl")
                )
                
                # Initialize model
                self.gcn_model = EnhancedGCN42(
                    num_features=42,
                    hidden_dim=128,
                    num_classes=2,
                    dropout=0.4
                )
                
                # Load weights
                self.gcn_model.load_state_dict(checkpoint['model_state_dict'])
                self.gcn_model.to(self.device)
                self.gcn_model.eval()
                
                print("✅ GCN model loaded successfully")
            except Exception as e:
                print(f"❌ Error loading GCN: {e}")
                raise
        return self.gcn_model, self.gcn_scaler, self.gcn_feature_info
    
    def load_ensemble(self):
        """Load ensemble meta-learner"""
        if self.ensemble_model is None:
            try:
                print("📦 Loading Ensemble meta-learner...")
                
                # Ensure base models are loaded
                self.load_lstm()
                self.load_gcn()
                
                # Load meta-learner
                self.ensemble_model = joblib.load(
                    str(self.base_path / "enhanced_meta_learner.pkl")
                )
                
                print("✅ Ensemble model loaded successfully")
            except Exception as e:
                print(f"❌ Error loading Ensemble: {e}")
                raise
        return self.ensemble_model
    
    def get_model_info(self):
        """Get information about loaded models"""
        return {
            "lstm_loaded": self.lstm_model is not None,
            "gcn_loaded": self.gcn_model is not None,
            "ensemble_loaded": self.ensemble_model is not None,
            "device": str(self.device)
        }


# Global singleton instance
model_loader = ModelLoader()
