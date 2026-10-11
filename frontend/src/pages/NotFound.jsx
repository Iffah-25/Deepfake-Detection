import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="p-4 rounded-3xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-extrabold text-white font-['Outfit']">404 — Page Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          The requested route does not exist or has been relocated within the FreqGuard detection suite.
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
