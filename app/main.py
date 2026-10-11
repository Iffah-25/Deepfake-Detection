
import hashlib
import io
import logging
import os
import time
import urllib.request
import uuid
from pathlib import Path

import torch
from PIL import Image, UnidentifiedImageError
from torchvision import transforms
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from src.afem_model import AFEMXceptionV2

logger = logging.getLogger("uvicorn.error")

ROOT = Path(__file__).resolve().parent.parent
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

# Resolve checkpoint path and download from URL if missing
CHECKPOINT_PATH_ENV = os.getenv("CHECKPOINT_PATH")
CHECKPOINT = Path(CHECKPOINT_PATH_ENV) if CHECKPOINT_PATH_ENV else (ROOT / "checkpoints" / "afem_v2_xception_best.pth")
CHECKPOINT_URL = os.getenv("CHECKPOINT_URL")

if not CHECKPOINT.exists() and CHECKPOINT_URL:
    try:
        logger.info(f"Checkpoint not found locally. Downloading from: {CHECKPOINT_URL}")
        CHECKPOINT.parent.mkdir(parents=True, exist_ok=True)
        temp_checkpoint = CHECKPOINT.with_suffix(".tmp")
        req = urllib.request.Request(
            CHECKPOINT_URL,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) FreqGuard-Backend/1.0"}
        )
        with urllib.request.urlopen(req) as resp, open(temp_checkpoint, "wb") as out_f:
            chunk_size = 1024 * 1024  # 1 MB chunks
            downloaded = 0
            while True:
                chunk = resp.read(chunk_size)
                if not chunk:
                    break
                out_f.write(chunk)
                downloaded += len(chunk)
                if downloaded % (10 * 1024 * 1024) == 0:
                    logger.info(f"Downloading checkpoint: {downloaded / (1024 * 1024):.1f} MB received...")
        temp_checkpoint.replace(CHECKPOINT)
        logger.info(f"Checkpoint successfully downloaded ({downloaded / (1024 * 1024):.2f} MB) to: {CHECKPOINT}")
    except Exception as e:
        logger.error(f"Failed to download checkpoint from {CHECKPOINT_URL}: {e}")
        raise RuntimeError(f"Failed to download checkpoint from CHECKPOINT_URL: {e}")

if not CHECKPOINT.exists():
    raise FileNotFoundError(
        f"Checkpoint not found at '{CHECKPOINT}'. "
        "Place afem_v2_xception_best.pth in checkpoints/ or set the CHECKPOINT_URL environment variable."
    )

app = FastAPI(
    title="AFEM Deepfake Detection API",
    version="1.0.0",
)

# Dynamic CORS Configuration
DEFAULT_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
env_origins = os.getenv("ALLOWED_ORIGINS", "")
if env_origins:
    allowed_origins = [orig.strip() for orig in env_origins.split(",") if orig.strip()]
    for default in DEFAULT_ORIGINS:
        if default not in allowed_origins:
            allowed_origins.append(default)
else:
    allowed_origins = DEFAULT_ORIGINS

# Support regex for Vercel preview & production deployments (*.vercel.app)
# Pass ALLOWED_ORIGIN_REGEX="" to disable regex matching
allowed_origin_regex = os.getenv("ALLOWED_ORIGIN_REGEX", r"^https://.*\.vercel\.app$")
if allowed_origin_regex == "":
    allowed_origin_regex = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=allowed_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = AFEMXceptionV2(num_classes=2)

checkpoint = torch.load(
    CHECKPOINT,
    map_location="cpu",
    weights_only=True,
)

if "state_dict" in checkpoint:
    checkpoint = checkpoint["state_dict"]
elif "model_state_dict" in checkpoint:
    checkpoint = checkpoint["model_state_dict"]

model.load_state_dict(checkpoint, strict=True)
model.to(DEVICE)
model.eval()

preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "model": "AFEM-Xception-v2",
        "device": str(DEVICE),
        "checkpoint": CHECKPOINT.name,
    }


@app.post("/api/detect")
async def detect(file: UploadFile = File(...)):
    if file.content_type not in {
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/bmp",
    }:
        raise HTTPException(
            status_code=415,
            detail="Upload a JPEG, PNG, WEBP, or BMP image.",
        )

    contents = await file.read(MAX_FILE_SIZE + 1)

    if not contents:
        raise HTTPException(status_code=400, detail="The file is empty.")

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image must be 10 MB or smaller.",
        )

    file_hash = hashlib.sha256(contents).hexdigest()

    try:
        with Image.open(io.BytesIO(contents)) as image:
            image = image.convert("RGB")
            image.load()
    except (UnidentifiedImageError, OSError, ValueError):
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid image.",
        )

    input_tensor = preprocess(image).unsqueeze(0).to(DEVICE)

    start = time.perf_counter()

    try:
        with torch.inference_mode():
            logits, mask = model(input_tensor)
            probabilities = torch.softmax(logits, dim=1)[0]
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Model inference failed.",
        )

    elapsed_ms = round((time.perf_counter() - start) * 1000, 2)

    real_probability = float(probabilities[0].item())
    fake_probability = float(probabilities[1].item())

    prediction = "FAKE" if fake_probability >= real_probability else "REAL"
    confidence = max(real_probability, fake_probability) * 100

    return {
        "analysisId": str(uuid.uuid4()),
        "result": prediction,
        "confidence": round(confidence, 2),
        "processingTime": elapsed_ms,
        "modelVersion": "AFEM-Xception-v2",
        "fileHash": file_hash,
        "message": (
            "Model prediction only; this result is not definitive proof "
            "of authenticity or manipulation."
        ),
        "metrics": {
            "realProbability": round(real_probability * 100, 2),
            "fakeProbability": round(fake_probability * 100, 2),
            "maskMean": round(float(mask.mean().item()), 4),
            "sha256": file_hash,
        },
    }

