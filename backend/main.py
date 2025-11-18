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

