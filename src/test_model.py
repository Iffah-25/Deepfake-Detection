
from pathlib import Path

import torch
from afem_model import AFEMXceptionV2


ROOT = Path(__file__).resolve().parent.parent
CHECKPOINT = ROOT / "checkpoints" / "afem_v2_xception_best.pth"

print("Loading AFEM-Xception model...")
model = AFEMXceptionV2(num_classes=2)

checkpoint = torch.load(
    CHECKPOINT,
    map_location="cpu",
    weights_only=True,
)

# Support checkpoints saved either as a state dictionary
# or as a dictionary containing the model state.
if "state_dict" in checkpoint:
    checkpoint = checkpoint["state_dict"]
elif "model_state_dict" in checkpoint:
    checkpoint = checkpoint["model_state_dict"]

model.load_state_dict(checkpoint, strict=True)
model.eval()

print("Checkpoint loaded successfully.")

dummy_image = torch.zeros(1, 3, 224, 224)

with torch.inference_mode():
    logits, mask = model(dummy_image)

print("Logits shape:", tuple(logits.shape))
print("Mask shape:", tuple(mask.shape))
print("Outputs finite:", bool(torch.isfinite(logits).all()))
print("Mask finite:", bool(torch.isfinite(mask).all()))
print("MODEL TEST PASSED")
