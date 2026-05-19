import type { Metadata } from "next";
import { Inter, Public_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Municipal Complaint Portal",
  description: "Citizen portal for complaints and services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-background text-on-background pb-20 md:pb-0">
        {children}
      </body>
    </html>
  );
}
