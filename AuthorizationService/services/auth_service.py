from datetime import datetime
from jose import jwt
from app.repositories.user_repository import UserRepository
from app.core.config import settings


class AuthService:
    def __init__(self, user_repository: UserRepository):
        self.repo = user_repository

    def authenticate_user(self, username: str, password: str) -> User:
        user = self.repo.get_by_username(username)
        if not user:
            return None
        if not self.repo.verify_password(user, password):
            return None
        self.repo.update_login_time(user.id)
        return user

    def create_access_token(self, user: User) -> str:
        payload = {
            "sub": user.username,
            "role": user.role,
            "exp": datetime.utcnow() + settings.ACCESS_TOKEN_EXPIRE
        }
        return jwt.encode(
            payload,
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM
        )

    def register_user(self, username: str, email: str, password: str) -> User:
        return self.repo.create_user(username, email, password)