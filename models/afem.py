import torch
import torch.nn as nn


class AdaptiveGate(nn.Module):
    """
    Lightweight gating network.

    It analyses the input image and produces one adaptive
    enhancement weight for each image.
    """

    def __init__(self, in_channels=3):
        super().__init__()

        self.gate = nn.Sequential(

            # Depth-wise convolution
            nn.Conv2d(
                in_channels,
                in_channels,
                kernel_size=3,
                padding=1,
                groups=in_channels
            ),

            nn.ReLU(),

            # Point-wise convolution
            nn.Conv2d(
                in_channels,
                16,
                kernel_size=1
            ),

            nn.ReLU(),

            # Global feature extraction
            nn.AdaptiveAvgPool2d(1),

            nn.Flatten(),

            # Produce one gating value
            nn.Linear(16, 1),

            # Keep the value between 0 and 1
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.gate(x)


class AFEM(nn.Module):
    """
    Adaptive Frequency Enhancement Module.

    Pipeline:
    Input
      -> Adaptive Gate
      -> FFT
      -> Amplitude / Phase Separation
      -> Adaptive Amplitude Enhancement
      -> Frequency Reconstruction
      -> iFFT
      -> Output
    """

    def __init__(self, in_channels=3):
        super().__init__()

        self.gate = AdaptiveGate(in_channels)

    def forward(self, x):

        # -----------------------------------
        # Step 1: Calculate adaptive gate
        # -----------------------------------

        gate_weight = self.gate(x)

        # Reshape from [B, 1] to [B, 1, 1, 1]
        gate_weight = gate_weight.view(
            -1, 1, 1, 1
        )

        # -----------------------------------
        # Step 2: FFT
        # -----------------------------------

        fft_features = torch.fft.fft2(
            x,
            dim=(-2, -1)
        )

        # -----------------------------------
        # Step 3: Separate amplitude and phase
        # -----------------------------------

        amplitude = torch.abs(fft_features)
        phase = torch.angle(fft_features)

        # -----------------------------------
        # Step 4: Adaptive enhancement
        # -----------------------------------

        # Scale amplitude according to gate
        enhanced_amplitude = amplitude * (
            1.0 + gate_weight
        )

        # -----------------------------------
        # Step 5: Reconstruct complex features
        # -----------------------------------

        real = enhanced_amplitude * torch.cos(phase)
        imaginary = enhanced_amplitude * torch.sin(phase)

        enhanced_fft = torch.complex(
            real,
            imaginary
        )

        # -----------------------------------
        # Step 6: Inverse FFT
        # -----------------------------------

        output = torch.fft.ifft2(
            enhanced_fft,
            dim=(-2, -1)
        ).real

        return output, gate_weight