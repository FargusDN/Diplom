from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi import HTTPException
import subprocess
import datetime
import os


from routers import users
from database import engine, Base, get_db

from pydantic import BaseModel

class BackupRequest(BaseModel):
    file: str

Base.metadata.create_all(bind=engine)

app = FastAPI()


# Конфигурация директории для бэкапов
BACKUP_DIR = os.getenv('BACKUP_DIR', '/backups')
os.makedirs(BACKUP_DIR, exist_ok=True)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.include_router(users.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Добро пожаловать в Панель администрирования"}


@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT 1"))
        return {"status": "OK", "result": result.scalar()}
    except Exception as e:
        return {"error": str(e)}



@app.get("/api/backup/list")
async def list_backups():
    try:
        files = os.listdir(BACKUP_DIR)
        backups = [f for f in files if f.endswith('.sql')]
        backups.sort(reverse=True)  # Сортировка по дате (свежие сверху)
        return {"backups": backups}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/backup/create")
def create_backup():
    try:
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"backup_{timestamp}.sql"
        backup_path = os.path.join(BACKUP_DIR, backup_name)

        # Используем переменные окружения для подключения
        db_host = os.getenv('DB_HOST', '10.10.0.2')
        db_name = os.getenv('DB_NAME', 'ios_ystu_db')
        db_user = os.getenv('DB_USER', 'admin')
        db_pass = os.getenv('DB_PASSWORD', 'admin_user_1234')
        db_port = os.getenv('DB_PORT', '5432')

        # Формируем команду создания
        command = (
            f'PGPASSWORD="{db_pass}" pg_dump -h {db_host} -U {db_user} -d {db_name}  -p {db_port} '  
            f'-f "{backup_path}"'
        )
        print(f"Executing backup command: {command}")  # Для отладки
        subprocess.run(command, shell=True, check=True)
        return {"status": "success", "file": backup_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/backup/restore")
async def restore_backup(request: BackupRequest):
    try:
        file = request.file
        backup_path = os.path.join(BACKUP_DIR, file)
        if not os.path.exists(backup_path):
            raise HTTPException(status_code=404, detail="Backup файл не найден")

        db_host = os.getenv('DB_HOST', '10.10.0.2')
        db_name = os.getenv('DB_NAME', 'ios_ystu_db')
        db_user = os.getenv('DB_USER', 'admin')
        db_pass = os.getenv('DB_PASSWORD', 'admin_user_1234')
        db_port = os.getenv('DB_PORT', '5432')

        # Команда восстановления
        command = (
            f'PGPASSWORD="{db_pass}" psql -h {db_host} -U {db_user} -d {db_name} -p {db_port} '
            f'-f "{backup_path}"'
        )
        print(f"Executing restore command: {command}")
        subprocess.run(command, shell=True, check=True)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))