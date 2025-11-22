# Simple Dockerfile for Flask backend
FROM python:3.11-slim

# Prevent Python from writing .pyc files and buffering stdout
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install OS deps (optional minimal set)
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    build-essential \
 && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app ./app
COPY wsgi.py ./wsgi.py

# Expose app port
EXPOSE 5000

# Start server (bind to $PORT if provided)
CMD ["sh", "-c", "gunicorn -b 0.0.0.0:${PORT:-5000} wsgi:app"]
