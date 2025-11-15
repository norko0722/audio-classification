import librosa
import numpy as np

def extract_features(audio, sr):
    # MFCC features
    mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
    mfccs_mean = np.mean(mfccs.T, axis=0)
    
    # Chroma features
    chroma = librosa.feature.chroma_stft(y=audio, sr=sr)
    chroma_mean = np.mean(chroma.T, axis=0)
    
    # Spectral Contrast
    spectral_contrast = librosa.feature.spectral_contrast(y=audio, sr=sr)
    spectral_contrast_mean = np.mean(spectral_contrast.T, axis=0)
    
    # Zero-Crossing Rate
    zcr = librosa.feature.zero_crossing_rate(y=audio)
    zcr_mean = np.mean(zcr.T, axis=0)
    
    # Root Mean Square Energy
    rmse = librosa.feature.rms(y=audio)
    rmse_mean = np.mean(rmse.T, axis=0)
    
    # Spectral Centroid
    spectral_centroid = librosa.feature.spectral_centroid(y=audio, sr=sr)
    spectral_centroid_mean = np.mean(spectral_centroid.T, axis=0)
    
    # Spectral Bandwidth
    spectral_bandwidth = librosa.feature.spectral_bandwidth(y=audio, sr=sr)
    spectral_bandwidth_mean = np.mean(spectral_bandwidth.T, axis=0)
    
    # Spectral Flatness
    spectral_flatness = librosa.feature.spectral_flatness(y=audio)
    spectral_flatness_mean = np.mean(spectral_flatness.T, axis=0)
    
    # Tonnetz
    tonnetz = librosa.feature.tonnetz(y=audio, sr=sr)
    tonnetz_mean = np.mean(tonnetz.T, axis=0)
    
    # Combine features into a single feature vector
    features = np.concatenate((
        mfccs_mean,
        chroma_mean,
        spectral_contrast_mean,
        zcr_mean,
        rmse_mean,
        spectral_centroid_mean,
        spectral_bandwidth_mean,
        spectral_flatness_mean,
        tonnetz_mean
    ))
    
    return features