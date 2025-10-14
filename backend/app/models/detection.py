from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Dict


class Detection(Document):
    user_id: str
    model_type: str  # "lstm", "gcn", "ensemble"
    prediction: int  # 0 = Normal, 1 = Botnet
    confidence: float
    probability: float
    features: Dict[str, float]  # 42 feature values
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "detections"
        indexes = [
            "user_id",
            "timestamp",
            "model_type",
            [("user_id", 1), ("timestamp", -1)]  # Compound index
        ]
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "507f1f77bcf86cd799439011",
                "model_type": "ensemble",
                "prediction": 1,
                "confidence": 0.95,
                "probability": 0.98,
                "features": {}
            }
        }
