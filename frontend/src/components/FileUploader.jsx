import React, { useRef, useState } from "react";
import { 
  UploadCloud, 
  FileVideo, 
  FileImage, 
  AlertCircle, 
  CheckCircle2, 
  X,
  FileCheck
} from "lucide-react";
import { validateMediaFile } from "../utils/fileValidation";
import { formatBytes } from "../utils/formatters";

export default function FileUploader({ onFileSelected, selectedFile, onClear }) {
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    setErrorMsg("");
    if (!file) return;

    const validation = validateMediaFile(file);
    if (!validation.isValid) {
      setErrorMsg(validation.error);
      return;
    }

    onFileSelected(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Upload Box */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
            dragOver
              ? "border-indigo-500 bg-indigo-500/10 scale-[1.01] shadow-xl shadow-indigo-500/10"
              : "border-slate-800 hover:border-indigo-500/60 bg-slate-900/40 hover:bg-slate-900/70"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
            onChange={handleChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8 stroke-[2]" />
            </div>

            <div className="space-y-1">
              <p className="text-base sm:text-lg font-semibold text-white">
                Drag and drop your media here, or{" "}
                <span className="text-indigo-400 hover:underline">browse</span>
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                Supports Images (JPG, PNG, WEBP) & Videos (MP4, MOV, WEBM)
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-mono text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">
                Max Image: 15MB
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">
                Max Video: 100MB
              </span>
              <span className="px-2.5 py-1 rounded-md bg-indigo-950/60 border border-indigo-800/50 text-indigo-300">
                2D-FFT Ready
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Selected File Card */
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              {selectedFile.type.startsWith("video") ? (
                <FileVideo className="w-6 h-6" />
              ) : (
                <FileImage className="w-6 h-6" />
              )}
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-white truncate max-w-xs sm:max-w-md">
                  {selectedFile.name}
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {formatBytes(selectedFile.size)} • {selectedFile.type || "Media file"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onClear}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
              title="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
