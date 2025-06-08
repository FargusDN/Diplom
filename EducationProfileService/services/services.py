from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from databasePostgres import get_db
from models.postgresqlModel import User, Institutes, Faculties, StudyGroup, UserInfo
from schemas.Schemas import UserAddSchema, InstitutiesAddSchema, FacultiesAddSchema, StudyGroupAddSchema, UserInfoAddSchema

async def create_user(data: UserAddSchema, db: AsyncSession = Depends(get_db)):
    new_user = User(
        login_user=data.login_user,
        password_user=data.password_user
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return {"status": "ok", "id": new_user.id}


async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    list = [{"id": user.login_user, "login": user.login_user} for user in users]
    return list


async def create_institute(data: InstitutiesAddSchema, db: AsyncSession = Depends(get_db)):
    new_institute = Institutes(institute_name=data.institute_name)
    db.add(new_institute)
    await db.commit()
    await db.refresh(new_institute)
    return {"status": "ok", "id": new_institute.id}


async def get_institutes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Institutes))
    institutes = result.scalars().all()
    return [{"id": inst.institute_id, "name": inst.institute_name} for inst in institutes]


async def create_faculties(data: FacultiesAddSchema, db: AsyncSession = Depends(get_db)):
    new_faculty = Faculties(
        faculty_code=data.faculty_code,
        faculty_name=data.faculty_name,
        institute_id=data.institute_id,
    )
    db.add(new_faculty)
    await db.commit()
    await db.refresh(new_faculty)
    return {"status": "ok", "id": new_faculty.faculty_id}


async def get_faculties(db: AsyncSession = Depends(get_db)):
    query = (
        select(
            Faculties.faculty_id,
            Faculties.faculty_code,
            Faculties.faculty_name,
            Faculties.institute_id,
            Institutes.institute_name
        )
        .join(Institutes, Faculties.institute_id == Institutes.institute_id)
        .filter(Faculties.faculty_id == 1)
    )

    result = await db.execute(query)
    faculties = result.all()
    return [
        {
            "id": fac.faculty_id,
            "faculty_code": fac.faculty_code,
            "faculty_name": fac.faculty_name,
            "institute_id": fac.institute_id,
            "institute_name": fac.institute_name  # исправлено с name на institute_name
        }
        for fac in faculties
    ]


async def create_studyGroup(data: StudyGroupAddSchema, db: AsyncSession = Depends(get_db)):
    new_studyGroup = StudyGroup(
        group_name=data.group_name,
        faculty_id=data.faculty_id
    )
    db.add(new_studyGroup)
    await db.commit()
    await db.refresh(new_studyGroup)
    return {"status": "ok", "id": new_studyGroup.group_id}


async def get_studyGroup_by_name(db,group_name):
    query = (
        select(
            StudyGroup.group_id,
            StudyGroup.group_name,
            Faculties.faculty_id,
            Faculties.faculty_code,
            Faculties.faculty_name,
            Faculties.institute_id,
            Institutes.institute_name
        )
        .join(Faculties, StudyGroup.faculty_id == Faculties.faculty_id, isouter=True)
        .join(Institutes, Faculties.institute_id == Institutes.institute_id, isouter=True)
        .filter(StudyGroup.group_name == group_name)
    )
    result = await db.execute(query)
    studyGroups = result.all()
    return [
        {
            "id": sg.group_id,
            "group_name": sg.group_name,
            "faculty_code": sg.faculty_code,
            "faculty_name": sg.faculty_name,
            "institute_name": sg.institute_name
        }
        for sg in studyGroups
    ]

async def get_studyGroup(db):
    query = (
        select(
            StudyGroup.group_id,
            StudyGroup.group_name,
            Faculties.faculty_id,
            Faculties.faculty_code,
            Faculties.faculty_name,
            Faculties.institute_id,
            Institutes.institute_name
        )
        .join(Faculties, StudyGroup.faculty_id == Faculties.faculty_id, isouter=True)
        .join(Institutes, Faculties.institute_id == Institutes.institute_id, isouter=True)
    )
    result = await db.execute(query)
    studyGroups = result.all()
    return [
        {
            "id": sg.group_id,
            "group_name": sg.group_name,
            "faculty_code": sg.faculty_code,
            "faculty_name": sg.faculty_name,
            "institute_name": sg.institute_name
        }
        for sg in studyGroups
    ]

