
import torch
import torch.nn as nn
import timm


class AFEMv2(nn.Module):
    def __init__(self, channels=3, enhancement_strength=0.10):
        super().__init__()
        self.enhancement_strength = enhancement_strength

        self.register_buffer(
            "mean",
            torch.tensor([0.485, 0.456, 0.406]).view(1, 3, 1, 1),
        )
        self.register_buffer(
            "std",
            torch.tensor([0.229, 0.224, 0.225]).view(1, 3, 1, 1),
        )

        self.mask_network = nn.Sequential(
            nn.Conv2d(channels, 16, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(16, 16, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(16, channels, kernel_size=1),
            nn.Sigmoid(),
        )

    def forward(self, x):
        image = (x * self.std + self.mean).clamp(0, 1)

        fft = torch.fft.fftshift(
            torch.fft.fft2(image, dim=(-2, -1)),
            dim=(-2, -1),
        )
        magnitude = torch.abs(fft)
        phase = torch.angle(fft)

        magnitude_log = torch.log1p(magnitude)
        mean = magnitude_log.mean(dim=(-2, -1), keepdim=True)
        std = magnitude_log.std(dim=(-2, -1), keepdim=True) + 1e-6
        normalized = (magnitude_log - mean) / std

        mask = self.mask_network(normalized)
        enhanced_magnitude = magnitude * (
            1.0 + self.enhancement_strength * mask
        )

        enhanced_fft = torch.fft.ifftshift(
            enhanced_magnitude * torch.exp(1j * phase),
            dim=(-2, -1),
        )
        enhanced = torch.fft.ifft2(
            enhanced_fft, dim=(-2, -1)
        ).real.clamp(0, 1)

        return (enhanced - self.mean) / self.std, mask


class AFEMXceptionV2(nn.Module):
    def __init__(self, num_classes=2):
        super().__init__()
        self.afem = AFEMv2(
            channels=3,
            enhancement_strength=0.10,
        )
        self.xception = timm.create_model(
            "xception",
            pretrained=False,
            num_classes=num_classes,
        )

    def forward(self, x):
        enhanced, mask = self.afem(x)
        logits = self.xception(enhanced)
        return logits, mask
