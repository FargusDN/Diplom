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
async def get_user(user_login, db):
    try:
        users = db.query(User).filter(user_login).all()
        return user
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

@app.get("/api/duty-officer/", response_model=VucUsersSchema)
def get_duty_officer(db: Session = Depends(get_db)):
    try:
        query = text("""
            SELECT
                vuc_user_id as id,
                first_name,
                last_name,
                middle_name,
                birth_dt,
                position_in_vuc_id
            FROM
                public.vuc_users
            WHERE
                signal_ind = 'active'
            LIMIT 1;
        """)
        result = db.execute(query).fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="Дежурный не найден")
        # Преобразование результата в объект схемы Pydantic
        duty_officer = {
            "vuc_user_id": result.id,
            "first_name": result.first_name,
            "last_name": result.last_name,
            "middle_name": result.middle_name,
            "birth_dt": result.birth_dt,
            "position_in_vuc_id": result.position_in_vuc_id,
        }
        return duty_officer
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении данных: {str(e)}")


@app.get("/api/duty-schedule", response_model=Dict[str, List[Dict[str, Any]]])
def get_duty_schedule(db: Session = Depends(get_db)):
    try:
        # SQL-запрос для получения данных о нарядах
        query = text("""
            SELECT
                period_name AS period,
                time_interval AS time,
                responsible,
                position,
                location,
                task
            FROM
                public.duty_schedule
            ORDER BY
                period_name, time_interval
        """)
        results = db.execute(query).fetchall()
        # Сборка данных в формате, необходимом для фронтенда
        duty_schedule = {"Утро": [], "День": [], "Вечер": [], "Ночь": []}

        for row in results:
            duty_schedule[row.period].append({
                "time": row.time,
                "responsible": row.responsible,
                "position": row.position,
                "location": row.location,
                "task": row.task
            })

        return duty_schedule
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении данных: {str(e)}")


@app.get("/api/applications", response_model=List[Application])
def get_applications(db: Session = Depends(get_db)):
    try:
        query = text("""
            SELECT 
                id, 
                full_name AS "fullName", 
                course, 
                group_name AS "group", 
                department, 
                photo, 
                status, 
                rejection_reason AS "rejectionReason"
            FROM 
                public.applications
        """)
        results = db.execute(query).fetchall()
        applications = []
        for row in results:
            attachments_query = text("SELECT name, url FROM public.attachments WHERE application_id = :id")
            attachments = db.execute(attachments_query, {"id": row.id}).fetchall()
            application = {
                "id": row.id,
                "fullName": row.fullName,
                "course": row.course,
                "group": row.group,
                "department": row.department,
                "photo": row.photo,
                "status": row.status,
                "rejectionReason": row.rejectionReason,
                "attachments": [{"name": att.name, "url": att.url} for att in attachments]
            }
            applications.append(application)
        return applications
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении заявок: {str(e)}")

@app.post("/api/applications/update-status")
def update_application_status(request: UpdateStatusRequest, db: Session = Depends(get_db)):
    try:
        query = text("""
            UPDATE public.applications
            SET 
                status = :status,
                rejection_reason = :rejectionReason
            WHERE id = :id
        """)
        db.execute(query, {
            "id": request.id,
            "status": request.status,
            "rejectionReason": request.rejectionReason
        })
        db.commit()
        return {"status": "success", "message": f"Статус заявки {request.id} обновлен"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при обновлении статуса заявки: {str(e)}")



@app.get("/api/materials", response_model=List[Material])
def get_materials(db: Session = Depends(get_db)):
    try:
        query = text("""
            SELECT 
                id, 
                name, 
                category, 
                count, 
                defendant, 
                TO_CHAR(last_check, 'DD-MM-YYYY') AS last_check
            FROM 
                public.materials
        """)
        results = db.execute(query).fetchall()

        materials = [
            {
                "id": row.id,
                "name": row.name,
                "category": row.category,
                "count": row.count,
                "defendant": row.defendant,
                "last_check": row.last_check
            }
            for row in results
        ]
        return materials
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении материалов: {str(e)}")


@app.post("/api/materials/operation")
def perform_operation(operation: MaterialOperation, db: Session = Depends(get_db)):
    try:
        # Проверка существования материала
        query = text("SELECT count FROM public.materials WHERE id = :id")
        material = db.execute(query, {"id": operation.id}).fetchone()

        if not material:
            raise HTTPException(status_code=404, detail="Материал не найден")

        current_count = material.count

        # Логика выполнения операции
        if operation.operation_type == "списание":
            if operation.quantity > current_count:
                raise HTTPException(status_code=400, detail="Недостаточно материалов для списания")
            new_count = current_count - operation.quantity
        elif operation.operation_type == "возврат":
            new_count = current_count + operation.quantity
        else:
            raise HTTPException(status_code=400, detail="Недопустимый тип операции")

        # Обновление данных в базе
        update_query = text("""
            UPDATE public.materials
            SET count = :new_count
            WHERE id = :id
        """)
        db.execute(update_query, {"new_count": new_count, "id": operation.id})
        db.commit()

        return {"status": "success", "message": f"Операция '{operation.operation_type}' выполнена успешно",
                "new_count": new_count}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при выполнении операции: {str(e)}")

    @app.post("/api/materials/add")
    def add_new_material(material: NewMaterialRequest, db: Session = Depends(get_db)):
        try:
            # SQL-запрос для добавления нового материала в базу данных
            query = text("""
                INSERT INTO public.materials (name, category, count, defendant, last_check, sklad)
                VALUES (:name, :category, :count, :defendant, :last_check, :sklad)
            """)
            db.execute(query, {
                "name": material.name,
                "category": material.category,
                "count": material.quantity,
                "defendant": material.defendant,
                "last_check": material.last_check,
                "sklad": material.sklad
            })
            db.commit()
            return {"status": "success", "message": "Материал успешно добавлен"}
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Ошибка при добавлении материала: {str(e)}")
async def callback(message: aio_pika.IncomingMessage, db: AsyncSession = Depends(get_db)):
    async with message.process():
        data = json.loads(message.body.decode())
        event_type = data.get("event_type")

        if event_type == "notification_created":
            notification_id = data.get("data", {}).get("id")
            user_login = data.get("data", {}).get("login_user")

            user = await get_user(user_login, db)
            if user:
                print(f"Создано новое уведомление для пользователя: {user_login}, ID уведомления: {notification_id}")
                await send_notification(user.email, notification_id)
            else:
                print(f"Пользователь с логином {user_login} не найден.")
        else:
            print(f"Неизвестный тип события: {event_type}")
            # Логируйте или обрабатывайте неизвестные события при необходимости

async def send_notification(email: str, notification_id: int):
    # Здесь добавьте код для отправки уведомления (например, отправка email)
    print(f"Уведомление отправлено на {email} с ID уведомления: {notification_id}")
