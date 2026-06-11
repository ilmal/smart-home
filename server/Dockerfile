FROM python:3.9-slim

WORKDIR /app

# Copy application files
COPY main.py .

# Install dependencies
RUN pip install --no-cache-dir \
    flask \
    flask-restful \
    flask-cors

# Expose Flask port
EXPOSE 5000

# Run the application
CMD ["python", "main.py"]
