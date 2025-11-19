from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import librosa
import numpy as np
from collections import Counter
from services.model_service import model_service
import tempfile
import os

app = FastAPI()

@app.get("/")
async def root():
    return { "message": "Audio Genre Classification Project Norbert Balucha - FastAPI" }

@app.post("/classification")
async def audio_classification(file: UploadFile = File(...), segment_duration: int = 10):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file uploaded!"
        )
    if not file.endswith(".wav"):
        raise HTTPException(
            status_code=415,
            detail="File must be in .wav format"
        )
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

    except Exception:
        raise HTTPException(status_code=500, detail='Something went wrong')
    finally:
        file.file.close()
