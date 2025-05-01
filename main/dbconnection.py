from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
# Формат строки подключения:
# dialect+driver://username:password@host:port/database
# Пример для PostgreSQL
class DBCONNECTION():
    DATABASE_URL = "postgresql+psycopg2://postgres:mypassword@localhost:5432/postgres"
    # Создание движка
    engine = create_engine(DATABASE_URL)
