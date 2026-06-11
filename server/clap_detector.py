import numpy as np
import librosa
import threading
import time
from collections import deque

class ClapDetector:
    """
    Simple clap detection using audio energy analysis.
    Detects double claps to toggle lights.
    """
    def __init__(self, threshold=0.7, timeout=0.5):
        self.threshold = threshold
        self.timeout = timeout  # Time window for double clap (seconds)
        self.last_clap_time = 0
        self.clap_count = 0
        self.on_double_clap_callback = None
        self.is_listening = False
        self.clap_history = deque(maxlen=10)
        
    def detect_clap_in_audio(self, audio_data, sample_rate=44100):
        """
        Detect if audio contains a clap sound.
        Returns True if a clap is detected.
        """
        try:
            # Convert to float32 if needed
            if audio_data.dtype != np.float32:
                audio_data = audio_data.astype(np.float32) / np.iinfo(audio_data.dtype).max
            
            # Calculate energy in high frequency band (claps have high frequency content)
            # Apply high-pass filter
            audio_filtered = librosa.effects.preemphasis(audio_data)
            
            # Calculate short-term energy
            frame_length = int(sample_rate * 0.02)  # 20ms frames
            hop_length = int(sample_rate * 0.01)    # 10ms hop
            
            # Calculate RMS energy
            rms = librosa.feature.rms(
                y=audio_filtered,
                frame_length=frame_length,
                hop_length=hop_length
            )[0]
            
            # Detect peaks in energy
            energy_threshold = np.mean(rms) + (self.threshold * np.std(rms))
            peak_detected = np.max(rms) > energy_threshold
            
            # Additional check: spectral centroid (claps have high centroid)
            spectral_centroids = librosa.feature.spectral_centroid(
                y=audio_data,
                sr=sample_rate,
                n_fft=frame_length,
                hop_length=hop_length
            )[0]
            
            high_freq_content = np.mean(spectral_centroids) > 2000  # Hz
            
            return peak_detected and high_freq_content
            
        except Exception as e:
            print(f"Error in clap detection: {e}")
            return False
    
    def process_clap(self):
        """Process a detected clap and check for double clap pattern."""
        current_time = time.time()
        time_since_last = current_time - self.last_clap_time
        
        if time_since_last < self.timeout:
            # Second clap within timeout - it's a double clap!
            self.clap_count = 0
            self.last_clap_time = 0
            self.clap_history.append({'type': 'double_clap', 'time': current_time})
            
            if self.on_double_clap_callback:
                self.on_double_clap_callback()
            return 'double_clap'
        else:
            # First clap or timeout exceeded
            self.clap_count = 1
            self.last_clap_time = current_time
            self.clap_history.append({'type': 'single_clap', 'time': current_time})
            return 'single_clap'
    
    def set_double_clap_callback(self, callback):
        """Set callback function to be called on double clap detection."""
        self.on_double_clap_callback = callback
    
    def get_clap_history(self):
        """Get recent clap detection history."""
        return list(self.clap_history)
