import os

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://test:test@db_host/dashboard_db")
