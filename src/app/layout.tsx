import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthModal } from "@/components/auth/AuthModal";
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
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var raw = localStorage.getItem('belajarinaja_preferences');
                  var theme = 'dark';
                  if (raw) {
                    var parsed = JSON.parse(raw);
                    if (parsed && parsed.state && parsed.state.theme) {
                      theme = parsed.state.theme;
                    }
                  }
                  var root = document.documentElement;
                  root.classList.remove('light', 'dark', 'fun');
                  root.classList.add(theme);
                  root.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${sansFont.variable} ${monoFont.variable} font-sans antialiased min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white`}
      >
        <AuthProvider>
          <SmoothScrollProvider>
            {children}
            <AuthModal />
          </SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
