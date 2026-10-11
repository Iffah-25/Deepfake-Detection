import React from "react";
import { Shield, Radio, Layers, Cpu, BookOpen, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Project Documentation & Research Focus</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit']">
          About FreqGuard Forensics
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Understanding the mathematical principles and neural foundations behind context-aware frequency analysis for synthetic media detection.
        </p>
      </div>

      {/* Overview Card */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-2xl font-bold text-white font-['Outfit']">The Problem Statement</h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Deepfake generation methods have advanced from primitive face swaps to ultra-realistic diffusion models and neural radiance fields (NeRFs). In the spatial RGB pixel domain, generated images look pristine to human eyes and standard classifiers.
        </p>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          However, because modern generative neural networks rely heavily on upsampling operations (such as transposed convolution, bilinear upsampling, and sub-pixel convolution), they produce distinct, unnatural periodic artifacts that are clearly visible when transformed into the <strong>frequency domain</strong> via 2D Fast Fourier Transform (2D-FFT) or Discrete Cosine Transform (DCT).
        </p>
      </div>

      {/* Methodology Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Frequency Analysis */}
        <div className="glass-card p-8 rounded-3xl border border-indigo-500/30 space-y-4">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 w-fit">
            <Radio className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-['Outfit']">1. Frequency Domain Analysis</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every natural photograph captured by an optical camera sensor follows a predictable power spectrum decay (approximately proportional to <code>1/f^α</code>) according to natural scene statistics.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            AI-generated faces violate this decay profile, exhibiting anomalous high-frequency energy concentrations and angular symmetry variations known as <strong>Azimuthal Average Spectrum anomalies</strong>.
          </p>
        </div>

        {/* Context Awareness */}
        <div className="glass-card p-8 rounded-3xl border border-cyan-500/30 space-y-4">
          <div className="p-3 rounded-2xl bg-cyan-600/20 text-cyan-400 w-fit">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-['Outfit']">2. Context-Aware Verification</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Frequency analysis alone can sometimes be affected by lossy compression (such as heavy JPEG or H.264 compression). To ensure high precision, our pipeline pairs spectral forensics with <strong>contextual consistency checks</strong>:
          </p>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Facial illumination versus background light sources</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Corneal reflection consistency across both eyes</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Inter-frame temporal phase continuity in videos</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Disclaimers & Limitations */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-amber-500/30 bg-amber-950/15 space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>Responsible Disclosure & Limitations</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          No automated detection system provides 100% infallible certainty. Advanced compression, intentional noise filtering, or low-resolution resizing can degrade high-frequency signals. When FreqGuard flags media as suspicious or inconclusive, users are encouraged to corroborate findings using our integrated <strong>Action Guidelines</strong>.
        </p>
      </div>

      {/* Next CTA */}
      <div className="text-center pt-4">
        <Link
          to="/how-it-works"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition"
        >
          <span>Explore Pipeline Architecture</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
