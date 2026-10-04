import React from "react";
import { Link } from "react-router-dom";
import { Shield, Sparkles, Lock, Cpu, ExternalLink, Heart } from "lucide-react";
import { GithubIcon } from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight font-['Outfit']">FreqGuard</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Advanced context-aware deepfake detection system leveraging 2D-FFT frequency domain forensics to combat synthetic media threats.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-indigo-400/90 font-mono bg-indigo-950/40 border border-indigo-900/40 rounded-md px-2.5 py-1.5 w-fit">
              <Cpu className="w-3.5 h-3.5" />
              <span>Colab ML Ready Pipeline</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3 font-mono">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition">Landing Page</Link>
              </li>
              <li>
                <Link to="/analyze" className="hover:text-indigo-400 transition">Media Forensics</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-400 transition">Detection Center</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-indigo-400 transition">Analysis History</Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-indigo-400 transition">Take Action & Report</Link>
              </li>
            </ul>
          </div>

          {/* Research & Tech */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3 font-mono">Methodology</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition">Why Frequency Analysis</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-indigo-400 transition">2D Fast Fourier Transform</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-indigo-400 transition">Azimuthal Power Spectrum</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition">Contextual Verification</Link>
              </li>
              <li>
                <a 
                  href="https://cybercrime.gov.in" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center space-x-1 text-slate-400 hover:text-indigo-400 transition"
                >
                  <span>Cyber Crime Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">Disclaimer & Safety</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              This detection system is designed as an investigative aid. Probabilistic outputs should be corroborated with source forensics before legal or critical action.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400 pt-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Firebase Auth & Encrypted Pipeline</span>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} FreqGuard Detection System. Built for academic & research presentation.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="text-[11px] text-slate-400">React + Vite + Tailwind + Firebase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
