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
  Sparkles,
  X,
  FileCheck2,
  TrendingUp,
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8faf9] text-[#172b3a] selection:bg-[#10b981]/20">
      {/* ================= LEFT COLUMN: BRANDING & FINTECH SHOWCASE (DESKTOP) ================= */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 flex-col justify-between p-10 xl:p-14 bg-gradient-to-br from-[#042d24] via-[#064e3b] to-[#021b16] text-white relative overflow-hidden">
        {/* Subtle decorative background glow circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#10b981]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#087443]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] rounded-full border border-white/5 pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#10b981] to-[#087443] flex items-center justify-center text-white shadow-lg shadow-[#087443]/30 -rotate-6">
              <ArrowUpRight size={22} className="stroke-[2.5]" />
            </span>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-white">
                Quick<span className="text-[#34d399]">Funds</span>
              </span>
              <span className="text-[9px] font-semibold tracking-[2px] text-emerald-300/80 uppercase">
                Enterprise Admin
              </span>
            </div>
          </div>
        </div>

        {/* Center Content: Platform Highlights */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-emerald-200 text-xs font-medium mb-6">
            <Sparkles size={14} className="text-[#34d399]" />
            <span>Operational Credit & Risk Management</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-[1.2] mb-4">
            Unified Merchant Credit & Liquidity Engine
          </h1>
          <p className="text-emerald-100/75 text-sm xl:text-base leading-relaxed mb-8">
            Monitor real-time merchant KYC verifications, approved credit lines, instant UPI payouts, and daily micro-settlements through a single pane of glass.
          </p>

          {/* Metric Highlights Card */}
          <div className="p-5 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 shadow-2xl space-y-4">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-200/80 font-medium">
                  <TrendingUp size={14} className="text-[#34d399]" />
                  Portfolio Disbursed
                </div>
                <div className="text-xl xl:text-2xl font-bold text-white mt-1">₹4.82 Cr</div>
                <div className="text-[11px] text-emerald-300 font-medium mt-0.5">+18.4% this cycle</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-200/80 font-medium">
                  <FileCheck2 size={14} className="text-[#34d399]" />
                  Auto-KYC Ratio
                </div>
                <div className="text-xl xl:text-2xl font-bold text-white mt-1">99.4%</div>
                <div className="text-[11px] text-emerald-300 font-medium mt-0.5">Aadhaar & PAN live</div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1 text-xs text-white/80">
              <ShieldCheck size={16} className="text-[#34d399] shrink-0" />
              <span>Full audit logging and role-based access control enabled.</span>
            </div>
          </div>
        </div>

        {/* Bottom Security Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-emerald-200/60 pt-6 border-t border-white/10">
          <span>RBI Compliant Architecture</span>
          <span>AES-256 Encrypted</span>
        </div>
      </div>

      {/* ================= RIGHT COLUMN: LOGIN FORM ================= */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 xl:p-16 overflow-y-auto">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden flex items-center justify-between py-2 mb-6">
          <div className="inline-flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#087443] flex items-center justify-center text-white shadow-md -rotate-6">
              <ArrowUpRight size={18} className="stroke-[2.5]" />
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-[#172b3a]">
                Quick<span className="text-[#087443]">Funds</span>
              </span>
              <span className="text-[8px] font-semibold tracking-wider text-[#83918e] uppercase">
                Admin Console
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200">
            <ShieldCheck size={12} className="text-[#087443]" />
            Secure
          </span>
        </div>

        {/* Centered Login Card */}
        <div className="max-w-[420px] w-full mx-auto my-auto py-4">
          <div className="bg-white rounded-2xl border border-[#dfe7e2] p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(23,43,58,0.05)]">
            {/* Header Badge & Title */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f0f7f3] text-[#087443] text-xs font-semibold border border-[#d2e8dc] mb-3">
                <ShieldCheck size={14} className="text-[#087443]" />
                <span>Secure Admin Access</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172b3a] tracking-tight">
                Welcome Back
              </h2>
              <p className="text-sm text-[#83918e] mt-1.5 leading-relaxed">
                Sign in to access your administrative dashboard and merchant controls.
              </p>
            </div>

            {/* Quick Demo Credentials Helper */}
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full mb-6 p-2.5 rounded-lg bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/80 text-left transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                  ⚡
                </span>
                <span className="text-xs font-semibold text-emerald-900">
                  Fill Demo Admin Credentials
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium group-hover:underline">
                Auto-fill
              </span>
            </button>

            {/* Error Banner */}
            {authError && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
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
              <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
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
                  className="block text-xs font-bold text-[#172b3a] mb-1.5 uppercase tracking-wider"
                >
                  Admin Email
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center pointer-events-none text-[#83918e] z-10">
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
                    style={{ paddingLeft: "42px", paddingRight: "14px" }}
                    className={`w-full py-2.5 text-sm rounded-lg bg-white text-[#172b3a] border transition-all placeholder:text-[#9aa59f] focus:outline-none ${
                      errors.email
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-[#dfe7e2] focus:border-[#087443] focus:ring-2 focus:ring-[#087443]/15"
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
                  className="block text-xs font-bold text-[#172b3a] mb-1.5 uppercase tracking-wider"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center pointer-events-none text-[#83918e] z-10">
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
                    style={{ paddingLeft: "42px", paddingRight: "44px" }}
                    className={`w-full py-2.5 text-sm rounded-lg bg-white text-[#172b3a] border transition-all placeholder:text-[#9aa59f] focus:outline-none ${
                      errors.password
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-[#dfe7e2] focus:border-[#087443] focus:ring-2 focus:ring-[#087443]/15"
                    }`}
                    disabled={isLoading}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 flex items-center text-[#83918e] hover:text-[#172b3a] cursor-pointer z-10"
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

              {/* Submit Button (Full Width) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-lg bg-[#087443] hover:bg-[#075d37] active:bg-[#05492b] text-white text-sm font-semibold shadow-md shadow-[#087443]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-[#83918e]">
            © 2026 QuickFunds Financial Technologies Private Limited. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px] text-[#9aa59f] mt-1.5 font-medium">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Security Whitepaper</span>
            <span>•</span>
            <span>System Status</span>
          </div>
        </div>
      </div>
    </div>
  );
}
