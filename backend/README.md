# Backend - Audio Classification API

FastAPI backend server for audio genre classification.

## Description

Backend implementation using FastAPI that provides REST API endpoints for audio file upload and genre classification. The system processes audio files, extracts key audio features (MFCC, Chroma, Spectral Centroid) using Python and the Librosa library, and classifies audio files into predefined genres with an XGBoost classifier.

## Getting Started

### Dependencies

Before running the project, make sure you have the following installed:

* Python 3.12+
* pip / venv
* Libraries listed in `requirements.txt`

### Installing

1. Create and activate a virtual environment:
   
   ```bash
   python3 -m venv venv
   source venv/bin/activate   # Linux/Mac
   venv\Scripts\activate      # Windows
   ```

2. Install dependencies:
   
   ```bash
   pip install -r requirements.txt
   ```

## Running

Z koreňového adresára backendu:

```bash
cd backend
source venv/bin/activate  # ak ešte nie je aktivovaný
uvicorn main:app --reload
```

Server bude bežať na `http://localhost:8000`.

## API Documentation

After starting the server, automatic API documentation is available:
* Swagger UI: `http://localhost:8000/docs`
* ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── main.py              # FastAPI application (routes, startup)
├── database/
│   ├── database.py      # DB engine/session configuration (SQLite)
│   └── models.py        # SQLAlchemy models (e.g. classification history)
├── models/              # Trained ML artifacts (scaler, label encoder, model)
│   ├── label_encoder.pkl
│   ├── scaler.pkl
│   └── trained_model.pkl
├── services/            # Business logic and audio processing
│   ├── feature_extractor.py
│   └── model_service.py
├── requirements.txt     # Python dependencies
└── README.md            # This file
```

## Help

If you encounter errors related to missing dependencies, try:
```bash
pip install -r requirements.txt --upgrade
```

## Authors

* Norbert Balucha - @norko0722

