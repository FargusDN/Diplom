from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import asyncpg

# URL для подключения к PostgreSQL
DATABASE_URL = "postgresql+asyncpg://postgres:DBVUC@localhost/postgres"


# Создаём движок SQLAlchemy
engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
# Базовый класс для моделей
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as db:
        yield db