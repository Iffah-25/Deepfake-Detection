import torch
import torch.nn as nn


def create_frequency_masks(height, width, device):
    """
    Creates Low, Mid and High frequency masks.

    The masks are created based on the radial distance
    from the center of the FFT-shifted frequency spectrum.

    Low Frequency:  0% - 25%
    Mid Frequency:  25% - 60%
    High Frequency: 60% - 100%
    """

    # Create coordinate arrays
    y = torch.arange(height, device=device)
    x = torch.arange(width, device=device)

    # Create 2D coordinate grid
    yy, xx = torch.meshgrid(
        y,
        x,
        indexing="ij"
    )

    # Calculate center of frequency spectrum
    center_y = height // 2
    center_x = width // 2

    # Calculate radial distance from center
    distance = torch.sqrt(
        (yy - center_y) ** 2 +
        (xx - center_x) ** 2
    )

    # Maximum distance from center
    max_distance = torch.max(distance)

    # Frequency band thresholds
    low_threshold = max_distance * 0.25
    mid_threshold = max_distance * 0.60

    # Low-frequency mask
    low_mask = distance <= low_threshold

    # Mid-frequency mask
    mid_mask = (
        (distance > low_threshold) &
        (distance <= mid_threshold)
    )

    # High-frequency mask
    high_mask = distance > mid_threshold

    return (
        low_mask.float(),
        mid_mask.float(),
        high_mask.float()
    )


class AdaptiveGate(nn.Module):
    """
    Lightweight Adaptive Gating Network.

    Uses depth-wise separable convolutions to analyse
    the input image and generate three adaptive weights:

        [Low Frequency Weight,
         Mid Frequency Weight,
         High Frequency Weight]
    """

    def __init__(self, in_channels=3):
        super().__init__()

        self.gate = nn.Sequential(

            # ---------------------------------
            # Depth-wise convolution
            # ---------------------------------
            nn.Conv2d(
                in_channels,
                in_channels,
                kernel_size=3,
                padding=1,
                groups=in_channels
            ),

            nn.ReLU(),

            # ---------------------------------
            # Point-wise convolution
            # ---------------------------------
            nn.Conv2d(
                in_channels,
                16,
                kernel_size=1
            ),

            nn.ReLU(),

            # ---------------------------------
            # Global Average Pooling
            # ---------------------------------
            nn.AdaptiveAvgPool2d(1),

            # ---------------------------------
            # Flatten
            # ---------------------------------
            nn.Flatten(),

            # ---------------------------------
            # Generate 3 frequency weights
            # ---------------------------------
            nn.Linear(
                16,
                3
            ),

            # Keep values between 0 and 1
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.gate(x)


class AFEM(nn.Module):
    """
    Adaptive Frequency Enhancement Module (AFEM).

    Pipeline:

        Input Image
             ↓
      Adaptive Gate Network
             ↓
      Low / Mid / High Weights
             ↓
             FFT
             ↓
          FFT Shift
             ↓
     Amplitude / Phase Split
             ↓
    Low / Mid / High Band Masks
             ↓
      Adaptive Enhancement
             ↓
    Recombine Amplitude + Phase
             ↓
        Inverse FFT Shift
             ↓
             iFFT
             ↓
        Enhanced Output
    """

    def __init__(self, in_channels=3):
        super().__init__()

        # Adaptive Gating Network
        self.gate = AdaptiveGate(
            in_channels=in_channels
        )

    def forward(self, x):

        # =====================================
        # STEP 1: Generate Adaptive Band Weights
        # =====================================

        # Shape: [B, 3]
        gate_weights = self.gate(x)

        # Extract Low Frequency Weight
        low_weight = gate_weights[:, 0].view(
            -1, 1, 1, 1
        )

        # Extract Mid Frequency Weight
        mid_weight = gate_weights[:, 1].view(
            -1, 1, 1, 1
        )

        # Extract High Frequency Weight
        high_weight = gate_weights[:, 2].view(
            -1, 1, 1, 1
        )

        # =====================================
        # STEP 2: Fast Fourier Transform
        # =====================================

        fft_features = torch.fft.fft2(
            x,
            dim=(-2, -1)
        )

        # =====================================
        # STEP 3: Shift Low Frequencies to Center
        # =====================================

        fft_features = torch.fft.fftshift(
            fft_features,
            dim=(-2, -1)
        )

        # =====================================
        # STEP 4: Separate Amplitude and Phase
        # =====================================

        amplitude = torch.abs(
            fft_features
        )

        phase = torch.angle(
            fft_features
        )

        # =====================================
        # STEP 5: Get Image Dimensions
        # =====================================

        height = x.shape[-2]
        width = x.shape[-1]

        # =====================================
        # STEP 6: Create Frequency Band Masks
        # =====================================

        low_mask, mid_mask, high_mask = (
            create_frequency_masks(
                height,
                width,
                x.device
            )
        )

        # Reshape masks to:
        #
        # [1, 1, H, W]
        #
        # This allows broadcasting over:
        #
        # [B, C, H, W]

        low_mask = low_mask.unsqueeze(0).unsqueeze(0)

        mid_mask = mid_mask.unsqueeze(0).unsqueeze(0)

        high_mask = high_mask.unsqueeze(0).unsqueeze(0)

        # =====================================
        # STEP 7: Adaptive Frequency Enhancement
        # =====================================

        # Each frequency band receives
        # a different adaptive scaling value.

        enhancement_map = (

            # Low Frequency Region
            low_mask * (
                1.0 + low_weight
            )

            +

            # Mid Frequency Region
            mid_mask * (
                1.0 + mid_weight
            )

            +

            # High Frequency Region
            high_mask * (
                1.0 + high_weight
            )
        )

        # Apply enhancement
        enhanced_amplitude = (
            amplitude *
            enhancement_map
        )

        # =====================================
        # STEP 8: Reconstruct Complex Spectrum
        # =====================================

        real = (
            enhanced_amplitude *
            torch.cos(phase)
        )

        imaginary = (
            enhanced_amplitude *
            torch.sin(phase)
        )

        enhanced_fft = torch.complex(
            real,
            imaginary
        )

        # =====================================
        # STEP 9: Reverse FFT Shift
        # =====================================

        enhanced_fft = torch.fft.ifftshift(
            enhanced_fft,
            dim=(-2, -1)
        )

        # =====================================
        # STEP 10: Inverse FFT
        # =====================================

        output = torch.fft.ifft2(
            enhanced_fft,
            dim=(-2, -1)
        ).real

        # =====================================
        # Return Output + Adaptive Weights
        # =====================================

        return output, gate_weights