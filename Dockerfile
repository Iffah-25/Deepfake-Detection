# Lightweight Python 3.11 base image
FROM python:3.11-slim

# Prevent Python from writing .pyc files and buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
# Uses PyTorch CPU wheel extra-index to keep image small (~600MB vs ~4.5GB with CUDA)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    --extra-index-url https://download.pytorch.org/whl/cpu

# Copy backend application source files
COPY src/ /app/src/
COPY app/ /app/app/

# Ensure checkpoints directory exists inside container for runtime download / volume mount
RUN mkdir -p /app/checkpoints

# Expose port (dynamic port used by Railway/Render/Cloud Run via $PORT)
EXPOSE 8000

# Health check to ensure service responds after download and model loading
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/api/health || exit 1

# Start Uvicorn application (shell execution ensures $PORT expansion by Railway)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
