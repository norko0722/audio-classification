import joblib
from pathlib import Path
import numpy as np
from .feature_extractor import extract_features

class ModelService:
    def __init__(self):
        models_dir = Path(__file__).parent.parent / "models"
        self.model = joblib.load(models_dir / "trained_model.pkl")
        self.scaler = joblib.load(models_dir / "scaler.pkl")
        self.label_encoder = joblib.load(models_dir / "label_encoder.pkl")
    
    def predict(self, audio, sr):
        features = extract_features(audio, sr)
        features = features.reshape(1, -1)
        features_scaled = self.scaler.transform(features)
    
        prediction = self.model.predict(features_scaled)

        genre = self.label_encoder.inverse_transform(prediction)[0]
    
        return genre


model_service = ModelService()