import torch
from models.afem import AFEM


print("Starting AFEM adaptive gating test...\n")

# Create a simulated batch of images
x = torch.rand(2, 3, 224, 224)

# Initialize AFEM
afem = AFEM()

# Forward pass
output, gate_weight = afem(x)

# Print information
print("Input shape:", x.shape)
print("Output shape:", output.shape)
print("Gate weights:", gate_weight.flatten())

# Check shapes
assert x.shape == output.shape

# Check gate values
assert torch.all(gate_weight >= 0)
assert torch.all(gate_weight <= 1)

print("\nAFEM adaptive gating test passed successfully!")