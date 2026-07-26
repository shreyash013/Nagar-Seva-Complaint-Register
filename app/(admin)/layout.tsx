"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, logout, User } from "@/lib/store";
import {
  ShieldAlert,
  Plus,
  LayoutDashboard,
  ListTodo,
  Map,
  BarChart3,
  FileText,
  Settings,
  HelpCircle,
  Briefcase,
  Building2,
  LogOut
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true);
      const currentUser = getCurrentUser();
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });
  }, [router]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    router.push("/login");
  };

  const isActive = (path: string) => {
    return pathname === path
      ? "bg-surface-container-high text-primary font-semibold"
      : "text-on-surface-variant hover:bg-surface-container-high font-medium";
  };

  if (!isMounted || !user) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex w-full min-h-screen bg-background">
      {/* Sidebar (Desktop) */}
      <nav className="bg-surface-container-low h-screen w-64 fixed left-0 top-0 shadow-sm flex flex-col py-4 border-r border-outline-variant hidden md:flex z-50">
        <div className="px-gutter mb-stack-md flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-heading text-title-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading text-title-md text-primary font-bold">Admin Panel</h2>
            <p className="font-sans text-label-sm text-on-surface-variant font-medium">{user.name}</p>
            {user.uniqueId && (
              <span className="inline-block mt-0.5 px-2 py-0.5 bg-primary/10 text-primary font-mono text-[11px] font-bold rounded">
                ID: {user.uniqueId}
              </span>
            )}
          </div>
        </div>

        {user.role === "admin" && (
          <div className="px-gutter mb-stack-md">
            <button className="w-full bg-primary text-on-primary py-2 rounded-lg font-sans text-label-md flex justify-center items-center space-x-2 hover:bg-primary-fixed-variant transition-colors font-semibold">
              <Plus className="w-5 h-5" />
              <span>New Notice</span>
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <Link href="/nagaradhyaksh" className={`rounded-lg mx-2 flex items-center space-x-3 px-4 py-3 font-sans text-label-md transition-transform duration-200 ${isActive('/nagaradhyaksh')}`}>
                <LayoutDashboard className="w-5 h-5" />
                <span>Overview</span>
              </Link>
            </li>
            <li>
              <Link href="/all-complaints" className={`rounded-lg mx-2 flex items-center space-x-3 px-4 py-3 font-sans text-label-md transition-transform duration-200 ${isActive('/all-complaints')}`}>
                <ListTodo className="w-5 h-5" />
                <span>All Complaints</span>
              </Link>
            </li>
            <li>
              <Link href="/departments" className={`rounded-lg mx-2 flex items-center space-x-3 px-4 py-3 font-sans text-label-md transition-transform duration-200 ${isActive('/departments')}`}>
                <Building2 className="w-5 h-5" />
                <span>Departments & Staff</span>
              </Link>
            </li>
            {user.role !== "mayor" && (
              <li>
                <Link href="/officer-tasks" className={`rounded-lg mx-2 flex items-center space-x-3 px-4 py-3 font-sans text-label-md transition-transform duration-200 ${isActive('/officer-tasks')}`}>
                  <Briefcase className="w-5 h-5" />
                  <span>Officer Tasks</span>
                </Link>
              </li>
            )}
            <li>
              <a href="#" className="text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-2 flex items-center space-x-3 px-4 py-3 font-sans text-label-md transition-transform duration-200 font-medium">
                <Map className="w-5 h-5" />
                <span>Ward Analytics</span>
              </a>
            </li>
            {user.role === "admin" && (
              <li>
                <a href="#" className="text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-2 flex items-center space-x-3 px-4 py-3 font-sans text-label-md transition-transform duration-200 font-medium">
                  <BarChart3 className="w-5 h-5" />
                  <span>Department Performance</span>
                </a>
              </li>
            )}
            <li>
              <Link href="/reports" className={`rounded-lg mx-2 flex items-center space-x-3 px-4 py-3 font-sans text-label-md transition-transform duration-200 ${isActive('/reports')}`}>
                <FileText className="w-5 h-5" />
                <span>Reports</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-auto pt-4 border-t border-outline-variant">
          <ul className="space-y-1">
            <li>
              <a href="#" className="text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-2 flex items-center space-x-3 px-4 py-3 font-sans text-label-md transition-transform duration-200 font-medium">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </a>
            </li>
            <li>
              <a href="#" className="text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-2 flex items-center space-x-3 px-4 py-3 font-sans text-label-md transition-transform duration-200 font-medium">
                <HelpCircle className="w-5 h-5" />
                <span>Help Center</span>
              </a>
            </li>
            <li>
              <button onClick={handleLogout} className="w-full text-error hover:bg-error-container/50 rounded-lg mx-2 flex items-center space-x-3 px-4 py-3 font-sans text-label-md transition-colors duration-200 font-medium mt-2 border-t border-outline-variant">
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen bg-background relative z-10">
        {children}
      </div>
    </div>
  );
}
