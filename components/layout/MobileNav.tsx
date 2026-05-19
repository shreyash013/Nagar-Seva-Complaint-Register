import Link from "next/link";
import { Home, PlusCircle, History, User } from "lucide-react";

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface border-t border-outline-variant shadow-lg md:hidden rounded-t-xl pb-safe">
      <Link href="/" className="flex flex-col items-center justify-center text-primary bg-primary-container/20 rounded-xl px-4 py-1 active:scale-90 transition-transform duration-200">
        <Home className="mb-1 w-6 h-6" />
        <span className="font-sans text-label-sm">Home</span>
      </Link>
      <Link href="/submit-complaint" className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-highest rounded-xl px-4 py-1 transition-colors">
        <PlusCircle className="mb-1 w-6 h-6" />
        <span className="font-sans text-label-sm">Submit</span>
      </Link>
      <Link href="/track-complaints" className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-highest rounded-xl px-4 py-1 transition-colors">
        <History className="mb-1 w-6 h-6" />
        <span className="font-sans text-label-sm">My Tracking</span>
      </Link>
      <Link href="/nagaradhyaksh" className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-highest rounded-xl px-4 py-1 transition-colors">
        <User className="mb-1 w-6 h-6" />
        <span className="font-sans text-label-sm">Profile</span>
      </Link>
    </nav>
  );
}
