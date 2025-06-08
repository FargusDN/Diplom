import io
from asyncio.log import logger

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import User, UserInfo
from schemas import UserCreate, UserResponse
from database import get_db
from datetime import datetime
import secrets
import string
import csv

from fastapi import UploadFile, File, HTTPException
from fastapi import Response

import smtplib
from email.mime.text import MIMEText

router = APIRouter()


@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    try:
        users = db.query(User).all()
        print(f"Found {len(users)} users")
        return users
    except Exception as e:
        print(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error")


@router.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.login_user == user.login_user).first():
        raise HTTPException(status_code=400, detail="Логин уже существует")

    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.put("/users/{login_user}", response_model=UserResponse)
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


@router.delete("/users/{login}", response_model=UserResponse)
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


@router.get("/users/template")
async def get_users_template():
    try:
        # Создаем CSV в памяти
        buffer = io.StringIO()
        writer = csv.writer(buffer, delimiter=';')
        # Заголовки столбцов
        headers = ["login_user", "password_user"]
        writer.writerow(headers)
        content = buffer.getvalue()

        return Response(
            content=content,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=users_template.csv"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка генерации шаблона: {str(e)}")


@router.post("/users/bulk")
async def bulk_create_users(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(400, "Only CSV files are allowed")

    try:
        contents = await file.read()
        decoded = contents.decode('utf-8-sig')
    except UnicodeDecodeError:
        raise HTTPException(400, "Invalid file encoding. Use UTF-8.")

    reader = csv.DictReader(decoded.splitlines(), delimiter=';')
    normalized_fieldnames = [name.strip().lower().replace(' ', '_') for name in reader.fieldnames]
    reader.fieldnames = normalized_fieldnames

    users = []
    for row in reader:
        # Безопасная обработка None и пустых значений
        processed_row = {}
        for key, value in row.items():
            if value is None or not isinstance(value, str):
                processed_row[key] = ""  # Заменяем None на пустую строку
            else:
                processed_row[key] = value.strip()  # Обрезаем пробелы

        login = processed_row.get("login_user")
        password = processed_row.get("password_user")

        if not login or not password:
            continue

        users.append(User(
            login_user=login,
            password_user=password,
            role_user='simple_user',
            signal_ind='active',
            privilege_mil_center_ystu=False
        ))

    if not users:
        raise HTTPException(400, "No valid users found in the file")

    try:
        db.bulk_save_objects(users)
        db.commit()
        return {"message": f"Successfully added {len(users)} users"}
    except Exception as e:
        db.rollback()
        logger.error(f"Bulk insert error: {str(e)}")
        raise HTTPException(500, f"Bulk insert failed: {str(e)}")


@router.get("/users/{login_user}", response_model=UserResponse)
def get_user(login_user: str, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.login_user == login_user).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User не найден")
    return db_user





def send_email(to_email: str, new_password: str) -> bool:
    """Функция отправки email через Yandex SMTP"""
    try:
        smtp_server = "smtp.yandex.ru"
        smtp_port = 465
        smtp_user = "ystu.iss@yandex.ru"
        smtp_password = "slgxjyrszhoyfqmd"

        if not all([smtp_server, smtp_port, smtp_user, smtp_password]):
            logger.error("Missing SMTP configuration")
            return False

        # Создаем сообщение
        msg = MIMEText(
            f"Здравствуйте!\n\n"
            f"Ваш пароль для информационно-справочной системы ЯГТУ был сброшен.\n"
            f"Новый временный пароль: {new_password}\n\n"
            f"Рекомендуем изменить его после входа в систему.\n\n"
            f"С уважением,\n"
            f"Администрация ЯГТУ",
            "plain",
            "utf-8"
        )
        msg["Subject"] = "Сброс пароля в ИСС ЯГТУ"
        msg["From"] = smtp_user
        msg["To"] = to_email

        # Используем SSL соединение
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, [to_email], msg.as_string())

        return True

    except Exception as e:
        logger.error(f"Yandex SMTP error: {str(e)}")
        return False


@router.put("/users/{login}/reset-password", response_model=dict)
def reset_password(login: str, db: Session = Depends(get_db)):
    try:
        # Находим пользователя
        user = db.query(User).filter(User.login_user == login).first()
        if not user:
            raise HTTPException(status_code=404, detail="User не найден")

        # Находим информацию о пользователе
        user_info = db.query(UserInfo).filter(
            UserInfo.login_user == login
        ).first()

        if not user_info or not user_info.email:
            raise HTTPException(
                status_code=400,
                detail="Email не указан для этого пользователя"
            )

        # Генерируем новый пароль
        alphabet = string.ascii_letters + string.digits
        new_password = ''.join(secrets.choice(alphabet) for _ in range(8))

        # Обновляем пароль
        user.password_user = new_password
        user.change_dttm = datetime.utcnow()
        db.commit()

        # Отправляем email
        if send_email(user_info.email, new_password):
            return {"message": "Новый пароль отправлен на email"}
        else:
            raise HTTPException(
                status_code=500,
                detail="Ошибка при отправке email"
            )

    except Exception as e:
        db.rollback()
        print(f"[ERROR] {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при сбросе пароля: {str(e)}"
        )
