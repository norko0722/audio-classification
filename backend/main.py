from tkinter.tix import Form
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import librosa
import numpy as np
import matplotlib.pyplot as plt
import io
import base64
from collections import Counter
from services.model_service import model_service
import tempfile
import os

from sqlalchemy.orm import Session
from database.database import SessionLocal, engine, Base
from database.models import User, Classification
from passlib.context import CryptContext

from pydantic import BaseModel, EmailStr

from tkinter.tix import Form

class SignInRequest(BaseModel):
    email: str
    password: str

class SignUpRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

Base.metadata.create_all(bind=engine)

def create_test_user():
    db = SessionLocal()
    test_email = "rybansky@test.com"
    user = db.query(User).filter(User.email == test_email).first()
    
    if not user:
        raw_password = "heslo123"
        raw_password = raw_password[:72]
        hashed_pswd = pwd_context.hash(raw_password)

        user = User(
            username="Vincent",
            email=test_email,
            hashed_password=hashed_pswd
        )
        db.add(user)
        db.commit()
        print("Test user created:", test_email, "/ heslo123")

    db.close()

create_test_user()

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return { "message": "Audio Genre Classification Project Norbert Balucha - FastAPI" }

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def user_login(email: str, password: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None, "Invalid email or password"
    
    if not pwd_context.verify(password, user.hashed_password):
        return None, "Invalid email or password"
    
    user_info = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "token": "mock-jwt-token"
    }
    return user_info, None

@app.post("/sign-in")
def sign_in(payload: SignInRequest, db: Session = Depends(get_db)):
    user_info, error = user_login(payload.email, payload.password, db)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return user_info

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def register_user(db: Session, username: str, email: str, password: str):
    if get_user_by_email(db, email):
        return {"error": "Email already registered"}

    if get_user_by_username(db, username):
        return {"error": "Username already exists"}

    password_hash = hash_password(password)

    user = User(
        username=username,
        email=email,
        hashed_password=password_hash
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)

        return {
            "message": "User registered successfully",
            "user_id": user.id,
            "username": user.username,
            "email": user.email
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    
@app.post("/sign-up")
def sign_up(payload: SignUpRequest, db: Session = Depends(get_db)):
    result = register_user(
        db=db,
        username=payload.username,
        email=payload.email,
        password=payload.password
    )

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result

@app.post("/classification")
async def audio_classification(file: UploadFile = File(...), segment_duration: int = 10, user_id: int = Form(...), db: Session = Depends(get_db)):
    if not file.filename:
        raise HTTPException(400, "No file uploaded!")
    if file.content_type not in ["audio/wav", "audio/x-wav"]:
        raise HTTPException(415, "File must be in .wav format")

    tmp_path = None
    MAX_FILE_SIZE_MB = 150
    
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            content = await file.read()
            if len(content) > MAX_FILE_SIZE_MB * 1024 * 1024:
                raise HTTPException(413, f"File is too large, max {MAX_FILE_SIZE_MB} MB")
            tmp.write(content)
            tmp_path = tmp.name

        audio, sr = librosa.load(tmp_path, sr=22050)
        total_duration = librosa.get_duration(y=audio, sr=sr)
        segment_samples = int(segment_duration * sr)

        fig, ax = plt.subplots(figsize=(10, 4))
        D = librosa.amplitude_to_db(librosa.stft(audio), ref=np.max)
        img = librosa.display.specshow(D, x_axis='time', y_axis='hz', ax=ax, sr=sr)
        fig.colorbar(img, ax=ax, format='%+2.0f dB')
        ax.set_title('Spectrogram')
        
        buf = io.BytesIO()
        fig.savefig(buf, format='png', bbox_inches='tight')
        buf.seek(0)
        spectrogram_base64 = base64.b64encode(buf.read()).decode('utf-8')
        plt.close(fig)

        predicted_genres = []
        for i in range(0, len(audio), segment_samples):
            segment = audio[i : i + segment_samples]
            if len(segment) < segment_samples:
                continue
            genre = model_service.predict(segment, sr)
            predicted_genres.append(genre)

        if not predicted_genres:
            raise HTTPException(400, "Audio file is too short to process")
        
        counter = Counter(predicted_genres)
        total_segments = len(predicted_genres)
        percentages = {
            genre: round((count / total_segments) * 100, 2)
            for genre, count in counter.items()
        }
        main_genre = max(percentages, key=percentages.get)

        classification_entry = Classification(
            filename=file.filename,
            genre=main_genre,
            confidence=str(percentages[main_genre]),
            duration=total_duration,
            sample_rate=sr,
            user_id=user_id
        )

        db.add(classification_entry)
        db.commit()
        db.refresh(classification_entry)

        return JSONResponse(content={
            "id": classification_entry.id,
            "genre": main_genre,
            "percentages": percentages,
            "filename": file.filename,
            "audio_metadata": {
                "duration": total_duration,
                "sample_rate": sr,
                "total_segments": total_segments,
                "segment_duration": segment_duration
            },
            "rms_loudness": librosa.feature.rms(y=audio)[0].tolist(),
            "spectrogram": spectrogram_base64
        })

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)

@app.get("/history/{user_id}")
def get_classifications_history(user_id: int, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    classifications = db.query(Classification).filter(Classification.user_id == user_id).offset(skip).limit(limit).all()
    return classifications
