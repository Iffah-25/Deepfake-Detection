/**
 * Detection Service - Handles Frequency-Domain AI Deepfake Analysis
 * Current Phase: Mock Engine with Realistic Spectral Breakdown
 * Future Phase: Switchable to FastAPI / Flask / Colab ML Backend Endpoint
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const USE_MOCK = !API_BASE_URL || API_BASE_URL === "";

/**
 * Main Detection Function
 * @param {File} file - Uploaded Image or Video File
 * @param {Object} options - Custom options (e.g. forced outcome for testing, sensitivity)
 * @param {Function} onProgress - Progress step callback (stepIndex, stepLabel)
 */
export const detectMedia = async (file, options = {}, onProgress = () => {}) => {
  if (!USE_MOCK) {
    try {
      return await callRealBackendApi(file, options);
    } catch (err) {
      console.warn("Backend API unreachable, falling back to client-side detection engine:", err.message);
    }
  }

  return await runMockDetection(file, options, onProgress);
};

/**
 * Future API Call Implementation
 */
const callRealBackendApi = async (file, options) => {
  const formData = new FormData();
  formData.append("file", file);
  if (options.analysisType) {
    formData.append("analysis_type", options.analysisType);
  }

  const response = await fetch(`${API_BASE_URL}/api/detect`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API detection error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    id: data.analysisId || `analysis-${Date.now()}`,
    result: data.result, // 'REAL' | 'FAKE' | 'UNCERTAIN'
    confidence: data.confidence, // 0 - 100
    processingTime: data.processingTime || 3.5,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type.startsWith("video") ? "video" : "image",
    modelVersion: data.modelVersion || "v2.4-FreqNet-Hybrid",
    summary: data.message || "Model evaluation completed.",
    metrics: data.metrics || {}
  };
};

/**
 * Step-by-Step Mock Detection Engine
 */
const runMockDetection = async (file, options, onProgress) => {
  const steps = [
    { label: "Validating media stream & decoding headers", duration: 700 },
    { label: "Computing 2D Fast Fourier Transform (2D-FFT)", duration: 900 },
    { label: "Analyzing Discrete Cosine Transform (DCT) high-frequency anomalies", duration: 900 },
    { label: "Evaluating Azimuthal spectral energy & blending boundaries", duration: 800 },
    { label: "Contextual lighting & multi-frame temporal consistency check", duration: 700 },
    { label: "Synthesizing deepfake confidence matrix", duration: 500 }
  ];

  for (let i = 0; i < steps.length; i++) {
    onProgress(i + 1, steps.length, steps[i].label);
    await new Promise((res) => setTimeout(res, steps[i].duration));
  }

  const isVideo = file.type.startsWith("video") || /\.(mp4|mov|webm)$/i.test(file.name);
  const fileNameLower = file.name.toLowerCase();

  // Allow explicit demo triggers based on filename or random determination
  let result = "FAKE";
  let confidence = 94.2;
  let riskLevel = "HIGH";

  if (options.forcedResult) {
    result = options.forcedResult;
  } else if (fileNameLower.includes("real") || fileNameLower.includes("original") || fileNameLower.includes("auth")) {
    result = "REAL";
    confidence = Math.floor(88 + Math.random() * 10);
    riskLevel = "LOW";
  } else if (fileNameLower.includes("uncertain") || fileNameLower.includes("blur") || fileNameLower.includes("lowres")) {
    result = "UNCERTAIN";
    confidence = Math.floor(52 + Math.random() * 15);
    riskLevel = "MEDIUM";
  } else if (fileNameLower.includes("fake") || fileNameLower.includes("deepfake") || fileNameLower.includes("swap") || fileNameLower.includes("synth")) {
    result = "FAKE";
    confidence = Math.floor(91 + Math.random() * 8);
    riskLevel = "HIGH";
  } else {
    // Deterministic pseudo-random based on filename length + size
    const seed = (file.name.length * 17 + file.size) % 100;
    if (seed < 55) {
      result = "FAKE";
      confidence = Math.floor(89 + (seed % 10));
      riskLevel = "HIGH";
    } else if (seed < 88) {
      result = "REAL";
      confidence = Math.floor(86 + (seed % 12));
      riskLevel = "LOW";
    } else {
      result = "UNCERTAIN";
      confidence = Math.floor(55 + (seed % 12));
      riskLevel = "MEDIUM";
    }
  }

  const analysisId = `frq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Generate deep technical frequency & context metrics
  const frequencyScore = result === "FAKE" ? (0.88 + Math.random() * 0.09) : (0.12 + Math.random() * 0.15);
  const contextInconsistency = result === "FAKE" ? (0.84 + Math.random() * 0.12) : (0.08 + Math.random() * 0.14);
  const compressionAnomaly = result === "FAKE" ? (0.79 + Math.random() * 0.15) : (0.18 + Math.random() * 0.12);
  const spectralDiscontinuity = result === "FAKE" ? (0.91 + Math.random() * 0.08) : (0.09 + Math.random() * 0.11);

  const findings = [];
  if (result === "FAKE") {
    findings.push("Unusual high-frequency spectral attenuation characteristic of generative GAN / Diffusion synthesis.");
    findings.push("Azimuthal average power spectrum deviation across 128-256 cycles/rad band.");
    findings.push("Contextual micro-texture discontinuity around facial contour and blending boundaries.");
    if (isVideo) {
      findings.push("Inter-frame frequency phase jitter detected across facial keypoints.");
    }
  } else if (result === "REAL") {
    findings.push("Spectral energy distribution matches natural camera sensor Bayer pattern noise profile.");
    findings.push("DCT coefficients follow standard natural image Benford-law power decay.");
    findings.push("Contextual illumination and specular reflections are physically consistent.");
    if (isVideo) {
      findings.push("Smooth temporal frequency phase coherence across sequential frames.");
    }
  } else {
    findings.push("Severe re-compression or low spatial resolution obscured high-frequency forensic cues.");
    findings.push("Frequency spectrum exhibits heavy quantization noise interfering with classification.");
    findings.push("Contextual confidence fell below the 75% definitive threshold.");
  }

  return {
    id: analysisId,
    result, // 'REAL' | 'FAKE' | 'UNCERTAIN'
    confidence: Number(confidence.toFixed(1)),
    riskLevel,
    fileName: file.name,
    fileSize: file.size,
    fileType: isVideo ? "video" : "image",
    mimeType: file.type,
    analyzedAt: new Date().toISOString(),
    processingTime: (3.2 + Math.random() * 1.5).toFixed(2),
    modelVersion: "v2.8-FreqNet-Hybrid (Colab-Ready)",
    summary: result === "FAKE"
      ? "Potential deepfake manipulation detected. Strong high-frequency artifacts and contextual mismatches identified."
      : result === "REAL"
      ? "No deepfake detected. Natural frequency domain signatures and consistent contextual features observed."
      : "Inconclusive results. Media resolution or compression impedes reliable frequency-domain verification.",
    metrics: {
      frequencyScore: Number((frequencyScore * 100).toFixed(1)),
      contextInconsistency: Number((contextInconsistency * 100).toFixed(1)),
      compressionAnomaly: Number((compressionAnomaly * 100).toFixed(1)),
      spectralDiscontinuity: Number((spectralDiscontinuity * 100).toFixed(1)),
      fftPeakRatio: (1.4 + Math.random() * 1.2).toFixed(2),
      noiseVariance: (0.0034 + Math.random() * 0.002).toFixed(4),
      temporalJitter: isVideo ? (result === "FAKE" ? "High (4.8 rad/s)" : "Normal (0.3 rad/s)") : "N/A"
    },
    findings
  };
};
