import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center animate-pulse">
            <Shield className="w-7 h-7 text-indigo-400" />
          </div>
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin absolute -bottom-1 -right-1" />
        </div>
        <p className="text-sm font-medium text-slate-400">Authenticating secure session...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login preserving destination state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
