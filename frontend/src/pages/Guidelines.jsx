import React from "react";
import { 
  ShieldAlert, 
  ExternalLink, 
  Share2, 
  AlertTriangle, 
  FileCheck, 
  Scale, 
  LifeBuoy, 
  PhoneCall, 
  Lock
} from "lucide-react";
import { SOCIAL_PLATFORMS } from "../config/constants";
import { 
  InstagramIcon, 
  YoutubeIcon, 
  TwitterIcon, 
  FacebookIcon, 
  WhatsAppIcon 
} from "../components/SocialIcons";

export default function Guidelines() {
  const getIcon = (iconName) => {
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
        return <ShieldAlert className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Incident Response & Safety Action Center</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit']">
          Deepfake Mitigation & Reporting Guide
        </h1>
        <p className="text-base text-slate-300">
          Official, step-by-step procedures for removing non-consensual synthetic media, preserving forensic evidence, and filing cyber law complaints.
        </p>
      </div>

      {/* 5-Step Protocol Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-indigo-500/30 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] flex items-center space-x-2">
          <FileCheck className="w-6 h-6 text-indigo-400" />
          <span>Recommended 5-Step Action Protocol</span>
        </h2>

        <div className="space-y-4">
          {[
            {
              step: "Step 1",
              title: "Do Not Reshare Or Engage Publicly",
              desc: "Algorithms treat engagement (even angry comments or retweets) as virality signals. Cease interaction on the post to prevent further organic reach."
            },
            {
              step: "Step 2",
              title: "Preserve Digital Forensic Evidence",
              desc: "Take full-screen captures showing URL, timestamps, username handle, and download a copy of the synthetic file alongside your FreqGuard JSON forensic audit report."
            },
            {
              step: "Step 3",
              title: "File Platform Takedown Notices",
              desc: "Use the platform's designated Non-Consensual Synthetic Media / Impersonation form (see direct official portal links below)."
            },
            {
              step: "Step 4",
              title: "Report to Cyber Crime Authorities",
              desc: "For blackmail, extortion, sexual harassment, or defamation, register an FIR on national cyber reporting portals (e.g. cybercrime.gov.in or local cyber cells)."
            },
            {
              step: "Step 5",
              title: "Issue a Public Clarification (If Warranted)",
              desc: "If identity impersonation is widespread, publish a clear, neutral statement on your verified primary channel stating that the media is AI-generated."
            }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono font-bold">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20">{item.step}</span>
                <span className="text-white text-sm">{item.title}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Platform Reporting Portals */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white font-['Outfit'] flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-indigo-400" />
            <span>Official Platform Reporting Channels</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Use verified platform URLs. Never share credentials with third-party unofficial takedown services.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOCIAL_PLATFORMS.map((platform, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700">
                    {getIcon(platform.icon)}
                  </div>
                  <h4 className="font-bold text-base text-white">{platform.name}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {platform.guide}
                </p>
              </div>

              <a
                href={platform.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-medium transition"
              >
                <span>Open {platform.name} Helpdesk</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Framework Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 w-fit">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-['Outfit']">Legal Frameworks & IT Rules</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            In many jurisdictions (including the Indian IT Act & IT Rules 2021 Amendments, US Deepfake Laws, and EU AI Act), creating or distributing non-consensual sexually explicit or defamatory synthetic media is a punishable criminal offense.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
          <div className="font-semibold text-slate-200">Emergency Helpline Assistance:</div>
          <p className="text-slate-400">National Cyber Crime Helpline (India): <span className="text-indigo-400 font-mono font-bold">1930</span></p>
          <p className="text-slate-400">Cyber Crime Portal: <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="text-indigo-400 underline">cybercrime.gov.in</a></p>
        </div>
      </div>

    </div>
  );
}
