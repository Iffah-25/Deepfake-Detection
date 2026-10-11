import React from "react";
import CybercrimeAssistant from "./CybercrimeAssistant";

export default function ActionCard({ analysis, analysisId, fileName }) {
  return (
    <CybercrimeAssistant
      analysis={analysis}
      analysisId={analysisId || analysis?.id}
      fileName={fileName || analysis?.fileName}
    />
  );
}
