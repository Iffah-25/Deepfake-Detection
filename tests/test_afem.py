import torch
from models.afem import AFEM


def main():

    print("Starting AFEM Frequency Band Test...\n")

    # -----------------------------------------
    # Create simulated face image batch
    # -----------------------------------------

    x = torch.rand(
        2,
        3,
        224,
        224
    )

    # -----------------------------------------
    # Create AFEM
    # -----------------------------------------

    afem = AFEM(
        in_channels=3
    )

    # -----------------------------------------
    # Forward Pass
    # -----------------------------------------

    output, gate_weights = afem(x)

    # -----------------------------------------
    # Display Results
    # -----------------------------------------

    print("Input shape:")
    print(x.shape)

    print("\nOutput shape:")
    print(output.shape)

    print("\nGate weights:")
    print(gate_weights)

    print("\nLow Frequency Weights:")
    print(gate_weights[:, 0])

    print("\nMid Frequency Weights:")
    print(gate_weights[:, 1])

    print("\nHigh Frequency Weights:")
    print(gate_weights[:, 2])

    # -----------------------------------------
    # Tests
    # -----------------------------------------

    # Output must have same shape
    assert x.shape == output.shape, (
        "ERROR: Output shape does not match input shape"
    )

    # Gate must generate 3 weights
    assert gate_weights.shape == (2, 3), (
        "ERROR: Gate weights should have shape [Batch, 3]"
    )

    # Gate values must be between 0 and 1
    assert torch.all(gate_weights >= 0), (
        "ERROR: Gate weights below 0"
    )

    assert torch.all(gate_weights <= 1), (
        "ERROR: Gate weights above 1"
    )

    # Output should not contain NaN values
    assert not torch.isnan(output).any(), (
        "ERROR: Output contains NaN values"
    )

    print("\n====================================")
    print("AFEM FREQUENCY BAND TEST PASSED!")
    print("====================================")


if __name__ == "__main__":
    main()