async def create_userInfo(data: UserInfoAddSchema, db: AsyncSession = Depends(get_db)):
    new_userInfo = UserInfo(
    login_user = data.login_user,
    last_name = data.last_name,
    first_name = data.first_name,
    middle_name = data.middle_name,
    birth_dt = data.birth_dt,
    email = data.email,
    number_phone = data.number_phone,
    address_registration = data.address_registration,
    source_finance = data.source_finance,
    form_study = data.form_study,
    group_id = data.group_id,
    qualification = data.qualification,
    add_info = data.add_info,
    photo_user = data.photo_user,
    )
    db.add(new_userInfo)
    await db.commit()
    await db.refresh(new_userInfo)
    return {"status": "ok", "id": new_userInfo.login_user}

async def get_UserInfo(db):
    query = (
        select(
            UserInfo.user_status,
            UserInfo.last_name,
            UserInfo.first_name,
            UserInfo.middle_name,
            UserInfo.birth_dt,
            UserInfo.qualification,
            UserInfo.form_study,
            UserInfo.email,
            UserInfo.number_phone,
            UserInfo.address_registration,
            UserInfo.source_finance,
            UserInfo.photo_user,
            UserInfo.add_info,
            StudyGroup.group_name,
        )
        .join(User, UserInfo.login_user == User.login_user)
        .join(StudyGroup, UserInfo.group_id == StudyGroup.group_id, isouter=True)
    )
    result = await db.execute(query)
    userInfo = result.all()
    return [
        {
            "user_status": usinf.user_status,
            "last_name": usinf.last_name,
            "first_name": usinf.first_name,
            "middle_name": usinf.middle_name,
            "birth_dt": usinf.birth_dt,
            "qualification": usinf.qualification,
            "form_study": usinf.form_study,
            "email": usinf.email,
            "number_phone": usinf.number_phone,
            "address_registration": usinf.address_registration,
            "source_finance": usinf.source_finance,
            "photo_user": usinf.photo_user,
            "add_info": usinf.add_info,
            "group_name": usinf.group_name,
        }
        for usinf in userInfo
    ]

async def get_UserInfo(login_user,db):
    query = (
        select(
            UserInfo.user_status,
            UserInfo.last_name,
            UserInfo.first_name,
            UserInfo.middle_name,
            UserInfo.birth_dt,
            UserInfo.qualification,
            UserInfo.form_study,
            UserInfo.email,
            UserInfo.number_phone,
            UserInfo.address_registration,
            UserInfo.source_finance,
            UserInfo.photo_user,
            UserInfo.add_info,
            StudyGroup.group_name,
        )
        .join(User, UserInfo.login_user == User.login_user)
        .join(StudyGroup, UserInfo.group_id == StudyGroup.group_id, isouter=True)
        .filter(User.login_user == login_user)
    )
    result = await db.execute(query)
    userInfo = result.all()
    return [
        {
            "user_status": usinf.user_status,
            "last_name": usinf.last_name,
            "first_name": usinf.first_name,
            "middle_name": usinf.middle_name,
            "birth_dt": usinf.birth_dt,
            "qualification": usinf.qualification,
            "form_study": usinf.form_study,
            "email": usinf.email,
            "number_phone": usinf.number_phone,
            "address_registration": usinf.address_registration,
            "source_finance": usinf.source_finance,
            "photo_user": usinf.photo_user,
            "add_info": usinf.add_info,
            "group_name": usinf.group_name,
        }
        for usinf in userInfo
    ]


async def get_user(user_login, db):
    result = await db.execute(select(User).filter(User.login_user))
    resultmodel = result.scalars()
    user = {"id": resultmodel.login_user, "login": resultmodel.login_user}
    return user