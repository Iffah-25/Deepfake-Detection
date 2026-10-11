
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Radio,
  ArrowRight,
  AlertCircle,
  Settings2,
  CheckCircle2,
  ShieldAlert,
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(3);
  const [stepLabel, setStepLabel] = useState("");
  const [error, setError] = useState("");

  const handleStartAnalysis = async () => {
    if (isAnalyzing) return;

    if (!file) {
      setError("Please select an image before starting analysis.");
      return;
    }

    if (file.type.startsWith("video/")) {
      setError(
        "Video detection is not supported yet. Please upload an image."
      );
      return;
    }

    setError("");
    setIsAnalyzing(true);
    setCurrentStep(1);
    setTotalSteps(3);
    setStepLabel("Preparing image...");

    try {
      const resultData = await detectMedia(file, {}, (step, total, label) => {
        setCurrentStep(step);
        setTotalSteps(total);
        setStepLabel(label);
      });

      
let mediaUrl = "";
console.log("Detection completed:", resultData);
console.log("Skipping Firebase Storage upload during debugging.");


      const finalRecord = {
        ...resultData,
        fileUrl: mediaUrl || URL.createObjectURL(file),
      };

      if (user?.uid) {
        try {
          await saveAnalysisRecord(user.uid, finalRecord);
        } catch (saveError) {
          console.error("Saving analysis record failed:", saveError);
          // Detection succeeded; allow the user to view the result.
        }
      }

      navigate(`/result/${resultData.id}`, {
        state: { analysis: finalRecord },
      });
    } catch (err) {
      console.error("Detection failed:", err);
      setError(
        err.message ||
          "Analysis failed. Check that the detection backend is running."
      );
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
          <Radio className="w-3.5 h-3.5 text-indigo-400" />
          <span>AFEM-Xception Detection Console</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit']">
          Deepfake Media Analysis
        </h1>

        <p className="text-xs sm:text-sm text-slate-400">
          Upload an image for prediction using the trained AFEM-Xception
          model and frequency-domain preprocessing.
        </p>
      </div>

      {isAnalyzing ? (
        <LoadingAnalysis
          currentStep={currentStep}
          totalSteps={totalSteps}
          currentStepLabel={stepLabel}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <FileUploader
              onFileSelected={(selectedFile) => {
                setFile(selectedFile);
                setError("");
              }}
              selectedFile={file}
              onClear={() => {
                setFile(null);
                setError("");
              }}
            />

            {file && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Input Image Preview
                </h3>

                <MediaPreview
                  file={file}
                  fileType="image"
                  enableForensicFilter={false}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-sm font-bold text-white font-['Outfit'] flex items-center space-x-2">
                  <Settings2 className="w-4 h-4 text-indigo-400" />
                  <span>Detection Configuration</span>
                </h3>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {isAnalyzing ? "Processing" : "Ready"}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-sm text-white font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  AFEM-Xception-v2
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  The image is resized and normalized before AFEM frequency
                  enhancement and Xception classification.
                </p>

                <div className="flex items-start gap-2 text-xs text-amber-300">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Predictions are model estimates, not definitive proof
                    that an image is real or manipulated.
                  </span>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleStartAnalysis}
                disabled={!file || isAnalyzing}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Analyze Image</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-1.5">
              <p className="font-semibold text-slate-300">
                Live Model Backend
              </p>
              <p>
                Predictions are generated by the configured FastAPI model
                endpoint. Only image inference is currently supported.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
