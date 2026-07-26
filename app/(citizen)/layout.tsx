"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/store";
import { getAppMode } from "@/lib/config";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      if (getAppMode() === "admin") {
        router.replace("/nagaradhyaksh");
        return;
      }
      setIsMounted(true);
      getCurrentUser();
    });
  }, [router]);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-low text-primary font-sans font-semibold">
        Loading Portal...
      </div>
    );
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
