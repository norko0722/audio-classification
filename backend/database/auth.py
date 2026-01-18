from fastapi import APIRouter
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from .database import SessionLocal
from .models import User
from .jwt_handler import create_access_token

# hash password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def user_login(email: str, password: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    if not user or not pwd_context.verify(password, user.hashed_password):
        return None, "Invalid username or password"
    
    token = create_access_token(data={"sub": email})

    user_info = {
        "id": user.id,
        "name": user.name,
        "surname": user.surname,
        "email": user.email,
        "token": token
    }
    return user_info, None