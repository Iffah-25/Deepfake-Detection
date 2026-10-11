import React from "react";
import { 
  ExternalLink, 
  ShieldAlert, 
  AlertOctagon,
  FileText,
  Share2,
  Lock
} from "lucide-react";
import { SOCIAL_PLATFORMS } from "../config/constants";
import { 
  InstagramIcon, 
  YoutubeIcon, 
  TwitterIcon, 
  FacebookIcon, 
  WhatsAppIcon 
} from "./SocialIcons";

export default function ActionCard({ analysisId, fileName }) {
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
    <div className="space-y-6">
      {/* Alert Header Box */}
      <div className="glass-panel p-6 rounded-2xl border border-rose-500/30 bg-rose-950/20 space-y-3">
        <div className="flex items-center space-x-3 text-rose-400">
          <AlertOctagon className="w-6 h-6 shrink-0 stroke-[2.5]" />
          <h3 className="text-lg font-bold font-['Outfit'] text-white">
            Action Center & Incident Response Protocol
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Manipulated synthetic media can cause reputational, legal, or financial harm. Follow these verified steps to report this content and protect yourself and others.
        </p>
      </div>

      {/* 5-Step Mitigation Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono font-bold">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">1</span>
            <span>DO NOT RESHARE</span>
          </div>
          <p className="text-xs text-slate-400">
            Resharing even to debunk often amplifies algorithm reach. Stop the distribution chain immediately.
          </p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono font-bold">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">2</span>
            <span>PRESERVE EVIDENCE</span>
          </div>
          <p className="text-xs text-slate-400">
            Save URL links, timestamps, profile IDs, and download this forensic analysis report for official filing.
          </p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono font-bold">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">3</span>
            <span>OFFICIAL REPORTING</span>
          </div>
          <p className="text-xs text-slate-400">
            Submit a takedown report through the verified platform channels and legal cyber crime portals below.
          </p>
        </div>
      </div>

      {/* Official Platform Reporting Grid */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-2">
          <Share2 className="w-4 h-4 text-indigo-400" />
          <span>Platform-Specific Reporting Channels</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOCIAL_PLATFORMS.map((platform, idx) => (
            <div
              key={idx}
              className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700">
                      {getIcon(platform.icon)}
                    </div>
                    <span className="font-bold text-sm text-white">{platform.name}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {platform.guide}
                </p>
              </div>

              <a
                href={platform.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center space-x-1.5 w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-medium transition"
              >
                <span>Open {platform.name} Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
