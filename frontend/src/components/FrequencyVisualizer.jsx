import React, { useEffect, useRef, useState } from "react";
import { Activity, Radio, Zap, Eye, RotateCw } from "lucide-react";

export default function FrequencyVisualizer({ result = "FAKE", interactive = true }) {
  const canvasRef = useRef(null);
  const [filterMode, setFilterMode] = useState("fft"); // 'fft' | 'highpass' | 'dct'
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let angle = 0;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const render = () => {
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, width, height);

      // Draw Grid lines
      ctx.strokeStyle = "rgba(51, 65, 85, 0.4)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Concentric Frequency Bands
      const rings = [20, 40, 60, 80, 100, 120];
      rings.forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        ctx.strokeStyle = idx % 2 === 0 ? "rgba(99, 102, 241, 0.25)" : "rgba(56, 189, 248, 0.15)";
        ctx.stroke();
      });

      // Draw Simulated 2D-FFT Energy distribution
      const isFake = result === "FAKE";
      const isUncertain = result === "UNCERTAIN";

      // 1. Center DC Component (Low frequency image fundamentals)
      const gradCenter = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 35);
      gradCenter.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      gradCenter.addColorStop(0.3, "rgba(99, 102, 241, 0.8)");
      gradCenter.addColorStop(0.7, "rgba(168, 85, 247, 0.4)");
      gradCenter.addColorStop(1, "rgba(15, 23, 42, 0)");
      ctx.fillStyle = gradCenter;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 35, 0, 2 * Math.PI);
      ctx.fill();

      // 2. High Frequency Artifact Peaks (GAN / Diffusion spectral spikes)
      if (isFake) {
        // Artifact spikes in frequency domain (characteristic grid/spikes of upsampling/transposed conv)
        const spikeCount = 8;
        for (let i = 0; i < spikeCount; i++) {
          const theta = (i * (2 * Math.PI / spikeCount)) + (isRotating ? angle : 0);
          const dist = 70 + Math.sin(angle * 2 + i) * 8;
          const px = centerX + Math.cos(theta) * dist;
          const py = centerY + Math.sin(theta) * dist;

          const spikeGrad = ctx.createRadialGradient(px, py, 0, px, py, 12);
          spikeGrad.addColorStop(0, "rgba(244, 63, 94, 0.9)");
          spikeGrad.addColorStop(0.5, "rgba(236, 72, 153, 0.5)");
          spikeGrad.addColorStop(1, "rgba(244, 63, 94, 0)");
          ctx.fillStyle = spikeGrad;
          ctx.beginPath();
          ctx.arc(px, py, 12, 0, 2 * Math.PI);
          ctx.fill();
        }

        // Concentric high-frequency artifact ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, 75, 0, 2 * Math.PI);
        ctx.strokeStyle = "rgba(244, 63, 94, 0.6)";
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (isUncertain) {
        // Blurry noisy frequency distribution
        for (let i = 0; i < 4; i++) {
          const theta = (i * Math.PI / 2) + angle;
          const px = centerX + Math.cos(theta) * 55;
          const py = centerY + Math.sin(theta) * 55;
          ctx.fillStyle = "rgba(245, 158, 11, 0.4)";
          ctx.beginPath();
          ctx.arc(px, py, 16, 0, 2 * Math.PI);
          ctx.fill();
        }
      } else {
        // Natural Smooth Power Spectrum Decay (Authentic media)
        const naturalGrad = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 110);
        naturalGrad.addColorStop(0, "rgba(16, 185, 129, 0.3)");
        naturalGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.1)");
        naturalGrad.addColorStop(1, "rgba(15, 23, 42, 0)");
        ctx.fillStyle = naturalGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 110, 0, 2 * Math.PI);
        ctx.fill();
      }

      // 3. Radar Sweep Line
      const sweepX = centerX + Math.cos(angle) * 125;
      const sweepY = centerY + Math.sin(angle) * 125;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(sweepX, sweepY);
      ctx.strokeStyle = isFake ? "rgba(244, 63, 94, 0.7)" : "rgba(99, 102, 241, 0.7)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      angle += 0.02;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [result, isRotating, filterMode]);

  return (
    <div className="glass-card rounded-2xl p-4 border border-slate-800/80 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span className="font-bold text-slate-200 uppercase tracking-wider font-mono">2D-FFT Magnitude Spectrum</span>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
          {result === "FAKE" ? "Spectral Anomalies Detected" : result === "REAL" ? "Natural 1/f Decay" : "Inconclusive Spectrum"}
        </span>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-slate-700/60 shadow-inner bg-slate-950">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="w-[280px] h-[280px] block"
        />
        {/* Frequency Overlay Tags */}
        <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
          DC / Low Freq (Center)
        </div>
        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
          High Freq (Periphery)
        </div>
      </div>

      {interactive && (
        <div className="w-full mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex space-x-1.5">
            <button
              onClick={() => setFilterMode("fft")}
              className={`px-2 py-1 rounded text-[11px] font-mono transition ${filterMode === "fft" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
            >
              2D-FFT
            </button>
            <button
              onClick={() => setFilterMode("highpass")}
              className={`px-2 py-1 rounded text-[11px] font-mono transition ${filterMode === "highpass" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
            >
              Azimuthal
            </button>
          </div>
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-white"
          >
            <RotateCw className="w-3 h-3" />
            <span>{isRotating ? "Pause Scan" : "Resume"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
