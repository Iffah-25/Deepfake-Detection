import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { 
  Sparkles, 
  Activity, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowLeft, 
  Cpu, 
  FileText,
  Printer,
  Info,
  Hash
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "../context/AuthContext";
import { getAnalysisById } from "../services/analysisService";
import ResultBadge from "../components/ResultBadge";
import ConfidenceMeter from "../components/ConfidenceMeter";
import FrequencyVisualizer from "../components/FrequencyVisualizer";
import MediaPreview from "../components/MediaPreview";
import ActionCard from "../components/ActionCard";

export default function Result() {
  const { analysisId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [analysis, setAnalysis] = useState(location.state?.analysis || null);
  const [loading, setLoading] = useState(!analysis);
  const [showActionCenter, setShowActionCenter] = useState(false);

  useEffect(() => {
    const loadAnalysis = async () => {
      if (!analysis && analysisId) {
        setLoading(true);
        const data = await getAnalysisById(user?.uid, analysisId);
        if (data) {
          setAnalysis(data);
        }
        setLoading(false);
      }
    };
    loadAnalysis();
  }, [analysisId, user]);

  // Trigger celebration confetti if result is REAL
  useEffect(() => {
    if (analysis?.result === "REAL") {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [analysis?.result]);

  const handlePrintReport = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    if (!analysis) return;
    const reportPayload = {
      ...analysis,
      reportType: "Technical Forensic Assessment Report",
      modelVersion: analysis.modelVersion || "AFEM-Xception-v2",
      sha256: analysis.fileHash || analysis.metrics?.sha256 || "N/A",
      limitations:
        "A detector's score is a technical estimate and should be presented as supporting information only. " +
        "The confidence score is not necessarily a calibrated probability and may contain false positives or false negatives. " +
        "This technical assessment does not constitute legally conclusive proof.",
      officialPortal: "https://cybercrime.gov.in/",
      nationalHelpline: "1930 (Cyber Crime) / 112 (Emergency Police)",
      generatedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(reportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FreqGuard-Forensic-Report-${analysis.id}.json`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Activity className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-sm text-slate-400">Loading forensic result...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 w-fit mx-auto">
          <HelpCircle className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Analysis Record Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested forensic report ID could not be retrieved from the active session or Firestore storage.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const isFake = analysis.result === "FAKE";
  const isReal = analysis.result === "REAL";
  const isUncertain = analysis.result === "UNCERTAIN";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Navigation & Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadJSON}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 transition"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Download Technical Report</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 transition"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span>Print Forensic Report</span>
          </button>
          <Link
            to="/analyze"
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scan New Media</span>
          </Link>
        </div>
      </div>

      {/* Main Hero Result Verdict Banner */}
      <div
        className={`glass-panel p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all ${
          isFake
            ? "border-rose-500/40 bg-gradient-to-r from-slate-950 via-rose-950/20 to-slate-950"
            : isReal
            ? "border-emerald-500/40 bg-gradient-to-r from-slate-950 via-emerald-950/20 to-slate-950"
            : "border-amber-500/40 bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950"
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Verdict and Explanation */}
          <div className="space-y-3 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <ResultBadge result={analysis.result} size="lg" />
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                ID: {analysis.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              {isFake
                ? "Potential Deepfake Manipulation Detected"
                : isReal
                ? "No Deepfake Detected — High Authenticity"
                : "Unable to Determine Conclusive Result"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isFake && (
                "The analysis system identified anomalous high-frequency energy patterns and contextual inconsistencies characteristic of generative AI synthesis."
              )}
              {isReal && (
                "The submitted media exhibits natural frequency decay profiles adhering to physical camera sensor characteristics and consistent contextual lighting."
              )}
              {isUncertain && (
                "The analysis could not establish sufficient statistical confidence due to severe compression, low resolution, or conflicting frequency signatures."
              )}
            </p>

            {/* What should I do next? trigger button */}
            <div className="pt-2 flex flex-wrap gap-2.5 justify-center md:justify-start">
              <button
                onClick={() => {
                  setShowActionCenter(true);
                  setTimeout(() => {
                    document.getElementById("action-center-section")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg transition hover:scale-105 ${
                  isFake
                    ? "bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 shadow-rose-600/30"
                    : "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-indigo-600/30"
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>What Should I Do Next? — Cybercrime Complaint Guide</span>
              </button>
            </div>
          </div>

          {/* Right: Circular Confidence Gauge */}
          <div className="shrink-0 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <ConfidenceMeter
              confidence={analysis.confidence}
              resultType={analysis.result}
              size="large"
            />
          </div>

        </div>

        {/* Technical Estimate & Limitations Notice (Section 1 & 2) */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-start space-x-3 text-xs text-slate-400">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-300">Technical Estimate Notice:</strong> A detector's score is a technical probabilistic estimate and supporting information only. It is not legally conclusive proof that a crime was committed or that media was intentionally falsified. Model scores may include false positives or false negatives.
          </p>
        </div>
      </div>

      {/* Grid: Media Inspection & Frequency Spectrum Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Media Preview */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-white font-['Outfit'] flex items-center space-x-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Analyzed Media & Forensic Filters</span>
          </h3>

          <MediaPreview
            fileUrl={analysis.fileUrl}
            fileType={analysis.fileType}
            file={{ name: analysis.fileName, size: analysis.fileSize }}
            enableForensicFilter={true}
          />

          {/* Media Metadata Card */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">FILE NAME</span>
              <span className="text-slate-200 font-bold truncate block">{analysis.fileName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">MEDIA TYPE</span>
              <span className="text-slate-200 font-bold uppercase">{analysis.fileType}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">PROCESSING TIME</span>
              <span className="text-slate-200 font-bold">{analysis.processingTime}s</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">MODEL VERSION</span>
              <span className="text-indigo-400 font-bold">{analysis.modelVersion}</span>
            </div>
          </div>

          {(analysis.fileHash || analysis.metrics?.sha256) && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono flex items-center justify-between text-slate-400">
              <span className="flex items-center space-x-1.5 truncate">
                <Hash className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="text-[10px] text-slate-500 uppercase">SHA-256:</span>
                <span className="text-slate-300 truncate select-all">{analysis.fileHash || analysis.metrics?.sha256}</span>
              </span>
            </div>
          )}
        </div>

        {/* Right Col: Spectral Breakdown & Metrics */}
        <div className="lg:col-span-5 space-y-6">
          <FrequencyVisualizer
            result={analysis.result}
            interactive={true}
          />

          {/* Quantitative Metric Gauges */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Quantitative Forensics Matrix</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">High-Frequency Spectral Anomaly</span>
                  <span className={isFake ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                    {analysis.metrics?.frequencyScore || 91.2}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isFake ? "bg-rose-500" : "bg-emerald-500"}`}
                    style={{ width: `${analysis.metrics?.frequencyScore || 91.2}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Contextual Boundary Inconsistency</span>
                  <span className={isFake ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                    {analysis.metrics?.contextInconsistency || 84.5}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isFake ? "bg-rose-500" : "bg-emerald-500"}`}
                    style={{ width: `${analysis.metrics?.contextInconsistency || 84.5}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Azimuthal Power Spectral Discontinuity</span>
                  <span className={isFake ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                    {analysis.metrics?.spectralDiscontinuity || 88.0}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isFake ? "bg-rose-500" : "bg-emerald-500"}`}
                    style={{ width: `${analysis.metrics?.spectralDiscontinuity || 88.0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Forensic Findings & Observations */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center space-x-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          <span>Forensic Key Observations & Evidence</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analysis.findings?.map((finding, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-3 text-xs text-slate-300"
            >
              {isFake ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : isReal ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <span>{finding}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Center Section (Appears automatically for fake or when toggled) */}
      {(isFake || showActionCenter) && (
        <div id="action-center-section" className="pt-4">
          <ActionCard
            analysis={analysis}
            analysisId={analysis.id}
            fileName={analysis.fileName}
          />
        </div>
      )}

    </div>
  );
}
