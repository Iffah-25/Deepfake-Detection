import React from "react";
import { 
  Radio, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  Sparkles,
  ShieldAlert,
  Loader2
} from "lucide-react";

export default function LoadingAnalysis({ currentStep = 1, totalSteps = 6, currentStepLabel = "" }) {
  const stepsList = [
    "Validating media stream & decoding headers",
    "Computing 2D Fast Fourier Transform (2D-FFT)",
    "Analyzing Discrete Cosine Transform (DCT) high-frequency anomalies",
    "Evaluating Azimuthal spectral energy & blending boundaries",
    "Contextual lighting & multi-frame temporal consistency check",
    "Synthesizing deepfake confidence matrix"
  ];

  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-indigo-500/30 shadow-2xl relative overflow-hidden text-center max-w-2xl mx-auto space-y-8">
      
      {/* Background Radar Glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Radar Animation Orb */}
      <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-ping" style={{ animationDuration: "3s" }} />
        <div className="absolute inset-2 rounded-full border border-indigo-500/30" />
        <div className="absolute inset-6 rounded-full border border-indigo-500/50" />
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-900 via-indigo-600 to-cyan-500 p-0.5 shadow-xl shadow-indigo-500/30 flex items-center justify-center relative overflow-hidden">
          <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center relative">
            <Radio className="w-8 h-8 text-indigo-400 animate-pulse" />
            {/* Sweep hand */}
            <div className="absolute top-1/2 left-1/2 w-10 h-0.5 bg-gradient-to-r from-transparent to-cyan-400 origin-left animate-spin" style={{ animationDuration: "2s" }} />
          </div>
        </div>
      </div>

      {/* Headline & Progress percentage */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
          <Activity className="w-3.5 h-3.5 animate-spin" />
          <span>Frequency Spectrum Pipeline Active</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
          Analyzing Media Forensics
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Decomposing spatial frequencies into Fourier spectral domains to uncover GAN and Diffusion artifacts.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-slate-400">
          <span className="text-indigo-400 font-semibold truncate max-w-xs">{currentStepLabel || "Processing..."}</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-500 ease-out shadow-sm shadow-indigo-500/50"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step Tracker List */}
      <div className="grid grid-cols-1 gap-2.5 text-left pt-2 border-t border-slate-800/80">
        {stepsList.map((stepText, idx) => {
          const stepNum = idx + 1;
          const isDone = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <div
              key={idx}
              className={`flex items-center space-x-3 p-2 rounded-xl text-xs transition-all ${
                isCurrent
                  ? "bg-indigo-500/15 border border-indigo-500/40 text-white font-medium"
                  : isDone
                  ? "text-slate-400 bg-slate-900/30"
                  : "text-slate-400 opacity-60"
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-mono">
                    {stepNum}
                  </div>
                )}
              </div>
              <span className="truncate">{stepText}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
