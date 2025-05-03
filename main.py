from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from databasePostgres import get_db
import services
from Schemas import InstitutiesAddSchema, UserAddSchema, FacultiesAddSchema, StudyGroupAddSchema, UserInfoAddSchema

app = FastAPI()

# Получение всех пользователей
@app.get("/users/")
async def get_users(db: AsyncSession = Depends(get_db)):
    return await services.get_users(db)

# Создание пользователя
@app.post("/users/")
async def create_user(data: UserAddSchema, db: AsyncSession = Depends(get_db)):
    return await services.create_user(data, db)

# Получение всех институтов
@app.get("/institutes/")
async def get_institutes(db: AsyncSession = Depends(get_db)):
    return await services.get_institutes(db)

# Создание института
@app.post("/institutes/")
async def create_institute(data: InstitutiesAddSchema, db: AsyncSession = Depends(get_db)):
    return await services.create_institute(data, db)

@app.get("/faculties")
async def get_faculties(db: AsyncSession = Depends(get_db)):
    return await services.get_faculties(db)
@app.post("/faculties")
async def create_faculties(data: FacultiesAddSchema, db: AsyncSession = Depends(get_db)):
    return await services.create_faculties(data,db)

@app.post("/studyGroup")
async def create_studyGroup(data: StudyGroupAddSchema,db: AsyncSession = Depends(get_db)):
    return await services.create_studyGroup(data,db)

@app.get("/studyGroup/")
async def get_studyGroup(db: AsyncSession = Depends(get_db)):
    return await services.get_studyGroup(db)
@app.get("/studyGroup/{id}")
async def get_studyGroup(id:int,db: AsyncSession = Depends(get_db)):
    return await services.get_studyGroup(db,id)

@app.post("/userInfo")
async def create_userInfo(data: UserInfoAddSchema,db: AsyncSession = Depends(get_db)):
    return await services.create_userInfo(data,db)

@app.get("/userInfo")
async def get_UserInfo(db: AsyncSession = Depends(get_db)):
    return await services.get_UserInfo(db)
@app.get("/userInfo/{login_user}")
async def get_UserInfo(login_user:str,db: AsyncSession = Depends(get_db)):
    return await services.get_UserInfo(login_user,db)