import React from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Sparkles, 
  Activity, 
  Cpu, 
  Radio, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  FileVideo, 
  FileImage,
  Zap,
  Lock,
  Search,
  Sliders,
  ChevronRight,
  TrendingUp,
  Share2,
  Eye
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import FrequencyVisualizer from "../components/FrequencyVisualizer";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Col: Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-mono shadow-lg shadow-indigo-500/10">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>Next-Gen Frequency Domain Forensics</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-['Outfit'] leading-[1.15]">
                Detect. Verify. <br />
                <span className="gradient-text">Stay Safe Against Deepfakes.</span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                An intelligent media verification system using <strong>2D Fast Fourier Transform (FFT)</strong> frequency analysis and <strong>context-aware deep learning</strong> to uncover synthetic faces, audio-visual desync, and AI generator artifacts.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to={isAuthenticated ? "/analyze" : "/signup"}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all hover:-translate-y-0.5"
                >
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                  <span>Analyze Media Now</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-medium text-base transition-all"
                >
                  <Radio className="w-5 h-5 text-indigo-400" />
                  <span>How Frequency Analysis Works</span>
                </Link>
              </div>

              {/* Micro specs */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white font-mono">2D-FFT</div>
                  <div className="text-xs text-slate-400">Spectral Analysis</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-indigo-400 font-mono">Real-time</div>
                  <div className="text-xs text-slate-400">Mock & Colab API</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono">Actionable</div>
                  <div className="text-xs text-slate-400">Reporting Guide</div>
                </div>
              </div>

            </div>

            {/* Right Col: Interactive Visual Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md space-y-4">
                <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 shadow-2xl relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-xs font-mono font-bold text-slate-200">LIVE SPECTRAL FORENSICS</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                      GAN ARTIFACT DETECTED
                    </span>
                  </div>

                  {/* Frequency Visualizer Canvas */}
                  <FrequencyVisualizer result="FAKE" interactive={true} />

                  <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">Azimuthal High-Freq Anomaly:</span>
                      <span className="text-rose-400 font-bold">94.2%</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">Contextual Boundary Inconsistency:</span>
                      <span className="text-rose-400 font-bold">88.7%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM & SOLUTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">
            The Deepfake Epidemic
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
            Why Traditional Visual Inspection Fails
          </h3>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Modern generative models (StyleGAN, Stable Diffusion, FaceSwap) produce visually convincing pixel textures that deceive human eyes. However, their upsampling convolution layers leave distinct mathematical signatures in the <strong>frequency domain</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Spatial Domain Box */}
          <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white font-['Outfit']">1. Spatial Domain (Human Eye)</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Standard image inspection only looks at RGB pixel color matrices. High-resolution deepfakes easily fool spatial CNNs because subtle pixel blending hides seam lines.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 pt-2">
              <li className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Susceptible to lighting blending tricks</span>
              </li>
              <li className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Fails on hyper-realistic diffusion portraits</span>
              </li>
            </ul>
          </div>

          {/* Frequency Domain Box */}
          <div className="glass-card p-8 rounded-3xl border border-indigo-500/30 bg-indigo-950/20 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center">
              <Radio className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white font-['Outfit']">2. Frequency Domain (FreqGuard Forensics)</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              By transforming images into Fourier (FFT) and Discrete Cosine (DCT) spectra, our system exposes unnatural high-frequency energy spikes created during neural transposed convolution.
            </p>
            <ul className="space-y-2 text-xs text-slate-300 pt-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Reveals synthetic upsampling periodic grid patterns</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Analyzes Azimuthal spectral decay against real sensor profiles</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. 5-STEP WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">
            Detection Pipeline
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
            How The Analysis Operates
          </h3>
          <p className="text-sm sm:text-base text-slate-300">
            A 5-stage verification sequence engineered to detect both image deepfakes and multi-frame video manipulations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              step: "01",
              title: "Media Upload",
              desc: "Upload target image (JPG, PNG) or video (MP4, MOV). Client-side validation checks integrity.",
              icon: FileImage
            },
            {
              step: "02",
              title: "Pre-processing",
              desc: "Face landmark alignment, frame slicing, and spatial normalization for neural input.",
              icon: Sliders
            },
            {
              step: "03",
              title: "2D-FFT Transform",
              desc: "Decomposition into frequency domain to inspect Azimuthal spectral distribution and phase angles.",
              icon: Radio
            },
            {
              step: "04",
              title: "Hybrid Model",
              desc: "Context-aware neural network compares frequency signatures and spatial consistency.",
              icon: Cpu
            },
            {
              step: "05",
              title: "Action & Result",
              desc: "Clear Real / Fake verdict with confidence breakdown and direct platform takedown guide.",
              icon: Shield
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold font-mono text-indigo-400/60 group-hover:text-indigo-400 transition-colors">
                    {item.step}
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <item.icon className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-base font-bold text-white font-['Outfit']">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. KEY FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Engineered For Reliability & Academic Rigor
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Built with standard forensic methodologies, scalable API boundaries, and user empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Frequency-Based Forensics</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluates high-frequency spectral attenuation and periodic checkerboard anomalies left by transposed convolutions in GANs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Context-Aware Analysis</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cross-examines facial skin texture against background environmental lighting, specular highlights, and eye reflections.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Action & Reporting Center</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct step-by-step guidance for reporting synthetic defamatory content on Instagram, YouTube, X, Facebook, and Cyber Crime cells.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-panel p-10 sm:p-16 rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950 relative overflow-hidden space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for Testing</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit']">
            Ready to Verify Your Media?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Test uploaded images and videos with simulated frequency-domain forensic scanning right in your browser.
          </p>

          <div className="pt-2">
            <Link
              to={isAuthenticated ? "/analyze" : "/signup"}
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base shadow-xl shadow-indigo-600/40 hover:shadow-indigo-600/60 transition-all hover:scale-105"
            >
              <span>Launch Detection Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
