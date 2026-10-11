import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  History, 
  ArrowRight, 
  UploadCloud, 
  FileVideo, 
  FileImage,
  Layers,
  BookOpen,
  Info,
  Clock,
  ExternalLink
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getUserAnalyses, deleteAnalysisRecord } from "../services/analysisService";
import FileUploader from "../components/FileUploader";
import HistoryCard from "../components/HistoryCard";

export default function Dashboard() {
  const { user, userProfile } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      if (user?.uid) {
        setLoadingHistory(true);
        const data = await getUserAnalyses(user.uid);
        setAnalyses(data || []);
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    // Navigate straight to analyze page with file in state
    navigate("/analyze", { state: { initialFile: file } });
  };

  const handleDelete = async (analysisId) => {
    if (confirm("Are you sure you want to remove this record from your history?")) {
      await deleteAnalysisRecord(user.uid, analysisId);
      setAnalyses((prev) => prev.filter((item) => item.id !== analysisId));
    }
  };

  // Stats calculation
  const totalAnalyzed = analyses.length;
  const fakeCount = analyses.filter((a) => a.result === "FAKE").length;
  const realCount = analyses.filter((a) => a.result === "REAL").length;
  const uncertainCount = analyses.filter((a) => a.result === "UNCERTAIN").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
            <Activity className="w-3.5 h-3.5" />
            <span>Detection Suite v2.8</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit']">
            Welcome back, {userProfile?.name || user?.displayName || "Investigator"}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Upload images or videos below to perform frequency-domain Fourier spectral decomposition and identify potential AI manipulations.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-mono">TOTAL ANALYZED</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{totalAnalyzed}</div>
          <div className="text-[11px] text-slate-400">Images & Videos</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-rose-500/30 bg-rose-950/10 space-y-1">
          <div className="text-xs text-rose-400 font-mono flex items-center justify-between">
            <span>FAKES FLAGGED</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">{fakeCount}</div>
          <div className="text-[11px] text-rose-300/80">Action required</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-1">
          <div className="text-xs text-emerald-400 font-mono flex items-center justify-between">
            <span>REAL / AUTHENTIC</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">{realCount}</div>
          <div className="text-[11px] text-emerald-300/80">Natural sensor decay</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-amber-500/30 bg-amber-950/10 space-y-1">
          <div className="text-xs text-amber-400 font-mono flex items-center justify-between">
            <span>INCONCLUSIVE</span>
            <Info className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">{uncertainCount}</div>
          <div className="text-[11px] text-amber-300/80">Low confidence score</div>
        </div>

      </div>

      {/* Main Upload Trigger Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/40 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-['Outfit'] flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Analyze New Media</span>
            </h2>
            <p className="text-xs text-slate-400">
              Drag and drop an image (JPG, PNG) or video (MP4, MOV) to start frequency decomposition.
            </p>
          </div>

          <Link
            to="/analyze"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition shrink-0"
          >
            <span>Open Advanced Scanner</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <FileUploader
          onFileSelected={handleFileSelected}
          selectedFile={selectedFile}
          onClear={() => setSelectedFile(null)}
        />
      </div>

      {/* Recent Analyses & Guidelines Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Analyses Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Recent Analyses</span>
            </h3>

            {analyses.length > 0 && (
              <Link to="/history" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1">
                <span>View Full History ({analyses.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {loadingHistory ? (
            <div className="p-8 text-center text-xs text-slate-400 glass-card rounded-2xl border border-slate-800">
              Loading recent analyses...
            </div>
          ) : analyses.length === 0 ? (
            <div className="p-8 text-center glass-card rounded-2xl border border-slate-800 space-y-3">
              <Layers className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No analyses performed yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Upload your first image or video above to inspect 2D-FFT frequency spectra and detect deepfakes.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {analyses.slice(0, 4).map((item) => (
                <HistoryCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Guidelines Card */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Forensic Safety Tips</span>
          </h3>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <div className="space-y-2">
              <p className="font-semibold text-slate-200">1. Inspect High-Frequency Bands</p>
              <p className="text-slate-400 leading-relaxed">
                Look for checkerboard spikes in the Fourier magnitude canvas. Real camera sensors never produce starburst spikes.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <p className="font-semibold text-slate-200">2. Verify Eye Specularity</p>
              <p className="text-slate-400 leading-relaxed">
                AI face swaps often fail to harmonize cornea light reflections between left and right eyes.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <p className="font-semibold text-slate-200">3. When Manipulation is Flagged</p>
              <p className="text-slate-400 leading-relaxed">
                Use our built-in Action Center to file direct takedown notices on Instagram, YouTube, and X.
              </p>
            </div>

            <Link
              to="/guidelines"
              className="inline-flex items-center justify-center space-x-1.5 w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              <span>Explore Action Center</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
