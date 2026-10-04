import React from "react";
import { 
  FileUp, 
  Crop, 
  Radio, 
  Cpu, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Sliders,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import FrequencyVisualizer from "../components/FrequencyVisualizer";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Media Ingestion & Integrity Check",
      icon: FileUp,
      details: [
        "MIME type validation (PNG, JPG, WEBP, MP4, MOV, WEBM).",
        "Header verification and extraction of metadata (EXIF/codec details).",
        "Stream sanitization to prevent corrupted buffer overflow."
      ]
    },
    {
      num: "02",
      title: "Spatial Preprocessing & Face Alignment",
      icon: Crop,
      details: [
        "Facial landmark extraction (68-point Dlib/MediaPipe mesh).",
        "Pose normalization and affine transformation to standard 256x256 resolution.",
        "Color channel separation into Grayscale luminance and Chrominance (YCrCb)."
      ]
    },
    {
      num: "03",
      title: "2D Fast Fourier Transform (2D-FFT)",
      icon: Radio,
      details: [
        "Conversion from spatial domain f(x,y) to frequency domain F(u,v).",
        "Logarithmic scaling of magnitude spectrum |F(u,v)| for dynamic range compression.",
        "Azimuthal 1D spectral integration across concentric radial frequencies."
      ]
    },
    {
      num: "04",
      title: "Frequency & Context Feature Extraction",
      icon: Sliders,
      details: [
        "Measurement of High-Frequency Decay slope against natural scene statistics.",
        "Detection of periodic grid artifacts caused by transposed convolution stride.",
        "Specular reflection and illumination gradient consistency scoring across facial zones."
      ]
    },
    {
      num: "05",
      title: "Classification & Reporting Guide",
      icon: Cpu,
      details: [
        "Deep ResNet/EfficientNet hybrid classifier scores spectral embeddings.",
        "Output confidence probability calibrated for REAL, FAKE, or UNCERTAIN states.",
        "Automated generation of platform-specific takedown and evidence preservation steps."
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
          <Zap className="w-3.5 h-3.5" />
          <span>Technical Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit']">
          How FreqGuard Works
        </h1>
        <p className="text-base text-slate-300">
          A deep dive into our end-to-end frequency domain pipeline from raw media upload to forensic classification.
        </p>
      </div>

      {/* Interactive Demonstration Section */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-indigo-500/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
            Live Forensic Simulation
          </span>
          <h3 className="text-2xl font-bold text-white font-['Outfit']">
            Visualizing Fourier Spectrum Anomalies
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In an authentic image, the center represents low-frequency shapes (face contours, shadows) with smooth exponential decay toward high-frequency edges (skin pores, hair).
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In a synthetic deepfake (shown on the right), periodic upsampling generates <strong>starburst spikes and concentric rings</strong> in the outer high-frequency band.
          </p>
        </div>
        <div className="lg:col-span-5 flex justify-center">
          <FrequencyVisualizer result="FAKE" interactive={true} />
        </div>
      </div>

      {/* Step by Step Breakdown */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span>Step-by-Step Processing Flow</span>
        </h2>

        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="glass-card p-6 sm:p-7 rounded-2xl border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-mono font-bold text-indigo-400 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    {step.num}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                    {step.title}
                  </h3>
                </div>
                <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
                  <step.icon className="w-5 h-5" />
                </div>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 pl-2">
                {step.details.map((detail, dIdx) => (
                  <li key={dIdx} className="flex items-start space-x-2.5">
                    <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Experience The Detection Dashboard</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Upload any image or video to test the simulated frequency domain detection workflow.
        </p>
        <Link
          to="/analyze"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition"
        >
          <span>Start Detection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
