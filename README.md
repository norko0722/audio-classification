# Audio Genre Classification

Machine learning project for classifying music genre, where user uploads audio file in Web UI and as result will see Music Genre.

## Description

This project implements an audio genre classification system using Python and for Web UI perform JavaScript and Tailwind CSS.
The project focuses on training an AI model to recognize basic music genres. It implements an automated system that extracts key audio features (MFCC, Chroma, Spectral Centroid) using Python and the Librosa library, and classifies audio files into predefined genres with an XGBoost classifier.

## Project Structure

```
audio-classification/
├── backend/          # FastAPI backend server
│   ├── main.py       # FastAPI application
│   ├── models/       # ML models and classification logic
│   ├── services/     # Business logic and audio processing
│   └── README.md     # Backend documentation
├── frontend/         # Web UI application
│   ├── src/          # Source files
│   └── README.md     # Frontend documentation
└── README.md         # This file
```

## Getting Started

### Dependencies

Before running the project, make sure you have the following installed:

* Python 3.12+
* Node.js (v18+)
* pip / venv
* npm
* Libraries listed in `backend/requirements.txt`

### Installing

1. Clone this repository:
   
   ```bash
   git clone git@github.com:norko0722/audio-classification.git
   cd audio-classification
   ```

2. **Backend Setup:**
   
   See [backend/README.md](./backend/README.md) for detailed instructions.
   
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate   # Linux/Mac
   venv\Scripts\activate      # Windows
   pip install -r requirements.txt
   ```

3. **Frontend Setup:**
   
   See [frontend/README.md](./frontend/README.md) for detailed instructions.
   
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

### Backend

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`

### Frontend

```bash
cd frontend
npm start
```

## Help

If you encounter errors related to missing dependencies:

* Backend: `pip install -r requirements.txt --upgrade`
* Frontend: `npm install`

## Authors

* Norbert Balucha - @norko0722

