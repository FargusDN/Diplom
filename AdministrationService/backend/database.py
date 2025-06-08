from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = (
    "postgresql://admin:admin_user_1234@10.10.0.2:5432/ios_ystu_db"
)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    isolation_level="READ COMMITTED",  # Измените уровень изоляции
    echo=True  # Включите логирование SQL-запросов
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()