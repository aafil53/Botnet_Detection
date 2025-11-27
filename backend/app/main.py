from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings, get_allowed_origins_from_env
from app.database import connect_to_mongo, close_mongo_connection
from app.routers import auth  # ADD THIS LINE
from app.routers import auth, samples
from app.routers import auth, samples, detection  # Add detection
from app.routers import auth, samples, detection, live_monitor

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    print("🚀 Application startup complete")
    yield
    # Shutdown
    await close_mongo_connection()
    print("👋 Application shutdown complete")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    lifespan=lifespan
)

# CORS middleware
# CORS middleware - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=(get_allowed_origins_from_env(settings.ALLOWED_ORIGINS) if not settings.DEBUG else ["*"]),
    allow_credentials=False if not settings.DEBUG else True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers - ADD THIS LINE
app.include_router(auth.router)
app.include_router(samples.router)
app.include_router(detection.router)
app.include_router(live_monitor.router)

@app.get("/")
async def root():
    return {
        "message": "Botnet Detection API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
