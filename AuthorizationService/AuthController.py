from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel, constr
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from html import escape


SMTP_SERVER = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "omichika200@gmail.com")
SENDER_PASSWORD = os.environ.get("SENDER_PASSWORD", "ВАШ_ПАРОЛЬ")


DATABASE_URL = "postgresql://test:test@localhost/auth"
SECRET_KEY = "728c774459b57bbb833f4fee54f244dc"


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class UserCreate(BaseModel):
    username: constr(min_length=4, max_length=20)
    password: constr(min_length=8)

class UserInDB(BaseModel):
    username: str
    hashed_password: str


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def sanitize_input(input_str: str):
    return escape(input_str.strip())


@app.post("/auth")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):

    username = sanitize_input(form_data.username)
    password = sanitize_input(form_data.password)

    with SessionLocal() as db:
        try:
            user = db.execute(
                text("SELECT username, hashed_password FROM users WHERE username = :username"),
                {"username": username}
            ).fetchone()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error"
            )

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {"access_token": user.username, "token_type": "bearer"}


@app.post("auth/register")
async def register(user: UserCreate):
    with SessionLocal() as db:
        try:
            hashed_password = get_password_hash(user.password)
            db.execute(
                text("""
                    INSERT INTO users (username, hashed_password)
                    VALUES (:username, :hashed_password)
                """),
                {
                    "username": sanitize_input(user.username),
                    "hashed_password": hashed_password
                }
            )
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration failed"
            )

    return {"status": "success"}



def generate_and_store_2fa_code(db: Session, username: str):
    code = str(random.randint(100000, 999999))
    expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=5)
    db.execute(
        text("DELETE FROM two_factor_codes WHERE username = :username"),
        {"username": username}
    )
    db.execute(
        text("""
            INSERT INTO two_factor_codes (username, code, expires_at)
            VALUES (:username, :code, :expires_at)
        """),
        {"username": username, "code": code, "expires_at": expires_at}
    )
    db.commit()
    return code

@app.post("/auth/request-2fa")
async def request_two_factor(username: str):
    with SessionLocal() as db:
        try:

            code = generate_and_store_2fa_code(db, sanitize_input(username))

            user_email = f"{username}@gmail.com"
            send_2fa_code_email(user_email, code)
            return {"message": "2FA code sent to email"}
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to request 2FA code"
            )
class VerifyTwoFactor(BaseModel):
    username: str
    code: str
@app.post("/auth/verify-2fa")
async def verify_two_factor(verification_data: VerifyTwoFactor):
    username = sanitize_input(verification_data.username)
    code = sanitize_input(verification_data.code)
    with SessionLocal() as db:
        try:
            two_factor_record = db.execute(
                text("""
                    SELECT code, expires_at FROM two_factor_codes
                    WHERE username = :username
                    ORDER BY expires_at DESC
                    LIMIT 1
                """),
                {"username": username}
            ).fetchone()
            if not two_factor_record:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No 2FA code requested or found")
            stored_code, expires_at = two_factor_record
            if datetime.datetime.now(datetime.timezone.utc) > expires_at:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="2FA code expired")
            if stored_code != code:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid 2FA code")
            db.execute(
                text("DELETE FROM two_factor_codes WHERE username = :username AND code = :code"),
                {"username": username, "code": code}
            )
            db.commit()
            return {"status": "2FA verification successful"}
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to verify 2FA code"
            )

def send_email(recipient_email: str, subject: str, body: str):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL
    msg['To'] = recipient_email
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, recipient_email, msg.as_string())
        server.quit()
        print(f"Email sent successfully to {recipient_email}")
        return True
    except Exception as e:
        print(f"Failed to send email to {recipient_email}. Error: {e}")
        return False
def send_2fa_code_email(email: str, code: str):
    subject = "Ваш код двухфакторной аутентификации"
    body = f"Ваш код подтверждения: {code}\n\nЭтот код действителен в течение ограниченного времени."
    recipient_email = email
    if not send_email(recipient_email, subject, body):
        print(f"Error: Could not send 2FA code to {recipient_email}")
        pass