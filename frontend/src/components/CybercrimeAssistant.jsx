import React, { useState, useMemo } from "react";
import {
  ShieldAlert,
  FileText,
  Copy,
  Check,
  Download,
  ExternalLink,
  FileCheck2,
  Phone,
  Bookmark,
  Trash2,
  Info,
  Share2,
  Hash,
  Globe,
  Lock,
  RefreshCw,
  FolderLock
} from "lucide-react";
import { SOCIAL_PLATFORMS } from "../config/constants";
import {
  InstagramIcon,
  YoutubeIcon,
  TwitterIcon,
  FacebookIcon,
  WhatsAppIcon
} from "./SocialIcons";

const STORAGE_KEY_TRACKER = "freqguard_complaint_tracker_records";
const STORAGE_KEY_CHECKLIST = "freqguard_evidence_checklist_";

export default function CybercrimeAssistant({
  analysis = null,
  analysisId = "",
  fileName = ""
}) {
  // Derive details from analysis if available
  const activeAnalysisId = analysis?.id || analysisId || "N/A";
  const activeFileName = analysis?.fileName || fileName || "analyzed_media";
  const activeModelVersion = analysis?.modelVersion || "AFEM-Xception-v2";
  const activeConfidence = analysis?.confidence ? `${analysis.confidence}%` : "Not calibrated";
  const activeFileHash = analysis?.fileHash || analysis?.metrics?.sha256 || "";

  // Tab State: 'overview' | 'checklist' | 'draft' | 'portal_guide' | 'tracker' | 'platforms'
  const [activeTab, setActiveTab] = useState("checklist");

  // Evidence Checklist State (Section 4)
  const defaultChecklist = {
    originalFile: false,
    postUrl: false,
    profileUrl: false,
    screenshots: false,
    messages: false,
    dateTime: true,
    detectorReport: Boolean(analysis),
    fileHash: Boolean(activeFileHash)
  };

  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_CHECKLIST}${activeAnalysisId}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultChecklist;
  });

  const toggleChecklistItem = (key) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    try {
      localStorage.setItem(`${STORAGE_KEY_CHECKLIST}${activeAnalysisId}`, JSON.stringify(updated));
    } catch {
      // fallback
    }
  };

  const checklistCompletedCount = useMemo(() => {
    return Object.values(checklist).filter(Boolean).length;
  }, [checklist]);

  // Complaint Form State (Section 5 & 6)
  const [incidentDate, setIncidentDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  });
  const [platform, setPlatform] = useState("Instagram");
  const [customPlatform, setCustomPlatform] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [incidentType, setIncidentType] = useState("Impersonation / Non-Consensual Synthetic Media");
  const [concernDescription, setConcernDescription] = useState(
    "The content depicts an artificially manipulated likeness/identity in a misleading or defamatory manner without consent, creating serious personal and reputational harm."
  );
  const [additionalDetails, setAdditionalDetails] = useState("");

  // Editable Draft text
  const [userEditedDraft, setUserEditedDraft] = useState("");
  const [isDraftManuallyEdited, setIsDraftManuallyEdited] = useState(false);

  // Copy & Download states
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [downloadedDraft, setDownloadedDraft] = useState(false);

  // Generate evidence summary string based on checklist
  const generatedEvidenceList = useMemo(() => {
    const items = [];
    if (checklist.originalFile) items.push("original untouched digital file");
    if (checklist.postUrl) items.push(`post URL (${postUrl || "recorded link"})`);
    if (checklist.profileUrl) items.push(`profile link (${profileUrl || "recorded account"})`);
    if (checklist.screenshots) items.push("high-resolution context screenshots with timestamps");
    if (checklist.messages) items.push("relevant communication/threat logs");
    if (checklist.detectorReport) {
      items.push(`FreqGuard forensic analysis report (Model: ${activeModelVersion}, Confidence Score: ${activeConfidence})`);
    }
    if (checklist.fileHash && activeFileHash) {
      items.push(`SHA-256 digital fingerprint: ${activeFileHash}`);
    }
    return items.length > 0 ? items.join(", ") : "original file, screenshots, URLs, and forensic report";
  }, [checklist, postUrl, profileUrl, activeModelVersion, activeConfidence, activeFileHash]);

  // Generate standard complaint draft (Section 5 template)
  const generatedDraft = useMemo(() => {
    const effectivePlatform = platform === "Other" ? (customPlatform || "[Enter platform name]") : platform;
    const formattedDate = incidentDate ? new Date(incidentDate).toLocaleString() : "[Enter date and approximate time]";
    const effectivePostUrl = postUrl.trim() || "[Paste the relevant link, if available]";
    const effectiveProfileUrl = profileUrl.trim() ? ` (Account: ${profileUrl.trim()})` : "";
    const effectiveDescription = concernDescription.trim() || "[explain in factual terms how the content misrepresents, impersonates, harasses, threatens, defrauds, or otherwise harms someone]";
    const effectiveAdditional = additionalDetails.trim() || "None at present.";

    return `Subject: Complaint regarding suspected manipulated/deepfake image or video misuse

Date discovered: ${formattedDate}
Platform or website: ${effectivePlatform}
Post/profile URL: ${effectivePostUrl}${effectiveProfileUrl}

Incident description: I wish to report an image/video that I believe may have been manipulated or generated using artificial intelligence and may be being used in a misleading or harmful manner. I discovered the content on ${formattedDate} on ${effectivePlatform}. The relevant post/profile link is ${effectivePostUrl}. The concern is that ${effectiveDescription}

Supporting evidence: I have preserved the evidence available to me, including ${generatedEvidenceList}. A deepfake detection system flagged the file as potentially manipulated. I understand that the system’s result is a technical assessment and not conclusive proof by itself. I request that the appropriate authority review the incident and take action as considered appropriate under applicable law.

Additional details: ${effectiveAdditional}

Declaration: I confirm that the information provided is accurate to the best of my knowledge.`;
  }, [incidentDate, platform, customPlatform, postUrl, profileUrl, concernDescription, generatedEvidenceList, additionalDetails]);

  // Keep userEditedDraft in sync unless the user manually edited it
  const activeDraft = isDraftManuallyEdited ? userEditedDraft : generatedDraft;

  // Local Acknowledgement Tracker (Section 6 & 7)
  const [trackerRecords, setTrackerRecords] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRACKER);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newAckNumber, setNewAckNumber] = useState("");
  const [newAckDate, setNewAckDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newAckCategory, setNewAckCategory] = useState("Report Other Cyber Crime");
  const [newAckNotes, setNewAckNotes] = useState("");
  const [saveAckSuccess, setSaveAckSuccess] = useState(false);

  const handleSaveAcknowledgement = (e) => {
    e.preventDefault();
    if (!newAckNumber.trim()) return;

    const newRecord = {
      id: `ack-${Date.now()}`,
      referenceNumber: newAckNumber.trim(),
      dateFiled: newAckDate,
      category: newAckCategory,
      analysisId: activeAnalysisId,
      fileName: activeFileName,
      notes: newAckNotes.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = [newRecord, ...trackerRecords];
    setTrackerRecords(updated);
    try {
      localStorage.setItem(STORAGE_KEY_TRACKER, JSON.stringify(updated));
    } catch (err) {
      console.warn("Failed to persist tracker record:", err);
    }

    setNewAckNumber("");
    setNewAckNotes("");
    setSaveAckSuccess(true);
    setTimeout(() => setSaveAckSuccess(false), 3000);
  };

  const handleDeleteAcknowledgement = (id) => {
    const updated = trackerRecords.filter((rec) => rec.id !== id);
    setTrackerRecords(updated);
    try {
      localStorage.setItem(STORAGE_KEY_TRACKER, JSON.stringify(updated));
    } catch (err) {
      console.warn("Failed to update tracker:", err);
    }
  };

  const handleClearAllTrackerData = () => {
    if (window.confirm("Are you sure you want to permanently clear all stored local complaint reference records from this browser?")) {
      setTrackerRecords([]);
      try {
        localStorage.removeItem(STORAGE_KEY_TRACKER);
      } catch {
        // fallback
      }
    }
  };

  const handleCopyDraft = async () => {
    try {
      await navigator.clipboard.writeText(activeDraft);
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2500);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const handleDownloadDraft = () => {
    const blob = new Blob([activeDraft], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Cybercrime-Complaint-Draft-${activeAnalysisId || Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadedDraft(true);
    setTimeout(() => setDownloadedDraft(false), 2500);
  };

  const handleCopyHash = async () => {
    if (!activeFileHash) return;
    try {
      await navigator.clipboard.writeText(activeFileHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } catch (err) {
      console.error("Hash copy failed:", err);
    }
  };

  const getPlatformIcon = (iconName) => {
    switch (iconName) {
      case "Instagram":
        return <InstagramIcon className="w-5 h-5" />;
      case "Youtube":
        return <YoutubeIcon className="w-5 h-5" />;
      case "Twitter":
        return <TwitterIcon className="w-5 h-5" />;
      case "Facebook":
        return <FacebookIcon className="w-5 h-5" />;
      case "MessageSquare":
        return <WhatsAppIcon className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Emergency Helpline Banner (Section 7 & 8) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-rose-950/40 border border-rose-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
            <Phone className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-white">Emergency & Urgent Threat Assistance</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 border border-rose-500/40">INDIA HELPLINES</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              If the incident involves immediate danger, physical safety threats, or extortion, contact local police immediately. 
              Emergency Police: <span className="text-rose-400 font-bold font-mono">112</span> | Cyber Crime Helpline: <span className="text-rose-400 font-bold font-mono">1930</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
          <a
            href="tel:1930"
            className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600 border border-rose-500/50 text-white text-xs font-semibold transition"
          >
            Call 1930
          </a>
          <a
            href="tel:112"
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition"
          >
            Call 112
          </a>
        </div>
      </div>

      {/* 2. Main Guide Panel Header (Section 1 & 6) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
              <span>Cybercrime Complaint Assistance Guide</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
              What Should I Do Next? — Incident Response Protocol
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              For Context-Aware Frequency Analysis Deepfake Forensics. Follow this structured workflow to preserve authentic digital evidence, prepare an accurate draft statement, and file directly on official portals.
            </p>
          </div>

          {/* Quick Action: Open Government Portal */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <a
              href="https://cybercrime.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02]"
            >
              <span>Open Official Cybercrime Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Technical Estimate & Limitations Notice (Section 1 & 7) */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-1.5 text-xs text-slate-300">
          <div className="flex items-center space-x-2 text-amber-400 font-bold font-mono">
            <Info className="w-4 h-4 shrink-0" />
            <span>CRITICAL TECHNICAL & LEGAL LIMITATIONS NOTICE</span>
          </div>
          <p className="text-slate-400 leading-relaxed pl-6">
            A detector’s score is a technical probabilistic estimate and supporting forensic information only. 
            It is <strong className="text-slate-200">not legally conclusive proof</strong> that a specific person committed a crime or that media was illegally altered. 
            Confidence scores may include false positives or false negatives. Do not accuse anyone directly without official law enforcement investigation.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pt-3 border-t border-slate-800/80 no-scrollbar">
          {[
            { id: "checklist", label: "1. Evidence Checklist", count: `${checklistCompletedCount}/8` },
            { id: "draft", label: "2. Prepare Complaint Draft", badge: "Interactive" },
            { id: "portal_guide", label: "3. cybercrime.gov.in Filing Steps", badge: "Official" },
            { id: "tracker", label: "4. Acknowledgement Tracker", count: trackerRecords.length },
            { id: "platforms", label: "5. Platform Takedowns", badge: SOCIAL_PLATFORMS.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                  activeTab === tab.id ? "bg-indigo-700 text-indigo-100" : "bg-slate-800 text-slate-400"
                }`}>
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-mono ${
                  activeTab === tab.id ? "bg-indigo-700 text-indigo-100" : "bg-slate-800 text-slate-400"
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: EVIDENCE CHECKLIST (Section 4) */}
      {activeTab === "checklist" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] flex items-center space-x-2">
                <FileCheck2 className="w-5 h-5 text-indigo-400" />
                <span>Forensic Evidence Preservation Checklist</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Preserve all digital artifacts before content is edited, deleted, or hidden by bad actors.
              </p>
            </div>

            <div className="flex items-center space-x-3 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 shrink-0">
              <span className="text-xs text-slate-400">Readiness:</span>
              <span className="text-xs font-mono font-bold text-indigo-400">
                {checklistCompletedCount} of 8 items verified
              </span>
              <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${(checklistCompletedCount / 8) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {[
              {
                id: "originalFile",
                title: "Original Image / Video File",
                desc: "Retain the original unaltered media file exactly as received without filters, screenshots, or re-compression to preserve EXIF metadata."
              },
              {
                id: "postUrl",
                title: "Post / Website URL",
                desc: "Copy the full canonical link to the specific post, video, reel, or webpage where the synthetic media was published."
              },
              {
                id: "profileUrl",
                title: "Profile / Account URL & Identifiers",
                desc: "Record the publisher's user handle, profile link, account bio, user ID, and follower count."
              },
              {
                id: "screenshots",
                title: "Contextual Screenshots",
                desc: "Capture full-screen images showing the media, URL bar, view count, comments, and current system timestamp."
              },
              {
                id: "messages",
                title: "Threat / Extortion Communications",
                desc: "Preserve chat exports, emails, SMS, or extortion demands without modifying or deleting messages."
              },
              {
                id: "dateTime",
                title: "Discovery Date & Time Record",
                desc: "Document the precise date and time the manipulated content was first observed and on which platform."
              },
              {
                id: "detectorReport",
                title: "Detector Report & Limitations",
                desc: `FreqGuard technical report (${activeModelVersion}), confidence score (${activeConfidence}), and technical disclaimer.`
              },
              {
                id: "fileHash",
                title: "Cryptographic File Hash (SHA-256)",
                desc: "Compute SHA-256 hash to prove media bitstream integrity for official forensic proceedings."
              }
            ].map((item) => (
              <label
                key={item.id}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                  checklist[item.id]
                    ? "bg-indigo-950/20 border-indigo-500/40"
                    : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={Boolean(checklist[item.id])}
                  onChange={() => toggleChecklistItem(item.id)}
                  className="mt-1 w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500 cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold ${checklist[item.id] ? "text-indigo-200" : "text-white"}`}>
                      {item.title}
                    </span>
                    {checklist[item.id] && (
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {/* Cryptographic SHA-256 Display Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
                <Hash className="w-3.5 h-3.5 text-indigo-400" />
                <span>SHA-256 FORENSIC FINGERPRINT (DIGITAL INTEGRITY)</span>
              </span>
              <p className="text-xs font-mono text-slate-300 break-all select-all">
                {activeFileHash || "Generating file hash from analysis stream..."}
              </p>
            </div>

            {activeFileHash && (
              <button
                onClick={handleCopyHash}
                className="shrink-0 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition"
              >
                {copiedHash ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Hash Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Copy SHA-256</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Next Step Nav Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab("draft")}
              className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
            >
              <span>Proceed to Complaint Preparation Form</span>
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: COMPLAINT PREPARATION FORM & DRAFT (Section 5 & 6) */}
      {activeTab === "draft" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-8">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Complaint Preparation & Draft Statement Generator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter incident details below. An editable, legally neutral complaint draft will be automatically compiled according to official standards.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Input Form */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Date Discovered */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Discovery Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Platform */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Platform / Website
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="X (Twitter)">X (Twitter)</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Facebook">Facebook</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Reddit">Reddit</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Other">Other Website / Portal</option>
                  </select>
                </div>
              </div>

              {platform === "Other" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Specify Website / Host Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. example-forum.com"
                    value={customPlatform}
                    onChange={(e) => setCustomPlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Post URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Post / Media URL
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/p/... or website post link"
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {/* Profile URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Suspect Profile / Account URL (If known)
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/account_name"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {/* Incident Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Incident Classification
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Impersonation / Non-Consensual Synthetic Media">Impersonation / Identity Misuse</option>
                  <option value="Defamation / Harassment / Cyberbullying">Defamation / Harassment / Cyberbullying</option>
                  <option value="Non-Consensual Sexually Explicit Imagery">Non-Consensual Explicit Imagery</option>
                  <option value="Extortion / Blackmail">Extortion / Blackmail</option>
                  <option value="Financial Fraud / Scams / Deepfake Impersonation">Financial Fraud / Investment Scams</option>
                  <option value="Misinformation / False Attribution">Misinformation / False Public Attribution</option>
                </select>
              </div>

              {/* Description of Concern */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Factual Concern / Incident Description
                </label>
                <textarea
                  rows={3}
                  value={concernDescription}
                  onChange={(e) => setConcernDescription(e.target.value)}
                  placeholder="Explain in factual terms how the content misrepresents, impersonates, harasses, threatens, defrauds, or otherwise harms someone..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Additional Details */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Additional Details (Witnesses, prior reports, threats)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Reported to platform helpdesk on 10 Oct; suspect demanded payment."
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                <p>
                  <strong className="text-indigo-400">Evidence attached:</strong> {generatedEvidenceList}
                </p>
              </div>
            </div>

            {/* Right: Live Editable Draft Preview */}
            <div className="lg:col-span-6 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Complaint Draft Preview
                  </span>
                  {isDraftManuallyEdited && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Customized
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {isDraftManuallyEdited && (
                    <button
                      onClick={() => {
                        setIsDraftManuallyEdited(false);
                        setUserEditedDraft("");
                      }}
                      className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center space-x-1"
                      title="Reset to generated draft"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                  <button
                    onClick={handleCopyDraft}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 font-medium transition"
                  >
                    {copiedDraft ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Copy Draft</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadDraft}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 text-xs text-white font-medium transition"
                  >
                    {downloadedDraft ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Downloaded</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download .txt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Editable Text Area for Section 5 draft */}
              <div className="relative flex-grow flex flex-col">
                <textarea
                  value={activeDraft}
                  onChange={(e) => {
                    setIsDraftManuallyEdited(true);
                    setUserEditedDraft(e.target.value);
                  }}
                  rows={16}
                  className="w-full flex-grow p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-indigo-500 resize-y"
                  placeholder="Draft statement will appear here..."
                />
              </div>

              <p className="text-[11px] text-slate-400">
                You must review the draft and remove or modify any statement that does not match the facts before submitting on the portal.
              </p>

              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={() => setActiveTab("checklist")}
                  className="text-xs text-slate-400 hover:text-white transition"
                >
                  ← Back to Checklist
                </button>
                <button
                  onClick={() => setActiveTab("portal_guide")}
                  className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
                >
                  <span>Step-by-Step Portal Guide</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: STEP-BY-STEP FILING GUIDE FOR CYBERCRIME.GOV.IN (Section 3 & 8) */}
      {activeTab === "portal_guide" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] flex items-center space-x-2">
                <Globe className="w-5 h-5 text-indigo-400" />
                <span>Step-by-Step: Filing on cybercrime.gov.in</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Official procedure for registering a complaint on India's National Cyber Crime Reporting Portal.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <a
                href="https://cybercrime.gov.in/Webform/Citizen_Manual.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition"
              >
                <span>Citizen Manual PDF</span>
                <ExternalLink className="w-3 h-3 text-indigo-400" />
              </a>
              <a
                href="https://cybercrime.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
              >
                <span>Open cybercrime.gov.in</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 9 Step Cards (Section 3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Open the Portal",
                desc: "Visit the official National Cyber Crime Reporting Portal at https://cybercrime.gov.in/. Verify the official .gov.in domain to protect against phishing.",
                tip: "Official URL: https://cybercrime.gov.in"
              },
              {
                step: "2",
                title: "Choose Reporting Route",
                desc: "Select the route matching the incident: 'Report Crime Related to Women / Children' or 'Report Other Cyber Crime' for regular cyber offenses.",
                tip: "Women/Children route has distinct reporting options."
              },
              {
                step: "3",
                title: "Register or Log In",
                desc: "Enter your mobile number and verify via OTP. Available reporting and anonymity options depend on the selected category and portal guidelines.",
                tip: "Never enter portal OTPs into third-party software."
              },
              {
                step: "4",
                title: "Select Closest Category",
                desc: "Choose the subcategory representing the facts (e.g. Impersonation, Social Media Abuse, Defamation, Financial Fraud). Do not select unrelated categories.",
                tip: "Accurate category accelerates police allocation."
              },
              {
                step: "5",
                title: "Enter Incident Details",
                desc: "Provide accurate facts: discovery date/time, platform, URLs, what makes the content harmful/misleading, and whether extortion, threats, or harassment are present.",
                tip: "Paste your generated complaint draft here."
              },
              {
                step: "6",
                title: "Attach Evidence",
                desc: "Upload unmodified original files or screenshots within portal size limits. Keep an unchanged master copy. Do not upload intimate imagery except via official instructions.",
                tip: "Ensure screenshots show timestamps & URL."
              },
              {
                step: "7",
                title: "Review and Submit",
                desc: "Review every field and jurisdictional detail for accuracy. Once verified, submit the complaint through the official portal interface.",
                tip: "Confirm jurisdictional state/district carefully."
              },
              {
                step: "8",
                title: "Save Reference Number",
                desc: "Save the official Acknowledgement / Complaint Reference Number and any confirmation SMS/Email. Store it in our local tracker below.",
                tip: "Keep the acknowledgement PDF or receipt safe."
              },
              {
                step: "9",
                title: "Track & Follow Up",
                desc: "Use the portal’s complaint-tracking tool to monitor status. For urgent physical threats or ongoing extortion, contact local police or emergency 112.",
                tip: "Helpline: 1930 for financial/cyber assistance."
              }
            ].map((st) => (
              <div
                key={st.step}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-mono font-bold">
                      {st.step}
                    </span>
                    <h4 className="text-sm font-bold text-white font-['Outfit']">{st.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono">
                  <span className="text-indigo-400">Note:</span> {st.tip}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
            <span className="text-slate-300 font-semibold block">Important Portal Procedure Disclaimer:</span>
            <p>
              Portal interface labels and procedures can change over time. The National Cyber Crime Reporting Portal's current on-screen instructions always take precedence over this guide.
            </p>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveTab("draft")}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              ← Back to Draft Statement
            </button>
            <button
              onClick={() => setActiveTab("tracker")}
              className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
            >
              <span>Record Acknowledgement Number</span>
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: LOCAL ACKNOWLEDGEMENT TRACKER (Section 6 & 7) */}
      {activeTab === "tracker" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] flex items-center space-x-2">
                <Bookmark className="w-5 h-5 text-indigo-400" />
                <span>Local Complaint Acknowledgement & Reference Tracker</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Store your official reference number locally to facilitate status tracking on cybercrime.gov.in.
              </p>
            </div>

            {trackerRecords.length > 0 && (
              <button
                onClick={handleClearAllTrackerData}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Local Records</span>
              </button>
            )}
          </div>

          {/* Privacy Notice Box (Section 7) */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center space-x-2 text-indigo-300 font-semibold font-mono">
              <FolderLock className="w-4 h-4 text-indigo-400" />
              <span>STRICT LOCAL STORAGE PRIVACY GUARANTEE</span>
            </div>
            <p className="text-slate-400 leading-relaxed pl-6">
              All complaint references entered below are saved <strong className="text-indigo-200">only in your local browser storage</strong> (<code className="font-mono text-indigo-300">localStorage</code>). 
              They are never sent to external servers, cloud databases, or third parties. You can permanently delete this record anytime using the delete button.
            </p>
          </div>

          {/* Form to Record Reference Number */}
          <form onSubmit={handleSaveAcknowledgement} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Record New Submitted Complaint
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Acknowledgement / Reference Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CC20261011XXXXX"
                  value={newAckNumber}
                  onChange={(e) => setNewAckNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Submission Date
                </label>
                <input
                  type="date"
                  value={newAckDate}
                  onChange={(e) => setNewAckDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Portal Route Used
                </label>
                <select
                  value={newAckCategory}
                  onChange={(e) => setNewAckCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Report Other Cyber Crime">Report Other Cyber Crime</option>
                  <option value="Report Crime Related to Women/Children">Report Crime Related to Women/Children</option>
                  <option value="Financial Fraud (1930 / Citizen Helpline)">Financial Fraud (1930 Helpline)</option>
                  <option value="Local Police Station / Cyber Cell">Local Police Station / Cyber Cell</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Follow-Up Notes / Investigating Officer Info (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Investigation officer assigned, SMS confirmation received, tracking via cybercrime.gov.in"
                value={newAckNotes}
                onChange={(e) => setNewAckNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Associated with Forensic ID: <code className="font-mono text-slate-400">{activeAnalysisId}</code>
              </span>
              <button
                type="submit"
                className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save to Browser</span>
              </button>
            </div>

            {saveAckSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Reference number recorded securely in local storage.</span>
              </div>
            )}
          </form>

          {/* List of Saved Records */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Saved Reference Records ({trackerRecords.length})
            </h4>

            {trackerRecords.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-1 text-slate-500 text-xs">
                <p>No complaint reference numbers recorded yet.</p>
                <p className="text-[11px]">Once you submit on cybercrime.gov.in, save your acknowledgement number above for easy follow-up.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {trackerRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-indigo-400">
                          {rec.referenceNumber}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {rec.dateFiled}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-200">
                        {rec.category}
                      </div>
                      {rec.notes && (
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {rec.notes}
                        </p>
                      )}
                      {rec.fileName && (
                        <div className="text-[10px] text-slate-500 font-mono truncate">
                          File: {rec.fileName}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <a
                        href="https://cybercrime.gov.in/Webform/CheckStatus.aspx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        <span>Check Status on Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => handleDeleteAcknowledgement(rec.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SOCIAL PLATFORMS & REMINDER (Section 2 & 6) */}
      {activeTab === "platforms" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] flex items-center space-x-2">
              <Share2 className="w-5 h-5 text-indigo-400" />
              <span>Report Content to Social Media Platforms</span>
            </h3>
            <p className="text-xs text-slate-400">
              In addition to official legal reporting, notify the host platform immediately to trigger content moderation and takedown.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SOCIAL_PLATFORMS.map((platformItem, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700">
                      {getPlatformIcon(platformItem.icon)}
                    </div>
                    <span className="font-bold text-sm text-white">{platformItem.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {platformItem.guide}
                  </p>
                </div>

                <a
                  href={platformItem.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-1.5 w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-medium transition"
                >
                  <span>Open {platformItem.name} Reporting Helpdesk</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Privacy, Safety, and Accuracy Requirements Summary (Section 7) */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3 text-xs text-slate-400">
        <h4 className="font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center space-x-2">
          <Lock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Privacy, Safety & Regulatory Standards Summary</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[11px] leading-relaxed">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-200 font-semibold block">No Automatic Submission</span>
            <p>FreqGuard never submits complaints on your behalf. You review all facts and file directly on official portals.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-200 font-semibold block">Zero Credential Collection</span>
            <p>Never enter portal passwords, OTPs, identity cards, or intimate media into this tool. All data is managed locally.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-200 font-semibold block">Preserve Master Evidence</span>
            <p>Retain unchanged original files. When uploading screenshots or generated reports, confirm they are verifiable copies.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
