from pydantic import BaseModel, Field
from typing import Dict, Optional
from datetime import datetime


class DetectionRequest(BaseModel):
    """Request schema for detection"""
    features: Dict[str, float] = Field(
        ...,
        description="Network flow features (42 features expected)"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "features": {
                    "Flow Duration": 120000.0,
                    "Tot Fwd Pkts": 10.0,
                    "Tot Bwd Pkts": 5.0,
                }
            }
        }


class DetectionResponse(BaseModel):
    """Response schema for detection"""
    prediction: int = Field(..., description="0=Normal, 1=Botnet")
    prediction_label: str = Field(..., description="Normal or Botnet")
    probability: float = Field(..., description="Probability of being botnet")
    confidence: float = Field(..., description="Confidence score (0-1)")
    model_used: str = Field(..., description="LSTM, GCN, or Ensemble")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    actual_label: Optional[int] = Field(None, description="Actual label if available")
    
    class Config:
        json_schema_extra = {
            "example": {
                "prediction": 1,
                "prediction_label": "Botnet",
                "probability": 0.95,
                "confidence": 0.90,
                "model_used": "Ensemble",
                "timestamp": "2025-10-07T14:30:00",
                "actual_label": 1
            }
        }


class BatchDetectionRequest(BaseModel):
    """Request for batch detection from samples"""
    n: int = Field(10, ge=1, le=100, description="Number of samples")
    balanced: bool = Field(True, description="Balanced normal/botnet samples")
    model_type: str = Field("ensemble", pattern="^(lstm|gcn|ensemble)$")  # CHANGED: regex → pattern


class BatchDetectionResponse(BaseModel):
    """Response for batch detection"""
    total_samples: int
    predictions: list
    summary: Dict
