from sqlalchemy.orm import Session
from app.models.user import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_username(self, username: str) -> User:
        return self.db.query(User).filter(User.username == username).first()

    def create_user(self, username: str, email: str, password: str) -> User:
        hashed_password = pwd_context.hash(password)
        user = User(
            username=username,
            email=email,
            hashed_password=hashed_password
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def verify_password(self, user: User, password: str) -> bool:
        return pwd_context.verify(password, user.hashed_password)

    def update_login_time(self, user_id: int):
        user = self.db.query(User).get(user_id)
        user.last_login = datetime.utcnow()
        self.db.commit()