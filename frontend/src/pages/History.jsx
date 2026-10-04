import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Layers, 
  Sparkles, 
  ArrowRight,
  RefreshCw,
  FileVideo,
  FileImage,
  Calendar
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getUserAnalyses, deleteAnalysisRecord } from "../services/analysisService";
import HistoryCard from "../components/HistoryCard";
import ResultBadge from "../components/ResultBadge";
import { formatBytes, formatDate } from "../utils/formatters";

export default function History() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterResult, setFilterResult] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");

  const fetchRecords = async () => {
    if (user?.uid) {
      setLoading(true);
      const data = await getUserAnalyses(user.uid);
      setAnalyses(data || []);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this analysis entry?")) {
      await deleteAnalysisRecord(user.uid, id);
      setAnalyses((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleExportCSV = () => {
    if (analyses.length === 0) return;
    const headers = ["ID", "FileName", "FileType", "Result", "Confidence", "AnalyzedAt"];
    const rows = analyses.map((a) => [
      a.id,
      `"${a.fileName}"`,
      a.fileType,
      a.result,
      `${a.confidence}%`,
      a.analyzedAt || a.createdAt
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FreqGuard-History-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & search logic
  const filteredAnalyses = analyses.filter((item) => {
    const matchesSearch = 
      item.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesResult = filterResult === "ALL" || item.result === filterResult;
    const matchesType = filterType === "ALL" || item.fileType === filterType;

    return matchesSearch && matchesResult && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>Forensic Audit Trail</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit']">
            Detection History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Review, filter, and inspect previously analyzed images and videos.
          </p>
        </div>

        {analyses.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={fetchRecords}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition"
              title="Refresh history"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by file name or analysis ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Result Filter */}
          <select
            value={filterResult}
            onChange={(e) => setFilterResult(e.target.value)}
            className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Verdicts</option>
            <option value="FAKE">Only Fake</option>
            <option value="REAL">Only Real</option>
            <option value="UNCERTAIN">Only Uncertain</option>
          </select>

          {/* Media Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Media Types</option>
            <option value="image">Images Only</option>
            <option value="video">Videos Only</option>
          </select>
        </div>

      </div>

      {/* Analyses List */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400 glass-card rounded-2xl border border-slate-800">
          Loading analysis history...
        </div>
      ) : filteredAnalyses.length === 0 ? (
        <div className="p-16 text-center glass-card rounded-2xl border border-slate-800 space-y-4">
          <Layers className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Detection Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {analyses.length === 0
              ? "You haven't scanned any files yet. Upload an image or video to generate your first forensic report."
              : "No records match your active search and filter criteria."}
          </p>
          <Link
            to="/analyze"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start New Analysis</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAnalyses.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

    </div>
  );
}
