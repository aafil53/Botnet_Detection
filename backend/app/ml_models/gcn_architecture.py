import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GCNConv, BatchNorm as GeoBatchNorm


class EnhancedGCN42(torch.nn.Module):
    """
    Enhanced GCN model for 42 features
    Architecture matches saved checkpoint exactly
    """
    def __init__(self, num_features=42, hidden_dim=128, num_classes=2, dropout=0.4):
        super(EnhancedGCN42, self).__init__()
        
        # Graph Convolutional Layers - EXACT architecture from checkpoint
        self.conv1 = GCNConv(num_features, hidden_dim)  # 42 → 128
        self.bn1 = GeoBatchNorm(hidden_dim)
        
        self.conv2 = GCNConv(hidden_dim, hidden_dim * 2)  # 128 → 256
        self.bn2 = GeoBatchNorm(hidden_dim * 2)
        
        self.conv3 = GCNConv(hidden_dim * 2, hidden_dim)  # 256 → 128
        self.bn3 = GeoBatchNorm(hidden_dim)
        
        self.conv4 = GCNConv(hidden_dim, hidden_dim // 2)  # 128 → 64
        self.bn4 = GeoBatchNorm(hidden_dim // 2)
        
        # Classification Head - matches checkpoint
        self.classifier = torch.nn.Sequential(
            torch.nn.Linear(hidden_dim // 2, hidden_dim // 2),  # 64 → 64
            torch.nn.ReLU(),
            torch.nn.BatchNorm1d(hidden_dim // 2),
            torch.nn.Dropout(dropout),
            
            torch.nn.Linear(hidden_dim // 2, hidden_dim // 4),  # 64 → 32
            torch.nn.ReLU(),
            torch.nn.BatchNorm1d(hidden_dim // 4),
            torch.nn.Dropout(dropout * 0.7),
            
            torch.nn.Linear(hidden_dim // 4, num_classes)  # 32 → 2
        )
        
        self.dropout = dropout
    
    def forward(self, x, edge_index):
        """Forward pass through the network"""
        # Layer 1
        x1 = F.relu(self.bn1(self.conv1(x, edge_index)))
        x1 = F.dropout(x1, self.dropout, training=self.training)
        
        # Layer 2
        x2 = F.relu(self.bn2(self.conv2(x1, edge_index)))
        x2 = F.dropout(x2, self.dropout, training=self.training)
        
        # Layer 3
        x3 = F.relu(self.bn3(self.conv3(x2, edge_index)))
        x3 = F.dropout(x3, self.dropout, training=self.training)
        
        # Layer 4
        x4 = F.relu(self.bn4(self.conv4(x3, edge_index)))
        x4 = F.dropout(x4, self.dropout * 0.8, training=self.training)
        
        # Classification
        return self.classifier(x4)
