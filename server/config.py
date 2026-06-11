import os

class Config:
    """Application configuration"""
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    
    # Light configuration
    LIGHTS = []
    for i in range(1, 10):  # Support up to 9 lights
        mac = os.getenv(f'LIGHT_{i}_MAC')
        if mac:
            LIGHTS.append({
                'mac': mac,
                'ip': os.getenv(f'LIGHT_{i}_IP'),
                'port': int(os.getenv(f'LIGHT_{i}_PORT', 38899))
            })
    
    # Clap detection configuration
    CLAP_DETECTION_ENABLED = os.getenv('CLAP_DETECTION_ENABLED', 'false').lower() == 'true'
    CLAP_THRESHOLD = float(os.getenv('CLAP_THRESHOLD', '0.7'))
    CLAP_TIMEOUT = float(os.getenv('CLAP_TIMEOUT', '0.5'))  # seconds between claps
