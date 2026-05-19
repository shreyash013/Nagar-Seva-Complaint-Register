import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-highest py-8 px-margin-mobile md:px-margin-desktop mt-auto border-t border-outline-variant">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-stack-md">
        <div className="text-center md:text-left">
          <p className="font-heading text-title-md text-on-surface mb-2">Smart Nagar Parishad Shirol</p>
          <p className="font-sans text-body-md text-on-surface-variant">© 2024 Shirol Municipal Council. All rights reserved. Government of Maharashtra.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="#" className="font-sans text-label-sm text-on-surface-variant hover:text-on-surface hover:underline transition-colors">Public Notices</Link>
          <Link href="#" className="font-sans text-label-sm text-on-surface-variant hover:text-on-surface hover:underline transition-colors">Ward Map</Link>
          <Link href="#" className="font-sans text-label-sm text-on-surface-variant hover:text-on-surface hover:underline transition-colors">Contact Us</Link>
          <Link href="#" className="font-sans text-label-sm text-on-surface-variant hover:text-on-surface hover:underline transition-colors">Privacy Policy</Link>
          <Link href="#" className="font-sans text-label-sm text-on-surface-variant hover:text-on-surface hover:underline transition-colors">Right to Information</Link>
          <Link href="/all-complaints" className="font-sans text-label-sm text-primary font-semibold hover:text-primary-container hover:underline transition-colors">Admin Portal (Demo)</Link>
        </div>
      </div>
    </footer>
  );
}
