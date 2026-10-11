import React, { useState } from "react";
import { 
  FileVideo, 
  FileImage, 
  Maximize2, 
  Eye, 
  Sliders, 
  Sparkles, 
  Volume2, 
  VolumeX,
  Play,
  Pause
} from "lucide-react";
import { formatBytes } from "../utils/formatters";

export default function MediaPreview({ 
  file, 
  fileUrl, 
  fileType = "image", 
  showControls = true,
  enableForensicFilter = true
}) {
  const [filterMode, setFilterMode] = useState("normal"); // 'normal' | 'highpass' | 'contrast' | 'invert'
  const [isPlaying, setIsPlaying] = useState(false);

  const previewUrl = fileUrl || (file ? URL.createObjectURL(file) : "");
  const isVideo = fileType === "video" || (file && file.type?.startsWith("video"));

  const getFilterStyle = () => {
    switch (filterMode) {
      case "highpass":
        return { filter: "contrast(200%) brightness(150%) grayscale(100%)", imageRendering: "pixelated" };
      case "contrast":
        return { filter: "contrast(250%) saturate(180%)" };
      case "invert":
        return { filter: "invert(100%) hue-rotate(180deg)" };
      default:
        return {};
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 truncate">
          {isVideo ? (
            <FileVideo className="w-4 h-4 text-cyan-400 shrink-0" />
          ) : (
            <FileImage className="w-4 h-4 text-indigo-400 shrink-0" />
          )}
          <span className="font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-xs">
            {file?.name || "Uploaded Media Preview"}
          </span>
          {file?.size && (
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              ({formatBytes(file.size)})
            </span>
          )}
        </div>

        {enableForensicFilter && (
          <div className="flex items-center space-x-1">
            <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Forensic Filter:</span>
            <button
              onClick={() => setFilterMode("normal")}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                filterMode === "normal" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Raw
            </button>
            <button
              onClick={() => setFilterMode("highpass")}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                filterMode === "highpass" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Edge/Freq
            </button>
            <button
              onClick={() => setFilterMode("contrast")}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                filterMode === "contrast" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Artifact
            </button>
          </div>
        )}
      </div>

      {/* Main Preview Frame */}
      <div className="relative bg-slate-950/80 min-h-[260px] sm:min-h-[340px] max-h-[480px] flex items-center justify-center p-2 overflow-hidden group">
        {previewUrl ? (
          isVideo ? (
            <video
              src={previewUrl}
              controls={showControls}
              className="max-h-[440px] w-auto max-w-full rounded-lg object-contain transition-all duration-300"
              style={getFilterStyle()}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <img
              src={previewUrl}
              alt="Media upload preview"
              className="max-h-[440px] w-auto max-w-full rounded-lg object-contain transition-all duration-300 shadow-lg"
              style={getFilterStyle()}
            />
          )
        ) : (
          <div className="text-center p-8 text-slate-400">
            <FileImage className="w-12 h-12 mx-auto mb-2 text-slate-400" />
            <p className="text-sm">No media preview available</p>
          </div>
        )}

        {/* Filter Indicator Badge */}
        {filterMode !== "normal" && (
          <div className="absolute top-4 left-4 z-10 bg-indigo-950/80 border border-indigo-500/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-mono text-indigo-300 flex items-center space-x-1.5 shadow-lg">
            <Sparkles className="w-3 h-3 text-indigo-400 animate-spin" />
            <span>Active Filter: {filterMode.toUpperCase()} Forensics</span>
          </div>
        )}
      </div>
    </div>
  );
}
