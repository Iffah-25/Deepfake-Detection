import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Cpu, 
  Radio, 
  Sliders, 
  ArrowRight, 
  AlertCircle, 
  RefreshCw, 
  Play, 
  Settings2,
  FileCheck,
  CheckCircle2,
  ShieldAlert
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { detectMedia } from "../services/detectionService";
import { saveAnalysisRecord } from "../services/analysisService";
import { uploadMediaFile } from "../services/storageService";
import FileUploader from "../components/FileUploader";
import MediaPreview from "../components/MediaPreview";
import LoadingAnalysis from "../components/LoadingAnalysis";

export default function Analyze() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [file, setFile] = useState(location.state?.initialFile || null);
  const [analysisMode, setAnalysisMode] = useState("fft_context"); // 'fft_context' | 'dct_highpass' | 'deep_temporal'
  const [testOverride, setTestOverride] = useState("AUTO"); // 'AUTO' | 'FAKE' | 'REAL' | 'UNCERTAIN'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(6);
  const [stepLabel, setStepLabel] = useState("");
  const [error, setError] = useState("");

  const handleStartAnalysis = async () => {
    if (!file) {
      setError("Please select or drop an image or video file before starting analysis.");
      return;
    }

    setError("");
    setIsAnalyzing(true);
    setCurrentStep(1);

    try {
      // 1. Run detection service with progress callback
      const options = {
        analysisType: analysisMode,
        forcedResult: testOverride === "AUTO" ? undefined : testOverride
      };

      const resultData = await detectMedia(file, options, (step, total, label) => {
        setCurrentStep(step);
        setTotalSteps(total);
        setStepLabel(label);
      });

      // 2. Upload file preview to Storage if possible
      let mediaUrl = "";
      if (user?.uid) {
        try {
          mediaUrl = await uploadMediaFile(user.uid, file, resultData.id);
        } catch (e) {
          console.warn(e);
        }
      }

      // 3. Save record to Firestore and Local Storage
      const finalRecord = {
        ...resultData,
        fileUrl: mediaUrl || URL.createObjectURL(file)
      };

      if (user?.uid) {
        await saveAnalysisRecord(user.uid, finalRecord);
      }

      // 4. Navigate to Result Page
      navigate(`/result/${resultData.id}`, { state: { analysis: finalRecord } });

    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during analysis.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
          <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Fourier Frequency Inspection Console</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit']">
          Deepfake Media Forensics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Upload media to decompose spatial frequencies, check Azimuthal spectral energy, and detect synthetic manipulation.
        </p>
      </div>

      {/* Main Analysis Area */}
      {isAnalyzing ? (
        <LoadingAnalysis
          currentStep={currentStep}
          totalSteps={totalSteps}
          currentStepLabel={stepLabel}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Main Uploader & Preview */}
          <div className="lg:col-span-7 space-y-6">
            <FileUploader
              onFileSelected={(f) => setFile(f)}
              selectedFile={file}
              onClear={() => setFile(null)}
            />

            {file && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Input Stream Preview
                </h3>
                <MediaPreview
                  file={file}
                  fileType={file.type.startsWith("video") ? "video" : "image"}
                  enableForensicFilter={true}
                />
              </div>
            )}
          </div>

          {/* Right / Settings & Action Panel */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-sm font-bold text-white font-['Outfit'] flex items-center space-x-2">
                  <Settings2 className="w-4 h-4 text-indigo-400" />
                  <span>Forensic Configuration</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Ready
                </span>
              </div>

              {/* Mode Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Detection Pipeline Mode
                </label>
                <div className="space-y-2">
                  {[
                    {
                      id: "fft_context",
                      name: "2D-FFT + Contextual Fusion (Recommended)",
                      desc: "Full spectral decomposition with illumination and corneal reflection analysis."
                    },
                    {
                      id: "dct_highpass",
                      name: "DCT High-Frequency Artifact Scan",
                      desc: "Optimized for detecting transposed convolution checkerboard patterns."
                    },
                    {
                      id: "deep_temporal",
                      name: "Temporal Phase Coherence (Videos)",
                      desc: "Analyzes inter-frame frequency jitter across facial keypoints."
                    }
                  ].map((mode) => (
                    <label
                      key={mode.id}
                      onClick={() => setAnalysisMode(mode.id)}
                      className={`block p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        analysisMode === mode.id
                          ? "bg-indigo-600/15 border-indigo-500/50 text-white"
                          : "bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{mode.name}</span>
                        {analysisMode === mode.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{mode.desc}</p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Testing / Demo Override Dropdown */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <span>Presentation / Demo Scenario</span>
                  </label>
                  <span className="text-[10px] text-indigo-400 font-mono">Simulated Engine</span>
                </div>
                <select
                  value={testOverride}
                  onChange={(e) => setTestOverride(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="AUTO">Automatic (Based on file forensic signatures)</option>
                  <option value="FAKE">Force FAKE (Potential Deepfake Detected Demo)</option>
                  <option value="REAL">Force REAL (No Deepfake Detected Demo)</option>
                  <option value="UNCERTAIN">Force UNCERTAIN (Inconclusive Media Demo)</option>
                </select>
                <p className="text-[10px] text-slate-400">
                  Allows instant testing of all detection states for evaluation and demonstration.
                </p>
              </div>

              {/* Error Notice */}
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Launch Button */}
              <button
                type="button"
                onClick={handleStartAnalysis}
                disabled={!file}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Execute Frequency Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

            {/* Quick Helper */}
            <div className="glass-card p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-1.5">
              <p className="font-semibold text-slate-300">Colab Backend Ready:</p>
              <p>
                When your ML backend model is live, configure <code>VITE_API_BASE_URL</code> to connect the real FastAPI endpoint without changing any UI components.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
