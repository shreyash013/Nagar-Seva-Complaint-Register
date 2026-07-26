"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Search, Bell, UserCircle, LogOut, Settings, ShieldAlert, LogIn } from "lucide-react";
import { getCurrentUser, logout, User } from "@/lib/store";
import { useRouter } from "next/navigation";

export function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    queueMicrotask(() => {
      setUser(getCurrentUser());
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    setUser(null);
    setProfileOpen(false);
    router.push("/login");
  };

  return (
    <header className="bg-surface border-b border-outline-variant w-full sticky top-0 z-40 hidden md:block">
      <div className="flex justify-between items-center w-full px-margin-desktop h-16 max-w-container-max mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-heading text-title-md font-bold text-primary">
            Smart Nagar Parishad Shirol
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="text-primary border-b-2 border-primary pb-1 font-sans text-label-md hover:bg-surface-container-low transition-colors px-2 py-1"
            >
              Dashboard
            </Link>
            <Link
              href="/services"
              className="text-on-surface-variant hover:text-primary font-sans text-label-md hover:bg-surface-container-low transition-colors px-2 py-1"
            >
              Services
            </Link>
            <Link
              href="/track-complaints"
              className="text-on-surface-variant hover:text-primary font-sans text-label-md hover:bg-surface-container-low transition-colors px-2 py-1"
            >
              Complaints
            </Link>
            <Link
              href="/ward-info"
              className="text-on-surface-variant hover:text-primary font-sans text-label-md hover:bg-surface-container-low transition-colors px-2 py-1"
            >
              Ward Info
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Search..."
              className="bg-surface-container-low border border-outline-variant rounded-full pl-4 pr-10 py-1.5 text-body-md font-sans focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface placeholder:text-on-surface-variant"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          </div>
          <button
            aria-label="notifications"
            className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
          
          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="User Profile"
              className={`p-2 rounded-full transition-colors ${profileOpen ? 'bg-surface-container-low text-primary' : 'hover:bg-surface-container-low text-on-surface-variant'}`}
            >
              <UserCircle className="w-5 h-5" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-lg border border-outline-variant py-1 z-50">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-outline-variant mb-1">
                      <p className="font-sans text-label-md text-on-surface font-semibold">{user.name}</p>
                      <p className="font-sans text-label-sm text-on-surface-variant capitalize">{user.role}</p>
                    </div>
                    {(user.role === 'admin' || user.role === 'officer' || user.role === 'mayor') && (
                      <Link
                        href="/nagaradhyaksh"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-on-surface-variant hover:bg-surface-container-low hover:text-primary font-sans text-label-md transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      href="#"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-on-surface-variant hover:bg-surface-container-low hover:text-primary font-sans text-label-md transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-error hover:bg-error-container/50 font-sans text-label-md transition-colors mt-1 border-t border-outline-variant"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 border-b border-outline-variant mb-1">
                      <p className="font-sans text-label-md text-on-surface font-semibold">Guest Citizen</p>
                      <p className="font-sans text-label-sm text-on-surface-variant">Not logged in</p>
                    </div>
                    <Link
                      href="/login"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary-container/50 font-sans text-label-md transition-colors mt-1"
                    >
                      <LogIn className="w-4 h-4" />
                      Login / Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
