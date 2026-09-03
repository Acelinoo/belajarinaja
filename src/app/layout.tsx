import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthModal } from "@/components/auth/AuthModal";
import { GuestSyncPromptBanner } from "@/components/common/GuestSyncPromptBanner";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "BelajarinAja — Platform Belajar Web Development Terstruktur Dari Nol",
  description:
    "Roadmap terarah 20 tahap belajar Web Development untuk pemula dari dasar hingga portfolio project. Belajar gratis tanpa login dengan interaktif coding.",
  keywords: [
    "belajar web development",
    "roadmap web developer",
    "belajar coding pemula",
    "kursus html css javascript",
    "react nextjs indonesia",
  ],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body
        className={`${sansFont.variable} ${monoFont.variable} font-sans antialiased min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white`}
      >
        <AuthProvider>
          <SmoothScrollProvider>
            {children}
            <AuthModal />
            <GuestSyncPromptBanner />
          </SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
