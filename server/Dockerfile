FROM python:3.9-slim

WORKDIR /app

# Install system dependencies for audio processing
RUN apt-get update && apt-get install -y \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy application files
COPY *.py ./

# Install Python dependencies
RUN pip install --no-cache-dir \
    flask \
    flask-restful \
    flask-cors \
    flask-socketio \
    python-socketio \
    librosa \
    numpy \
    soundfile

# Expose Flask port
EXPOSE 5000

# Run the application
CMD ["python", "main.py"]
