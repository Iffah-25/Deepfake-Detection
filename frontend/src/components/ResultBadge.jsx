import React from "react";
import { CheckCircle2, AlertTriangle, HelpCircle, XCircle } from "lucide-react";
import { RESULT_TYPES } from "../config/constants";

export default function ResultBadge({ result, size = "md", showIcon = true }) {
  const config = RESULT_TYPES[result] || RESULT_TYPES.UNCERTAIN;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-semibold",
    md: "px-3 py-1.5 text-sm font-bold",
    lg: "px-5 py-2.5 text-base font-extrabold tracking-wide"
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const getIcon = () => {
    switch (result) {
      case "REAL":
        return <CheckCircle2 className={`${iconSizes[size]} text-emerald-400`} />;
      case "FAKE":
        return <AlertTriangle className={`${iconSizes[size]} text-rose-400`} />;
      case "UNCERTAIN":
        return <HelpCircle className={`${iconSizes[size]} text-amber-400`} />;
      default:
        return <XCircle className={`${iconSizes[size]} text-red-400`} />;
    }
  };

  return (
    <div
      className={`inline-flex items-center space-x-2 rounded-xl border backdrop-blur-md ${config.bg} ${config.border} ${config.text} ${sizeClasses[size]}`}
    >
      {showIcon && getIcon()}
      <span>{config.badge}</span>
    </div>
  );
}
