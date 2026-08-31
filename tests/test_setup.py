import torch
import torchvision
import numpy as np
import cv2
import sklearn
import matplotlib
import timm

print("All main libraries imported successfully!")
print()

print("PyTorch version:", torch.__version__)
print("Torchvision version:", torchvision.__version__)
print("NumPy version:", np.__version__)
print("CUDA available:", torch.cuda.is_available())

# Test PyTorch tensor
x = torch.rand(2, 3)
print("\nPyTorch test tensor:")
print(x)