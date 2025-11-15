import joblib
from pathlib import Path

class ModelService:
    def __init__(self):
        models_dir = Path(__file__).parent.parent / "models"
        self.model = joblib.load(models_dir / "trained_model.pkl")
        self.scaler = joblib.load(models_dir / "scaler.pkl")
        self.label_encoder = joblib.load(models_dir / "label_encoder.pkl")
    