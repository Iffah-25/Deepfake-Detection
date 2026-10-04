import React from "react";
import { Link } from "react-router-dom";
import { 
  FileVideo, 
  FileImage, 
  Calendar, 
  ArrowRight, 
  Trash2,
  Cpu,
  Activity
} from "lucide-react";
import ResultBadge from "./ResultBadge";
import { formatBytes, formatDate } from "../utils/formatters";

export default function HistoryCard({ item, onDelete }) {
  const isVideo = item.fileType === "video";

  return (
    <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800/90 hover:border-indigo-500/40 transition-all duration-200 group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* File Details */}
      <div className="flex items-start space-x-3.5 overflow-hidden">
        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 shrink-0 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-colors">
          {isVideo ? <FileVideo className="w-6 h-6" /> : <FileImage className="w-6 h-6" />}
        </div>
        
        <div className="space-y-1 truncate">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs group-hover:text-indigo-300 transition-colors">
              {item.fileName}
            </h4>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
              {isVideo ? "VIDEO" : "IMAGE"}
            </span>
          </div>
          
          <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(item.createdAt)}</span>
            </span>
            {item.fileSize && (
              <span>• {formatBytes(item.fileSize)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Result & Actions */}
      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end space-x-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
        <div className="flex items-center space-x-3">
          <ResultBadge result={item.result} size="sm" />
          <div className="text-right">
            <div className="text-xs font-bold text-white font-mono">{item.confidence}%</div>
            <div className="text-[10px] text-slate-400 font-mono">confidence</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/result/${item.id}`}
            state={{ analysis: item }}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-medium transition"
          >
            <span>Inspect</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
              title="Delete record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
