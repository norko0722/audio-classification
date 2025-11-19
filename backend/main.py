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

@app.pos("/classification")
async def audio_classification(file: UploadFile = File(...), segment_duration: int = 10):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file uploaded!"
        )
    else:
        if not file.endswith(".wav"):
            raise HTTPException(
                status_code=400,
                detail="File must be in .wav format"
            )
        else:
            audio, sr = librosa.load(file_path, sr=22050)
            total_duration = librosa.get_duration(y=audio, sr=sr)
            segment_samples = int(segment_duration * sr)

            predicted_genres = []

            for i in range(0, len(audio), segment_samples):
                segment = audio[i : i + segment_samples]

                if len(segment) < segment_samples:
                    print(f"Segment length {len(segment)} is less than {segment_samples}, skipping segment.")
                continue
            
                genre = model_service.predict(segment, sr)
                predicted_genres.append(genre)