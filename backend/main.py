from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import librosa
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
    if not file.filename.lower().endswith(".wav"): 
        raise HTTPException(
            status_code=415,
            detail="File must be in .wav format"
        )

    tmp_path = None
    
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        audio, sr = librosa.load(tmp_path, sr=22050)
        total_duration = librosa.get_duration(y=audio, sr=sr)
        segment_samples = int(segment_duration * sr)

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
            }
        })

    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing audio file: {str(e)}"
        )
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)
