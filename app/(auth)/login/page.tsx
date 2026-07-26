"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  KeyRound,
  ArrowRight,
  Lock,
  User,
  Phone,
  Building,
  UserPlus,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Building2,
  Crown,
  Eye,
  EyeOff,
  Check,
  X
} from "lucide-react";
import { login, Role, generateSystemUniqueId } from "@/lib/store";
import { getAppMode } from "@/lib/config";

export default function LoginPage() {
  const appMode = getAppMode();
  const [activeTab, setActiveTab] = useState<"official" | "citizen">(
    appMode === "admin" ? "official" : "citizen"
  );
  const [citizenMode, setCitizenMode] = useState<"register" | "login">("register");

  // Citizen Form State
  const [citizenName, setCitizenName] = useState("");
  const [citizenPhone, setCitizenPhone] = useState("");
  const [citizenWard, setCitizenWard] = useState("Ward 1");
  const [citizenEmail, setCitizenEmail] = useState("");
  const [citizenPassword, setCitizenPassword] = useState("");
  const [showCitizenPassword, setShowCitizenPassword] = useState(false);

  // Official Form State
  const [selectedRole, setSelectedRole] = useState<Role>("admin");
  const [officialId, setOfficialId] = useState("");
  const [showOfficialPassword, setShowOfficialPassword] = useState(false);

  // Common Error / Success State
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Strong Password Verification Rules
  const passwordValidation = {
    hasMinLength: citizenPassword.length >= 8,
    hasUpper: /[A-Z]/.test(citizenPassword),
    hasLower: /[a-z]/.test(citizenPassword),
    hasNumber: /[0-9]/.test(citizenPassword),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(citizenPassword)
  };

  const passScore = Object.values(passwordValidation).filter(Boolean).length;
  const isPasswordStrong = passScore === 5;

  // Direct login execution helper
  const executeLogin = (role: Role, uniqueIdInput: string) => {
    setError("");
    let userName = "";

    if (role === "admin") {
      userName = `Master Super Admin (${uniqueIdInput})`;
    } else if (role === "mayor") {
      userName = `Nagaradhyaksh / Mayor (${uniqueIdInput})`;
    } else if (role === "officer") {
      userName = `Department Officer (${uniqueIdInput})`;
    } else {
      userName = `Citizen (${uniqueIdInput})`;
    }

    login({
      id: `usr-${role}-${Date.now()}`,
      name: userName,
      role: role,
      uniqueId: uniqueIdInput
    });

    setSuccessMsg(`Authenticated as ${userName}! Redirecting...`);

    setTimeout(() => {
      if (role === "officer") {
        window.location.href = "/officer-tasks";
      } else if (role === "citizen") {
        window.location.href = "/";
      } else {
        window.location.href = "/nagaradhyaksh";
      }
    }, 400);
  };

  // Handle Citizen Form Submit
  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (citizenMode === "register") {
      if (!citizenName.trim()) {
        setError("Please enter your Full Name.");
        return;
      }
      if (!citizenPhone.trim()) {
        setError("Please enter your Mobile Number.");
        return;
      }
      if (!citizenWard) {
        setError("Please select your Ward.");
        return;
      }
      if (!isPasswordStrong) {
        setError("Please fulfill all strong password requirements before registering.");
        return;
      }

      const generatedId = generateSystemUniqueId("citizen");
      const newUser = {
        id: `usr-${generatedId.toLowerCase()}`,
        name: citizenName.trim(),
        role: "citizen" as Role,
        uniqueId: generatedId
      };

      login(newUser);
      setSuccessMsg(`Account registered successfully! Citizen ID: ${generatedId}`);
      setTimeout(() => {
        window.location.href = "/";
      }, 400);
    } else {
      if (!citizenPhone.trim()) {
        setError("Please enter your Mobile Number or Citizen ID.");
        return;
      }
      if (!citizenPassword.trim()) {
        setError("Please enter your Password / PIN.");
        return;
      }

      const input = citizenPhone.trim().toUpperCase();
      const citizenUser = {
        id: `usr-${input}`,
        name: citizenName.trim() || `Citizen (${input})`,
        role: "citizen" as Role,
        uniqueId: input.startsWith("SNP-CIT") ? input : generateSystemUniqueId("citizen")
      };

      login(citizenUser);
      window.location.href = "/";
    }
  };

  // Handle Official Access Form Submit
  const handleOfficialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const inputKey = officialId.trim().toUpperCase();
    if (!inputKey) {
      setError("Please enter your Official Access Key / ID.");
      return;
    }

    let roleToAssign: Role = selectedRole;

    if (
      inputKey === "ADMIN123" ||
      inputKey === "ADMIN" ||
      inputKey === "ADMIN-123" ||
      inputKey.startsWith("SNP-ADM")
    ) {
      roleToAssign = "admin";
    } else if (
      inputKey === "MAYOR123" ||
      inputKey === "MAYOR" ||
      inputKey === "MAYOR-123" ||
      inputKey.startsWith("SNP-MYR")
    ) {
      roleToAssign = "mayor";
    } else if (
      inputKey === "OFFICER123" ||
      inputKey === "OFFICER" ||
      inputKey === "OFFICER-123" ||
      inputKey.startsWith("SNP-OFF")
    ) {
      roleToAssign = "officer";
    }

    executeLogin(roleToAssign, inputKey);
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4 py-8">
      <div className="max-w-md w-full bg-surface rounded-2xl shadow-xl border border-outline-variant overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-on-primary p-6 text-center relative overflow-hidden">
          <div className="w-14 h-14 bg-surface/15 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm border border-white/10">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading text-headline-md font-bold text-white">Shirol Nagar Parishad</h1>
          <p className="font-sans text-body-md text-primary-fixed mt-1 font-medium">
            {appMode === "admin"
              ? "नगरपरिषद अधिकारी पोर्टल (Official Staff Portal)"
              : appMode === "citizen"
              ? "नागरिक सेवेसाठी पोर्टल (Citizen Portal)"
              : "नागरी सेवा व शासन पोर्टल (Official Portal)"}
          </p>
        </div>

        {/* Tab Selection (Only shown when appMode is "all") */}
        {appMode === "all" && (
          <div className="grid grid-cols-2 bg-surface-container-high p-1.5 border-b border-outline-variant">
            <button
              type="button"
              onClick={() => {
                setActiveTab("citizen");
                setError("");
                setSuccessMsg("");
              }}
              className={`py-2.5 rounded-xl font-sans text-label-md font-bold flex items-center justify-center space-x-2 transition-all ${
                activeTab === "citizen"
                  ? "bg-surface text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Citizen Portal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("official");
                setError("");
                setSuccessMsg("");
              }}
              className={`py-2.5 rounded-xl font-sans text-label-md font-bold flex items-center justify-center space-x-2 transition-all ${
                activeTab === "official"
                  ? "bg-surface text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Official / Admin Login</span>
            </button>
          </div>
        )}

        <div className="p-6 space-y-5">
          {/* Status Notifications */}
          {error && (
            <div className="p-3 bg-error-container/60 border border-error-container text-on-error-container rounded-xl font-sans text-label-md flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl font-sans text-label-md flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: CITIZEN REGISTRATION / LOGIN */}
          {activeTab === "citizen" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-surface-container-low p-1 rounded-xl border border-outline-variant mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setCitizenMode("register");
                    setError("");
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-sans text-label-sm font-semibold transition-all ${
                    citizenMode === "register"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 inline mr-1" />
                  New Registration
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCitizenMode("login");
                    setError("");
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-sans text-label-sm font-semibold transition-all ${
                    citizenMode === "login"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 inline mr-1" />
                  Existing Login
                </button>
              </div>

              <form onSubmit={handleCitizenSubmit} className="space-y-4">
                {citizenMode === "register" ? (
                  <>
                    <div>
                      <label className="block font-sans text-label-md text-on-surface font-semibold mb-1">
                        Full Name (नागरिकाचे नाव) *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Patil"
                          value={citizenName}
                          onChange={(e) => setCitizenName(e.target.value)}
                          className="w-full bg-surface border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 font-sans text-body-md focus:outline-none focus:border-primary"
                        />
                        <User className="w-4 h-4 text-on-surface-variant absolute left-3 top-3.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-sans text-label-md text-on-surface font-semibold mb-1">
                        Mobile Number (मोबाईल नंबर) *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 98765 43210"
                          value={citizenPhone}
                          onChange={(e) => setCitizenPhone(e.target.value)}
                          className="w-full bg-surface border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 font-sans text-body-md focus:outline-none focus:border-primary"
                        />
                        <Phone className="w-4 h-4 text-on-surface-variant absolute left-3 top-3.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-sans text-label-md text-on-surface font-semibold mb-1">
                        Ward (प्रभाग) *
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={citizenWard}
                          onChange={(e) => setCitizenWard(e.target.value)}
                          className="w-full bg-surface border border-outline-variant rounded-xl pl-10 pr-3 py-2.5 font-sans text-body-sm font-medium focus:outline-none focus:border-primary"
                        >
                          <option value="Ward 1">Ward 1 (प्रभाग १)</option>
                          <option value="Ward 2">Ward 2 (प्रभाग २)</option>
                          <option value="Ward 3">Ward 3 (प्रभाग ३)</option>
                          <option value="Ward 4">Ward 4 (प्रभाग ४)</option>
                          <option value="Ward 5">Ward 5 (प्रभाग ५)</option>
                          <option value="Ward 6">Ward 6 (प्रभाग ६)</option>
                          <option value="Ward 7">Ward 7 (प्रभाग ७)</option>
                          <option value="Ward 8">Ward 8 (प्रभाग ८)</option>
                          <option value="Ward 9">Ward 9 (प्रभाग ९)</option>
                          <option value="Ward 10">Ward 10 (प्रभाग १०)</option>
                        </select>
                        <Building className="w-4 h-4 text-on-surface-variant absolute left-3 top-3.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-sans text-label-md text-on-surface font-semibold mb-1">
                        Password (पासवर्ड) *
                      </label>
                      <div className="relative">
                        <input
                          type={showCitizenPassword ? "text" : "password"}
                          required
                          placeholder="Create strong password"
                          value={citizenPassword}
                          onChange={(e) => setCitizenPassword(e.target.value)}
                          className="w-full bg-surface border border-outline-variant rounded-xl pl-10 pr-10 py-2.5 font-sans text-body-md focus:outline-none focus:border-primary"
                        />
                        <Lock className="w-4 h-4 text-on-surface-variant absolute left-3 top-3.5" />
                        <button
                          type="button"
                          onClick={() => setShowCitizenPassword(!showCitizenPassword)}
                          className="absolute right-3 top-3 text-on-surface-variant hover:text-on-surface"
                        >
                          {showCitizenPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password Strength Indicator & Checklist */}
                      {citizenPassword.length > 0 && (
                        <div className="mt-2.5 p-3 bg-surface-container-low rounded-xl border border-outline-variant space-y-2">
                          <div className="flex items-center justify-between font-sans text-label-xs font-bold">
                            <span>Password Strength:</span>
                            <span
                              className={
                                passScore === 5
                                  ? "text-emerald-700 font-bold"
                                  : passScore >= 3
                                  ? "text-amber-700 font-bold"
                                  : "text-error font-bold"
                              }
                            >
                              {passScore === 5 ? "Strong 💪" : passScore >= 3 ? "Medium ⚠️" : "Weak ❌"}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                passScore === 5
                                  ? "bg-emerald-500 w-full"
                                  : passScore >= 3
                                  ? "bg-amber-500 w-3/5"
                                  : "bg-error w-1/5"
                              }`}
                            ></div>
                          </div>

                          {/* Requirements Checklist */}
                          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-sans">
                            <div className={`flex items-center space-x-1 ${passwordValidation.hasMinLength ? "text-emerald-700 font-semibold" : "text-on-surface-variant"}`}>
                              {passwordValidation.hasMinLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 opacity-40" />}
                              <span>Min 8 Characters</span>
                            </div>

                            <div className={`flex items-center space-x-1 ${passwordValidation.hasUpper ? "text-emerald-700 font-semibold" : "text-on-surface-variant"}`}>
                              {passwordValidation.hasUpper ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 opacity-40" />}
                              <span>Uppercase (A-Z)</span>
                            </div>

                            <div className={`flex items-center space-x-1 ${passwordValidation.hasLower ? "text-emerald-700 font-semibold" : "text-on-surface-variant"}`}>
                              {passwordValidation.hasLower ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 opacity-40" />}
                              <span>Lowercase (a-z)</span>
                            </div>

                            <div className={`flex items-center space-x-1 ${passwordValidation.hasNumber ? "text-emerald-700 font-semibold" : "text-on-surface-variant"}`}>
                              {passwordValidation.hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 opacity-40" />}
                              <span>Number (0-9)</span>
                            </div>

                            <div className={`flex items-center space-x-1 col-span-2 ${passwordValidation.hasSpecial ? "text-emerald-700 font-semibold" : "text-on-surface-variant"}`}>
                              {passwordValidation.hasSpecial ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 opacity-40" />}
                              <span>Special Character (@#$%&*)</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-sans text-label-md text-on-surface font-semibold mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. ramesh@gmail.com"
                        value={citizenEmail}
                        onChange={(e) => setCitizenEmail(e.target.value)}
                        className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 font-sans text-body-sm focus:outline-none focus:border-primary"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!isPasswordStrong}
                      className="w-full bg-primary text-on-primary py-3 rounded-xl font-sans text-title-sm font-bold flex items-center justify-center space-x-2 hover:bg-primary-fixed-variant transition-colors shadow-md mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>Register & Go to Dashboard</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block font-sans text-label-md text-on-surface font-semibold mb-1">
                        Mobile Number or Citizen ID *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="Enter Mobile No. or SNP-CIT-XXXX"
                          value={citizenPhone}
                          onChange={(e) => setCitizenPhone(e.target.value)}
                          className="w-full bg-surface border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 font-sans text-body-md focus:outline-none focus:border-primary"
                        />
                        <Phone className="w-4 h-4 text-on-surface-variant absolute left-3 top-3.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-sans text-label-md text-on-surface font-semibold mb-1">
                        Password / PIN *
                      </label>
                      <div className="relative">
                        <input
                          type={showCitizenPassword ? "text" : "password"}
                          required
                          placeholder="Enter your PIN or Password"
                          value={citizenPassword}
                          onChange={(e) => setCitizenPassword(e.target.value)}
                          className="w-full bg-surface border border-outline-variant rounded-xl pl-10 pr-10 py-2.5 font-sans text-body-md focus:outline-none focus:border-primary"
                        />
                        <Lock className="w-4 h-4 text-on-surface-variant absolute left-3 top-3.5" />
                        <button
                          type="button"
                          onClick={() => setShowCitizenPassword(!showCitizenPassword)}
                          className="absolute right-3 top-3 text-on-surface-variant hover:text-on-surface"
                        >
                          {showCitizenPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary text-on-primary py-3 rounded-xl font-sans text-title-sm font-bold flex items-center justify-center space-x-2 hover:bg-primary-fixed-variant transition-colors shadow-md mt-2"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Login to Citizen Dashboard</span>
                    </button>
                  </>
                )}
              </form>
            </div>
          )}

          {/* TAB 2: OFFICIAL / ADMIN LOGIN */}
          {activeTab === "official" && (
            <div className="space-y-4">
              <div>
                <label className="block font-sans text-label-md text-on-surface font-semibold mb-2">
                  1. Select Official Role (अधिकारी पद निवडा) *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("admin")}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                      selectedRole === "admin"
                        ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                        : "bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    <Building2 className="w-5 h-5 mb-1" />
                    <span className="font-sans text-label-xs">Master Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole("mayor")}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                      selectedRole === "mayor"
                        ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                        : "bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    <Crown className="w-5 h-5 mb-1 text-amber-600" />
                    <span className="font-sans text-label-xs">Mayor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole("officer")}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                      selectedRole === "officer"
                        ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                        : "bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    <Briefcase className="w-5 h-5 mb-1 text-secondary" />
                    <span className="font-sans text-label-xs">Dept Officer</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleOfficialSubmit} className="space-y-4">
                <div>
                  <label className="font-sans text-label-md text-on-surface font-semibold flex items-center gap-1.5 mb-1">
                    <KeyRound className="w-4 h-4 text-primary" />
                    2. Official Access Key / ID *
                  </label>

                  <div className="relative">
                    <input
                      type={showOfficialPassword ? "text" : "password"}
                      required
                      value={officialId}
                      onChange={(e) => {
                        setOfficialId(e.target.value);
                        setError("");
                      }}
                      className="w-full bg-surface border border-outline-variant rounded-xl pl-10 pr-10 py-3 font-mono text-body-md uppercase font-bold text-primary focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none tracking-wider"
                      placeholder="Enter Access Key (e.g. ADMIN123)"
                    />
                    <KeyRound className="w-4 h-4 text-on-surface-variant absolute left-3 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowOfficialPassword(!showOfficialPassword)}
                      className="absolute right-3 top-3.5 text-on-surface-variant hover:text-on-surface"
                      title={showOfficialPassword ? "Hide Key" : "Show Key"}
                    >
                      {showOfficialPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-sans text-title-sm font-bold flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md"
                >
                  <span>
                    Login as {selectedRole === "admin" ? "Master Admin" : selectedRole === "mayor" ? "Mayor" : "Dept Officer"}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

          <div className="pt-4 border-t border-outline-variant text-center">
            <Link
              href="/"
              className="font-sans text-label-sm text-on-surface-variant hover:text-primary transition-colors font-semibold"
            >
              ← Return to Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
