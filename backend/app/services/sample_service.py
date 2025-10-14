import pandas as pd
import numpy as np
from pathlib import Path
from typing import List, Dict, Optional
import random


class SampleDataService:
    """
    Service to load and sample from CTU-13 dataset
    Simulates live traffic detection
    """
    
    def __init__(self):
        self.dataset_path = Path(__file__).parent.parent.parent / "data" / "ctu13_combined.csv"
        self.df: Optional[pd.DataFrame] = None
        self.feature_columns = None
        self.loaded = False
        
    def load_dataset(self):
        """Load dataset from CSV file"""
        try:
            if not self.dataset_path.exists():
                print(f"⚠️  Dataset not found at {self.dataset_path}")
                return False
            
            print(f"📂 Loading dataset from {self.dataset_path}...")
            self.df = pd.read_csv(self.dataset_path)
            
            # Identify feature columns (exclude Label if present)
            if 'Label' in self.df.columns:
                self.feature_columns = [col for col in self.df.columns if col != 'Label']
            else:
                self.feature_columns = self.df.columns.tolist()
            
            print(f"✅ Dataset loaded: {len(self.df)} rows, {len(self.feature_columns)} features")
            self.loaded = True
            return True
            
        except Exception as e:
            print(f"❌ Error loading dataset: {e}")
            return False
    
    def get_random_samples(self, n: int = 10, balanced: bool = True) -> List[Dict]:
        """
        Get random samples from dataset
        
        Args:
            n: Number of samples to return
            balanced: If True, return equal normal/botnet samples (if Label exists)
        
        Returns:
            List of feature dictionaries
        """
        if not self.loaded:
            self.load_dataset()
        
        if self.df is None or len(self.df) == 0:
            return []
        
        # If Label column exists and balanced=True
        if balanced and 'Label' in self.df.columns:
            n_per_class = n // 2
            
            normal_samples = self.df[self.df['Label'] == 0].sample(
                n=min(n_per_class, len(self.df[self.df['Label'] == 0])),
                replace=False
            )
            
            botnet_samples = self.df[self.df['Label'] == 1].sample(
                n=min(n_per_class, len(self.df[self.df['Label'] == 1])),
                replace=False
            )
            
            samples_df = pd.concat([normal_samples, botnet_samples]).sample(frac=1)  # Shuffle
        else:
            samples_df = self.df.sample(n=min(n, len(self.df)), replace=False)
        
        # Convert to list of dictionaries (only feature columns)
        samples = []
        for _, row in samples_df.iterrows():
            sample = {col: float(row[col]) for col in self.feature_columns}
            # Optionally include actual label for verification
            if 'Label' in self.df.columns:
                sample['_actual_label'] = int(row['Label'])
            samples.append(sample)
        
        return samples
    
    def get_streaming_samples(self, interval: float = 1.0):
        """
        Generator that yields random samples indefinitely
        Useful for simulating real-time traffic
        
        Args:
            interval: Time interval between samples (seconds)
        
        Yields:
            Feature dictionary
        """
        if not self.loaded:
            self.load_dataset()
        
        if self.df is None:
            return
        
        while True:
            sample = self.get_random_samples(n=1)[0]
            yield sample
    
    def get_dataset_info(self) -> Dict:
        """Get information about the loaded dataset"""
        if not self.loaded:
            self.load_dataset()
        
        if self.df is None:
            return {"error": "Dataset not loaded"}
        
        info = {
            "total_samples": len(self.df),
            "num_features": len(self.feature_columns),
            "feature_names": self.feature_columns[:10],  # First 10 features
            "has_labels": 'Label' in self.df.columns
        }
        
        if 'Label' in self.df.columns:
            info["normal_samples"] = int((self.df['Label'] == 0).sum())
            info["botnet_samples"] = int((self.df['Label'] == 1).sum())
            info["botnet_percentage"] = round(
                (self.df['Label'] == 1).sum() / len(self.df) * 100, 2
            )
        
        return info


# Global instance
sample_service = SampleDataService()
