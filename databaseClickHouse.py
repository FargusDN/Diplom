from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# URL для подключения к ClickHouse
# Синтаксис: clickhouse+async://<user>:<password>@<host>:<port>/<database>
DATABASE_URL = "clickhouse+async://default:@localhost:9000/default"

# Создаём асинхронный движок SQLAlchemy для ClickHouse
engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Базовый класс для моделей
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as db:
        yield db