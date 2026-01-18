from fastapi import FastAPI, UploadFile, File, HTTPException
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

app = FastAPI()

def get_db():
    from database.database import SessionLocal
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

@app.post("/sign-in")
def sign_in(email: str, password: str, db: Session = Depends(get_db)):
    user_info, error = user_login(email, password, db)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return user_info

@app.post("/classification")
async def audio_classification(file: UploadFile = File(...), segment_duration: int = 10):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file uploaded!"
        )
    if file.content_type not in ["audio/wav", "audio/x-wav"]: 
        raise HTTPException(
            status_code=415,
            detail="File must be in .wav format"
        )

    tmp_path = None

    MAX_FILE_SIZE_MB = 150
    
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            content = await file.read()
            if len(content) > MAX_FILE_SIZE_MB * 1024 * 1024:
                raise HTTPException(
                    status_code=413,
                    detail=f"File is too large, the maximum limit is {MAX_FILE_SIZE_MB} MB"
                )
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

        rms = librosa.feature.rms(y=audio)[0]
        rms_timeseries = rms.tolist()

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

        return JSONResponse(content={
            "genre": main_genre,
            "percentages": percentages,
            "filename": file.filename,
            "audio_metadata": {
                "duration": total_duration,
                "sample_rate": sr,
                "total_segments": total_segments,
                "segment_duration": segment_duration
            },
            "rms_loudness": rms_timeseries,
            "spectrogram": spectrogram_base64
        })

    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing audio file: {str(e)}"
        )
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)
