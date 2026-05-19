"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, User, ShieldCheck } from "lucide-react";

import { login, Role } from "@/lib/store";

export default function LoginPage() {
  const [authType, setAuthType] = useState<"citizen" | "admin">("citizen");
  const [isLogin, setIsLogin] = useState(true);
  const [adminRole, setAdminRole] = useState<Role>("admin");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (authType === "admin") {
      const username = formData.get("username") as string || "Admin User";
      
      login({
        id: "admin-" + Math.random().toString(36).substr(2, 9),
        name: username,
        role: adminRole
      });
      
      router.push("/all-complaints");
    } else {
      const fullname = formData.get("fullname") as string || "Citizen User";
      
      login({
        id: "cit-" + Math.random().toString(36).substr(2, 9),
        name: fullname,
        role: "citizen"
      });
      
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface rounded-2xl shadow-lg border border-outline-variant overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-on-primary p-6 text-center">
          <div className="w-16 h-16 bg-surface/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-headline-lg-mobile font-bold">Shirol Nagar Parishad</h1>
          <p className="font-sans text-body-md text-primary-fixed">Digital Civic Services Portal</p>
        </div>

        {/* Auth Type Toggle */}
        <div className="flex border-b border-outline-variant">
          <button
            onClick={() => setAuthType("citizen")}
            className={`flex-1 py-4 font-sans text-label-md font-semibold flex items-center justify-center gap-2 transition-colors ${
              authType === "citizen" 
                ? "text-primary border-b-2 border-primary bg-primary/5" 
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <User className="w-5 h-5" />
            Citizen Login
          </button>
          <button
            onClick={() => setAuthType("admin")}
            className={`flex-1 py-4 font-sans text-label-md font-semibold flex items-center justify-center gap-2 transition-colors ${
              authType === "admin" 
                ? "text-primary border-b-2 border-primary bg-primary/5" 
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            Admin Login
          </button>
        </div>

        {/* Form Area */}
        <div className="p-6">
          {authType === "citizen" && !isLogin && (
            <p className="text-sm text-on-surface-variant mb-6 text-center">Register to report issues and access municipal services.</p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {authType === "admin" && (
               <div>
                 <label className="block font-sans text-label-md text-on-surface mb-1">Select Role</label>
                 <select 
                   value={adminRole}
                   onChange={(e) => setAdminRole(e.target.value as Role)}
                   className="w-full border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
                 >
                   <option value="mayor">Mayor / Vice Mayor (Examine)</option>
                   <option value="officer">Officer / Department Head (Resolve)</option>
                   <option value="admin">Super Admin (Full Access)</option>
                 </select>
               </div>
            )}

            {(!isLogin && authType === "citizen") && (
              <div>
                <label className="block font-sans text-label-md text-on-surface mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="fullname"
                  className="w-full border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            <div>
              <label className="block font-sans text-label-md text-on-surface mb-1">
                {authType === "admin" ? "Employee ID / Email / Username" : "Mobile Number"}
              </label>
              <input 
                type="text" 
                name="username"
                className="w-full border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
                placeholder={authType === "admin" ? "Enter your official ID" : "Enter 10-digit mobile number"}
              />
            </div>
            <div>
              <label className="block font-sans text-label-md text-on-surface mb-1">Password</label>
              <input 
                type="password" 
                className="w-full border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {isLogin && (
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="rounded text-primary focus:ring-primary border-outline" />
                  <label htmlFor="remember" className="ml-2 font-sans text-label-sm text-on-surface-variant">Remember me</label>
                </div>
              )}
              {isLogin && (
                <a href="#" className="font-sans text-label-sm text-primary hover:underline">Forgot password?</a>
              )}
            </div>

            <button type="submit" className="w-full bg-primary text-on-primary py-3 rounded-lg font-sans text-label-md font-semibold hover:bg-primary-container hover:text-on-primary-container transition-colors mt-2">
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {authType === "citizen" && (
            <div className="mt-6 text-center font-sans text-label-md text-on-surface-variant">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-primary font-semibold hover:underline focus:outline-none"
              >
                {isLogin ? "Register Now" : "Sign In"}
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-outline-variant text-center">
            <Link href="/" className="font-sans text-label-sm text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-1">
               Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
