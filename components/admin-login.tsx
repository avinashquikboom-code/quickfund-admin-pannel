"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  X,
} from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation & Error States
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load remembered email on mount
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("qf-admin-remembered-email");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch {
      // Ignore local storage error in sandboxed environments
    }
  }, []);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Admin email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid business email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFillDemo = () => {
    setEmail("admin@quickfunds.com");
    setPassword("admin123");
    setErrors({});
    setAuthError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    // Save or clear remember me preference
    try {
      if (rememberMe) {
        localStorage.setItem("qf-admin-remembered-email", email.trim());
      } else {
        localStorage.removeItem("qf-admin-remembered-email");
      }
    } catch {
      // Local storage unavailable
    }

    // Simulate authentication processing
    setTimeout(() => {
      // Demo validation rule: password must be at least 6 chars and not 'wrong123'
      if (password === "wrong123") {
        setAuthError("Invalid credentials. Please verify your admin email and password.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Authentication successful. Opening admin workspace...");
      try {
        localStorage.setItem(
          "qf-admin-session",
          JSON.stringify({
            email: email.trim(),
            role: "Super Administrator",
            loginTime: new Date().toISOString(),
          })
        );
      } catch {
        // Ignore
      }

      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    }, 900);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center px-4 py-8 sm:py-12 bg-gradient-to-b from-[#f2f7f4] via-[#f8faf9] to-[#ffffff] relative overflow-x-hidden selection:bg-[#10b981]/20">
      {/* Subtle ambient lighting glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-[#10b981]/12 via-[#087443]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Section: Central Brand Logo Header */}
      <div className="relative z-10 flex flex-col items-center text-center pt-2 sm:pt-4 mb-6">
        <div className="inline-flex items-center gap-3 group">
          <span className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#087443] to-[#10b981] flex items-center justify-center text-white shadow-lg shadow-[#087443]/25 -rotate-6 transition-transform group-hover:rotate-0">
            <ArrowUpRight size={24} className="stroke-[2.5]" />
          </span>
          <div className="flex flex-col text-left">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172b3a]">
              Quick<span className="text-[#087443]">Funds</span>
            </span>
            <span className="text-[9px] font-bold tracking-[2px] text-[#83918e] uppercase">
              Enterprise Admin Console
            </span>
          </div>
        </div>
      </div>

      {/* Center Section: Centered Single-Column Login Card */}
      <div className="relative z-10 max-w-[460px] w-full mx-auto my-auto">
        <div className="bg-white rounded-2xl border border-[#dfe7e2] p-7 sm:p-9 shadow-[0_12px_36px_-8px_rgba(8,116,67,0.08),0_2px_8px_-2px_rgba(23,43,58,0.04)]">
          {/* Card Header & Security Badge */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f7f3] text-[#087443] text-xs font-semibold border border-[#d2e8dc] mb-3">
              <ShieldCheck size={14} className="text-[#087443]" />
              <span>Secure Admin Access</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172b3a] tracking-tight justify-center">
              Welcome Back
            </h1>
            <p className="text-sm text-[#83918e] mt-1.5 leading-relaxed">
              Sign in to access your admin dashboard.
            </p>
          </div>

          {/* Quick Demo Credentials Autofill Helper */}
          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full mb-6 p-2.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/80 text-left transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                ⚡
              </span>
              <span className="text-xs font-semibold text-emerald-900">
                Demo Admin: <span className="font-mono font-medium text-emerald-800">admin@quickfunds.com</span>
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold group-hover:underline">
              Auto-fill
            </span>
          </button>

          {/* Error Banner */}
          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{authError}</div>
              <button
                type="button"
                onClick={() => setAuthError(null)}
                className="text-red-400 hover:text-red-700 cursor-pointer"
                aria-label="Dismiss error"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-[11px] font-bold text-[#172b3a] mb-1.5 uppercase tracking-wider"
              >
                Admin Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 flex items-center pointer-events-none text-[#83918e] z-10">
                  <Mail size={16} />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="admin@quickfunds.com"
                  style={{ paddingLeft: "46px", paddingRight: "16px" }}
                  className={`w-full h-11 text-sm rounded-xl bg-[#fafcfb] hover:bg-white text-[#172b3a] border transition-all placeholder:text-[#9aa59f] focus:bg-white focus:outline-none ${
                    errors.email
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-[#dfe7e2] focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
                  }`}
                  disabled={isLoading}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-[11px] font-bold text-[#172b3a] mb-1.5 uppercase tracking-wider text-left"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 flex items-center pointer-events-none text-[#83918e] z-10">
                  <Lock size={16} />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Enter your password"
                  style={{ paddingLeft: "46px", paddingRight: "46px" }}
                  className={`w-full h-11 text-sm rounded-xl bg-[#fafcfb] hover:bg-white text-[#172b3a] border transition-all placeholder:text-[#9aa59f] focus:bg-white focus:outline-none ${
                    errors.password
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-[#dfe7e2] focus:border-[#087443] focus:ring-4 focus:ring-[#087443]/10"
                  }`}
                  disabled={isLoading}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 flex items-center text-[#83918e] hover:text-[#172b3a] p-1 rounded-md transition-colors cursor-pointer z-10"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox (Aligned Left Directly Below Password) */}
            <div className="pt-1 pb-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#087443] focus:ring-[#087443] border-[#dfe7e2] cursor-pointer accent-[#087443]"
                />
                <span className="text-xs font-medium text-[#4b5563]">
                  Remember this device for 30 days
                </span>
              </label>
            </div>

            {/* Primary Sign In Button (Full Width) */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-2 px-4 rounded-xl bg-[#087443] hover:bg-[#075d37] active:bg-[#05492b] text-white text-sm font-semibold shadow-md shadow-[#087443]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Section: Clean SaaS Compliance Footer */}
      <div className="relative z-10 text-center py-6 mt-4">
        <p className="text-xs text-[#83918e]">
          © 2026 QuickFunds Financial Technologies Private Limited. All rights reserved.
        </p>
        <div className="flex items-center justify-center gap-3 text-[11px] text-[#9aa59f] mt-1.5 font-medium">
          <span>100% Encrypted</span>
          <span>•</span>
          <span>RBI Compliant</span>
          <span>•</span>
          <span>Multi-Tenant Security</span>
        </div>
      </div>
    </div>
  );
}
