from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings
from app.models.user import User
from app.models.detection import Detection


db_client = None


async def connect_to_mongo():
    """Connect to MongoDB and initialize Beanie"""
    global db_client
    db_client = AsyncIOMotorClient(settings.MONGODB_URL)
    database = db_client[settings.DATABASE_NAME]
    
    await init_beanie(
        database=database,
        document_models=[User, Detection]
    )
    
    print(f"✅ Connected to MongoDB at {settings.MONGODB_URL}")
    print(f"✅ Initialized Beanie with database: {settings.DATABASE_NAME}")


async def close_mongo_connection():
    """Close MongoDB connection"""
    global db_client
    if db_client:
        db_client.close()
        print("❌ Disconnected from MongoDB")
