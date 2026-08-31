print("Program started")

import torch
from models.afem import AFEM

print("PyTorch imported successfully")

# Simulate a batch of face images
x = torch.rand(2, 3, 224, 224)

print("Input tensor created")

# Create AFEM
afem = AFEM()

print("AFEM model created")

# Run AFEM
output = afem(x)

print("AFEM executed")

print("Input shape:", x.shape)
print("Output shape:", output.shape)

# Check reconstruction error
error = torch.mean(torch.abs(x - output))

print("Reconstruction error:", error.item())

print("Program finished")