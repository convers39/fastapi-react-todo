import logging

from motor.motor_asyncio import AsyncIOMotorClient
from ..core.config import get_settings

log = logging.getLogger("uvicorn")


class DataBase:
    client: AsyncIOMotorClient = None


settings = get_settings()
db = DataBase()


async def get_db():
    return db.client[settings.db_name]


async def connect_to_mongo():
    log.info("Connecting to MongoDB...")
    db.client = AsyncIOMotorClient(settings.db_url)
    log.info("Connection created!")


async def close_connection():
    log.info("Closing connection...")
    db.client.close()
    log.info("Connection closed!")
