from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from clickhouse_sqlalchemy import make_session  # Важно для ClickHouse

# Правильный URL для подключения к ClickHouse
# Используем 'asynch' (не 'async') и правильный синтаксис
DATABASE_URL = "clickhouse+asynch://admin:admin_user_1234@localhost:19000/ios_click_db"

# Создаём асинхронный движок SQLAlchemy для ClickHouse
engine = create_async_engine(
    DATABASE_URL,
    echo=True  # Для отладки запросов
)

# Создаем асинхронную сессию специальным образом для ClickHouse
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    future=True
)

async def get_db_ClcikHouse():
    async with AsyncSessionLocal() as dbClick:
            yield dbClick