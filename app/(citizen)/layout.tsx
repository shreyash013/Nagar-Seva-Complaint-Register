"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/store";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const user = getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isMounted) {
    return <div className="min-h-screen flex items-center justify-center bg-surface-container-low text-primary">Loading...</div>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <MobileNav />
    </>
  );
}
