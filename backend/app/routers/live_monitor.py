from fastapi import APIRouter, Depends, Query
from app.models.user import User
from app.utils.security import get_current_user
from app.services.sample_service import sample_service
from app.services.prediction_service import predict_ensemble
from app.services.email_service import email_service
from datetime import datetime
import asyncio
from typing import List


router = APIRouter(prefix="/monitor", tags=["Live Monitoring"])


@router.post("/start")
async def start_live_monitoring(
    duration: int = Query(60, ge=10, le=300, description="Monitoring duration in seconds"),
    interval: float = Query(2.0, ge=0.5, le=10.0, description="Sampling interval in seconds"),
    alert_threshold: float = Query(0.7, ge=0.5, le=1.0, description="Alert if probability > threshold"),
    current_user: User = Depends(get_current_user)
):
    """
    Start live traffic monitoring simulation
    
    - Fetches samples from dataset at intervals
    - Runs ensemble detection on each sample
    - Sends email alert if botnet detected with high confidence
    """
    monitoring_results = []
    start_time = datetime.utcnow()
    alerts_sent = 0
    
    # Calculate number of samples based on duration and interval
    num_samples = int(duration / interval)
    
    for i in range(num_samples):
        # Simulate capturing traffic
        samples = sample_service.get_random_samples(n=1, balanced=False)
        
        if not samples:
            break
        
        sample = samples[0]
        actual_label = sample.get('_actual_label')
        
        # Run detection
        pred, prob, conf = predict_ensemble(sample)
        
        timestamp = datetime.utcnow()
        
        result = {
            "sample_id": i + 1,
            "timestamp": timestamp.isoformat(),
            "prediction": pred,
            "prediction_label": "Botnet" if pred == 1 else "Normal",
            "probability": prob,
            "confidence": conf,
            "actual_label": actual_label,
            "alert_sent": False
        }
        
        # Send alert if botnet detected with high probability
        if pred == 1 and prob >= alert_threshold:
            detection_details = {
                "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S UTC"),
                "model": "Ensemble (LSTM + GCN)",
                "confidence": conf,
                "probability": prob,
                "sample_id": i + 1
            }
            
            # Send email alert
            email_sent = await email_service.send_botnet_alert(
                recipient_email=current_user.email,
                detection_details=detection_details
            )
            
            if email_sent:
                result["alert_sent"] = True
                alerts_sent += 1
        
        monitoring_results.append(result)
        
        # Wait for next interval (except last iteration)
        if i < num_samples - 1:
            await asyncio.sleep(interval)
    
    end_time = datetime.utcnow()
    duration_actual = (end_time - start_time).total_seconds()
    
    # Calculate summary statistics
    botnet_count = sum(1 for r in monitoring_results if r["prediction"] == 1)
    normal_count = sum(1 for r in monitoring_results if r["prediction"] == 0)
    
    summary = {
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "duration_seconds": round(duration_actual, 2),
        "total_samples": len(monitoring_results),
        "botnet_detected": botnet_count,
        "normal_traffic": normal_count,
        "alerts_sent": alerts_sent,
        "detection_rate": round(botnet_count / len(monitoring_results) * 100, 2) if monitoring_results else 0
    }
    
    return {
        "summary": summary,
        "detections": monitoring_results
    }


@router.get("/stream")
async def get_single_sample(current_user: User = Depends(get_current_user)):
    """
    Get a single traffic sample for real-time streaming
    Used by frontend for live monitoring display
    """
    samples = sample_service.get_random_samples(n=1, balanced=False)
    
    if not samples:
        return {"error": "No samples available"}
    
    sample = samples[0]
    actual_label = sample.get('_actual_label')
    
    # Run detection
    pred, prob, conf = predict_ensemble(sample)
    
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "prediction": pred,
        "prediction_label": "Botnet" if pred == 1 else "Normal",
        "probability": prob,
        "confidence": conf,
        "actual_label": actual_label
    }
