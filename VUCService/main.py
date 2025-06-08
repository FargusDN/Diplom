from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

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


@app.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    try:
        users = db.query(User).all()
        print(f"Found {len(users)} users")
        return users
    except Exception as e:
        print(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error")


@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.login_user == user.login_user).first():
        raise HTTPException(status_code=400, detail="Логин уже существует")

    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.put("/users/{login_user}", response_model=UserResponse)
def update_user(login_user: str, user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.login_user == login_user).first()
    if not db_user:
        raise HTTPException(404, "User не найден")

    update_data = user.dict(exclude_unset=True)

    # Если пароль не передан, используем текущий
    if "password_user" not in update_data or not update_data["password_user"]:
        update_data["password_user"] = db_user.password_user

    for key, value in update_data.items():
        setattr(db_user, key, value)

    db_user.change_dttm = datetime.utcnow()

    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        print(f"[ERROR] {str(e)}")
        raise HTTPException(400, detail=str(e))


@app.delete("/users/{login}", response_model=UserResponse)
def delete_user(login: str, db: Session = Depends(get_db)):
    try:
        # Находим пользователя
        user = db.query(User).filter(User.login_user == login).first()
        if not user:
            raise HTTPException(status_code=404, detail="User не найден")

        # Удаляем пользователя
        db.delete(user)
        db.commit()
        db.expire_all()  # Сбросить кэш сессии

        return user
    except Exception as e:
        db.rollback()
        print(f"[ERROR] {str(e)}")  # Логируем ошибку
        raise HTTPException(status_code=500, detail=f"Ошибка при удалении: {str(e)}")

@app.get("/users/{login_user}", response_model=UserResponse)
def get_user(login_user: str, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.login_user == login_user).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User не найден")
    return db_user



