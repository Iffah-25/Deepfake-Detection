export const APP_NAME = "FreqGuard";
export const APP_TAGLINE = "Context-Aware Deepfake Detection Using Frequency Analysis";

export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
export const SUPPORTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

export const MAX_IMAGE_SIZE_MB = 15; // 15MB
export const MAX_VIDEO_SIZE_MB = 100; // 100MB

export const RESULT_TYPES = {
  REAL: {
    key: "REAL",
    label: "No Deepfake Detected",
    badge: "AUTHENTIC / REAL",
    color: "emerald",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400"
  },
  FAKE: {
    key: "FAKE",
    label: "Potential Deepfake Detected",
    badge: "MANIPULATION DETECTED",
    color: "rose",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-400"
  },
  UNCERTAIN: {
    key: "UNCERTAIN",
    label: "Unable to Determine",
    badge: "INCONCLUSIVE",
    color: "amber",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400"
  },
  ERROR: {
    key: "ERROR",
    label: "Analysis Error",
    badge: "PROCESSING FAILED",
    color: "red",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400"
  }
};

export const SOCIAL_PLATFORMS = [
  {
    name: "Instagram",
    icon: "Instagram",
    color: "from-pink-500 to-purple-600",
    reportUrl: "https://help.instagram.com/contact/383679321740945",
    guide: "Tap '...' on top right of the post > Tap 'Report' > Select 'It's spam or false information' or 'Impersonation / Scams'."
  },
  {
    name: "YouTube",
    icon: "Youtube",
    color: "from-red-600 to-rose-700",
    reportUrl: "https://www.youtube.com/reportabuse",
    guide: "Click the '...' menu below video player > Select 'Report' > Choose 'Misinformation' or 'Harassment / Impersonation'."
  },
  {
    name: "X (Twitter)",
    icon: "Twitter",
    color: "from-slate-700 to-slate-900",
    reportUrl: "https://help.twitter.com/forms/authenticity",
    guide: "Click '...' on tweet > Select 'Report Post' > Choose 'Misleading or synthetic/manipulated media'."
  },
  {
    name: "Facebook",
    icon: "Facebook",
    color: "from-blue-600 to-blue-800",
    reportUrl: "https://www.facebook.com/help/1380418588640631",
    guide: "Click '...' on the post > Choose 'Find support or report post' > Select 'False information' or 'Harassment'."
  },
  {
    name: "WhatsApp",
    icon: "MessageSquare",
    color: "from-emerald-500 to-teal-700",
    reportUrl: "https://faq.whatsapp.com/593259925979503",
    guide: "Open chat info > Scroll down and tap 'Report Contact/Group' with chat history attachment."
  },
  {
    name: "National Cyber Crime Portal",
    icon: "ShieldAlert",
    color: "from-indigo-600 to-purple-700",
    reportUrl: "https://cybercrime.gov.in",
    guide: "File a cyber complaint under 'Report Crime Related to Women/Children' or 'Report Other Cyber Crime' with original links."
  }
];
