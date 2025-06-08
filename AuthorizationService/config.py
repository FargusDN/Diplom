from pydantic import BaseSettings
from datetime import timedelta

class Settings(BaseSettings):
    SECRET_KEY: str = "728c774459b57bbb833f4fee54f244dc"
    ACCESS_TOKEN_EXPIRE: timedelta = timedelta(minutes=30)
    DATABASE_URL: str = "postgresql://user:password@db:5432/auth_db"

settings = Settings()