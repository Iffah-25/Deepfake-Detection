import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  Key
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/formatters";

export default function Profile() {
  const { user, userProfile, logout, resetPassword } = useAuth();
  const [resetMessage, setResetMessage] = useState("");
  const [error, setError] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setError("");
    setResetMessage("");
    setIsSendingReset(true);
    try {
      await resetPassword(user.email);
      setResetMessage(`Password reset link dispatched to ${user.email}. Check your inbox.`);
    } catch (e) {
      setError(e.message || "Could not send reset email.");
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
          Account Profile & Security
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage your credentials, connected identity, and session settings.
        </p>
      </div>

      {/* Main Profile Details Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        
        {/* User Identity Header */}
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-600/30">
            {userProfile?.name?.[0]?.toUpperCase() || user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-['Outfit']">
              {userProfile?.name || user?.displayName || "Investigator"}
            </h2>
            <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Firebase Session</span>
              </span>
            </div>
          </div>
        </div>

        {/* Profile Attributes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 flex items-center space-x-1.5 font-mono">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Full Name</span>
            </span>
            <p className="font-semibold text-white text-sm">
              {userProfile?.name || user?.displayName || "Not specified"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 flex items-center space-x-1.5 font-mono">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>Email Address</span>
            </span>
            <p className="font-semibold text-white text-sm">{user?.email}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 flex items-center space-x-1.5 font-mono">
              <Phone className="w-3.5 h-3.5 text-indigo-400" />
              <span>Contact Number</span>
            </span>
            <p className="font-semibold text-white text-sm">
              {userProfile?.contact || user?.phoneNumber || "Not configured"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 flex items-center space-x-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Account Created</span>
            </span>
            <p className="font-semibold text-white text-sm">
              {formatDate(user?.metadata?.creationTime || userProfile?.createdAt)}
            </p>
          </div>

        </div>

        {/* Security & Password Section */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-['Outfit'] flex items-center space-x-2">
            <Lock className="w-4 h-4 text-indigo-400" />
            <span>Security & Authentication</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-200">Password Management</p>
              <p className="text-[11px] text-slate-400">
                Send an official password reset link to your registered email address.
              </p>
            </div>
            <button
              onClick={handlePasswordReset}
              disabled={isSendingReset}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition shrink-0"
            >
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isSendingReset ? "Sending..." : "Send Reset Email"}</span>
            </button>
          </div>

          {resetMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{resetMessage}</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Logout Zone */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={logout}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Current Session</span>
          </button>
        </div>

      </div>

    </div>
  );
}
