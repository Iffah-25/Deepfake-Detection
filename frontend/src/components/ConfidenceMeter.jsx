import React from "react";
import { getConfidenceColor } from "../utils/formatters";

export default function ConfidenceMeter({ confidence = 0, resultType = "FAKE", size = "normal" }) {
  const color = getConfidenceColor(confidence, resultType);
  const strokeWidth = size === "large" ? 10 : 8;
  const radius = size === "large" ? 54 : 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  if (size === "bar") {
    return (
      <div className="w-full space-y-1.5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-400">Confidence Score</span>
          <span style={{ color }}>{confidence}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
            style={{
              width: `${Math.min(100, Math.max(0, confidence))}%`,
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}66`
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className={size === "large" ? "w-36 h-36" : "w-24 h-24"}
        viewBox="0 0 128 128"
      >
        {/* Background Track */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
        />
        {/* Animated Progress Circle */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out -rotate-90 origin-center"
          style={{
            filter: `drop-shadow(0 0 6px ${color}88)`
          }}
        />
      </svg>
      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`font-bold font-['Outfit'] tracking-tight ${size === "large" ? "text-3xl" : "text-xl"}`} style={{ color }}>
          {confidence}%
        </span>
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Confidence
        </span>
      </div>
    </div>
  );
}
