from fastapi import APIRouter, Query, Depends
from app.models.user import User
from app.utils.security import get_current_user
from app.services.sample_service import sample_service
from typing import Optional


router = APIRouter(prefix="/samples", tags=["Sample Data"])


@router.get("/info")
async def get_dataset_info(current_user: User = Depends(get_current_user)):
    """
    Get information about the CTU-13 dataset
    """
    return sample_service.get_dataset_info()


@router.get("/random")
async def get_random_samples(
    n: int = Query(10, ge=1, le=100, description="Number of samples"),
    balanced: bool = Query(True, description="Return balanced normal/botnet samples"),
    current_user: User = Depends(get_current_user)
):
    """
    Get random network flow samples from CTU-13 dataset
    
    - **n**: Number of samples (1-100)
    - **balanced**: If true, returns 50% normal, 50% botnet samples
    """
    samples = sample_service.get_random_samples(n=n, balanced=balanced)
    
    return {
        "count": len(samples),
        "balanced": balanced,
        "samples": samples
    }


@router.get("/features")
async def get_feature_names(current_user: User = Depends(get_current_user)):
    """
    Get list of feature names in the dataset
    """
    if not sample_service.loaded:
        sample_service.load_dataset()
    
    return {
        "features": sample_service.feature_columns,
        "count": len(sample_service.feature_columns) if sample_service.feature_columns else 0
    }
