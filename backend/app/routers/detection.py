from fastapi import APIRouter, HTTPException, Depends, status
from app.models.user import User
from app.models.detection import Detection
from app.schemas.detection import (
    DetectionRequest,
    DetectionResponse,
    BatchDetectionRequest,
    BatchDetectionResponse
)
from app.services.prediction_service import (
    predict_lstm,
    predict_gcn,
    predict_ensemble,
    FEATURE_NAMES
)
from app.services.sample_service import sample_service
from app.utils.security import get_current_user
from app.ml_models.loader import model_loader
from datetime import datetime
from typing import List
from app.services.mail_service import send_detection_summary


router = APIRouter(prefix="/detect", tags=["Detection"])


@router.get("/models")
async def get_model_status(current_user: User = Depends(get_current_user)):
    """
    Get status of loaded models
    """
    return model_loader.get_model_info()


@router.get("/features")
async def get_feature_names():
    """
    Get the 42 required feature names in order
    """
    return {
        "features": FEATURE_NAMES,
        "count": len(FEATURE_NAMES),
        "description": "Features must be provided in this exact order"
    }


@router.post("/lstm", response_model=DetectionResponse)
async def detect_with_lstm(
    request: DetectionRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Detect botnet using LSTM model
    
    - Trained accuracy: ~94-96%
    - Best for temporal sequence patterns
    """
    try:
        # Predict
        pred, prob, conf = predict_lstm(request.features)
        
        # Get actual label if present
        actual_label = request.features.get('_actual_label')
        
        # Save to database
        detection = Detection(
            user_id=str(current_user.id),
            model_type="lstm",
            prediction=pred,
            confidence=conf,
            probability=prob,
            features=request.features
        )
        await detection.insert()
        
        # Return response
        return DetectionResponse(
            prediction=pred,
            prediction_label="Botnet" if pred == 1 else "Normal",
            probability=prob,
            confidence=conf,
            model_used="LSTM",
            timestamp=datetime.utcnow(),
            actual_label=actual_label
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"LSTM prediction error: {str(e)}"
        )


@router.post("/gcn", response_model=DetectionResponse)
async def detect_with_gcn(
    request: DetectionRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Detect botnet using GCN (Graph Convolutional Network) model
    
    - Trained accuracy: ~94-96%
    - Best for spatial graph patterns
    """
    try:
        # Predict
        pred, prob, conf = predict_gcn(request.features)
        
        # Get actual label if present
        actual_label = request.features.get('_actual_label')
        
        # Save to database
        detection = Detection(
            user_id=str(current_user.id),
            model_type="gcn",
            prediction=pred,
            confidence=conf,
            probability=prob,
            features=request.features
        )
        await detection.insert()
        
        # Return response
        return DetectionResponse(
            prediction=pred,
            prediction_label="Botnet" if pred == 1 else "Normal",
            probability=prob,
            confidence=conf,
            model_used="GCN",
            timestamp=datetime.utcnow(),
            actual_label=actual_label
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"GCN prediction error: {str(e)}"
        )


@router.post("/ensemble", response_model=DetectionResponse)
async def detect_with_ensemble(
    request: DetectionRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Detect botnet using Ensemble model (LSTM + GCN + Meta-learner)
    
    - Target accuracy: ~98%+
    - Combines strengths of both LSTM and GCN
    - Recommended for best performance
    """
    try:
        # Predict
        pred, prob, conf = predict_ensemble(request.features)
        
        # Get actual label if present
        actual_label = request.features.get('_actual_label')
        
        # Save to database
        detection = Detection(
            user_id=str(current_user.id),
            model_type="ensemble",
            prediction=pred,
            confidence=conf,
            probability=prob,
            features=request.features
        )
        await detection.insert()
        
        # Return response
        return DetectionResponse(
            prediction=pred,
            prediction_label="Botnet" if pred == 1 else "Normal",
            probability=prob,
            confidence=conf,
            model_used="Ensemble",
            timestamp=datetime.utcnow(),
            actual_label=actual_label
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ensemble prediction error: {str(e)}"
        )


@router.post("/batch", response_model=BatchDetectionResponse)
async def batch_detection_from_samples(
    request: BatchDetectionRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Run batch detection on random samples from dataset
    
    Simulates live detection by:
    1. Fetching random samples from CTU-13 dataset
    2. Running predictions on each sample
    3. Comparing predictions with actual labels
    4. Returning accuracy metrics
    
    Perfect for testing and demonstration!
    """
    try:
        # Get random samples
        samples = sample_service.get_random_samples(
            n=request.n,
            balanced=request.balanced
        )
        
        if not samples:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No samples available from dataset"
            )
        
        # Select prediction function
        if request.model_type == "lstm":
            predict_func = predict_lstm
        elif request.model_type == "gcn":
            predict_func = predict_gcn
        else:
            predict_func = predict_ensemble
        
        # Run predictions
        predictions = []
        correct = 0
        botnet_detected = 0
        normal_detected = 0
        
        for sample in samples:
            # Get actual label if present
            actual_label = sample.get('_actual_label')
            
            # Predict
            pred, prob, conf = predict_func(sample)
            
            # Save to database
            detection = Detection(
                user_id=str(current_user.id),
                model_type=request.model_type,
                prediction=pred,
                confidence=conf,
                probability=prob,
                features=sample
            )
            await detection.insert()
            
            # Track metrics
            if pred == 1:
                botnet_detected += 1
            else:
                normal_detected += 1
            
            if actual_label is not None and pred == actual_label:
                correct += 1
            
            # Prepare result
            result = {
                "prediction": pred,
                "prediction_label": "Botnet" if pred == 1 else "Normal",
                "probability": prob,
                "confidence": conf,
                "actual_label": actual_label,
                "correct": pred == actual_label if actual_label is not None else None
            }
            predictions.append(result)
        
        # Calculate summary
        accuracy = (correct / len(samples) * 100) if samples else 0
        
        summary = {
            "model_used": request.model_type.upper(),
            "total_samples": len(samples),
            "botnet_detected": botnet_detected,
            "normal_detected": normal_detected,
            "accuracy": round(accuracy, 2) if any(p.get('correct') is not None for p in predictions) else None,
            "botnet_percentage": round(botnet_detected / len(samples) * 100, 2) if samples else 0
        }
        
        # Send summary email to the logged-in user (danger or safe)
        try:
            if current_user and getattr(current_user, "email", None):
                send_detection_summary(current_user.email, summary, "batch")
        except Exception as _e:
            # do not fail the request if email sending fails
            pass

        return BatchDetectionResponse(
            total_samples=len(samples),
            predictions=predictions,
            summary=summary
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch detection error: {str(e)}"
        )
