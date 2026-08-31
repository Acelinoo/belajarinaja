import Link from "next/link";
import { Terminal, Shield, Code, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-2 border-black bg-white dark:border-t dark:border-[#1C242D] dark:bg-[#05070A] py-12 text-[#404040] dark:text-[#94A3B8] text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded border-2 border-black bg-[#FFD84D] text-[#121212] font-mono font-black text-xs shadow-[2px_2px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
                BA
              </div>
              <span className="font-black tracking-tight text-foreground text-sm">
                Belajarin<span className="text-[#121212] dark:text-cyan-400 bg-[#FFD84D] dark:bg-transparent px-1 rounded-sm border border-black dark:border-0 ml-0.5">Aja</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm font-medium dark:font-normal dark:text-[#8292A6]">
              Platform belajar Web Development terstruktur 20 tahap dari nol. Modul ringkas, latihan interaktif di browser, dan guest access tanpa rintangan login.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] font-bold dark:font-mono">
              <span className="inline-block h-2.5 w-2.5 border border-black rounded-none bg-[#7BE495] dark:rounded-full dark:border-0 dark:bg-emerald-400 dark:shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-foreground dark:text-[#CBD5E1]">100% Freemium & Open Curriculum</span>
            </div>
          </div>

          {/* Col 2: Kurikulum */}
          <div className="space-y-2.5">
            <h4 className="font-black text-foreground text-xs uppercase font-mono tracking-wider dark:text-cyan-400">
              Kurikulum
            </h4>
            <ul className="space-y-1.5 font-medium dark:font-normal">
              <li>
                <Link href="/roadmap" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  Web Fundamentals
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  HTML5 & Modern CSS
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  JavaScript & TypeScript
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  React & Next.js 16
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Fitur Belajar */}
          <div className="space-y-2.5">
            <h4 className="font-black text-foreground text-xs uppercase font-mono tracking-wider dark:text-cyan-400">
              Fitur Platform
            </h4>
            <ul className="space-y-1.5 font-medium dark:font-normal">
              <li>
                <Link href="/#guest-mode" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  Guest Learning Mode
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  Progress Tracker
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  Interactive Quiz
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  Glosarium Istilah
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  In-Browser Code Sandbox
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Akun & Bantuan */}
          <div className="space-y-2.5">
            <h4 className="font-black text-foreground text-xs uppercase font-mono tracking-wider dark:text-cyan-400">
              Akses
            </h4>
            <ul className="space-y-1.5 font-medium dark:font-normal">
              <li>
                <Link href="/auth/login" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  Masuk Akun
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  Registrasi Gratis
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground hover:underline transition-colors dark:hover:text-cyan-300 dark:no-underline">
                  Sertifikat Kelulusan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="mt-10 pt-6 border-t-2 border-black dark:border-t dark:border-[#1C242D] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium dark:font-normal">
          <div className="dark:text-[#64748B]">
            © 2026 BelajarinAja. Dibangun dengan standar keunggulan rekayasa web frontend modern.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground hover:underline dark:hover:text-cyan-300 dark:no-underline">
              Privasi
            </Link>
            <Link href="/" className="hover:text-foreground hover:underline dark:hover:text-cyan-300 dark:no-underline">
              Ketentuan
            </Link>
            <Link href="/roadmap" className="hover:text-foreground hover:underline dark:hover:text-cyan-300 dark:no-underline">
              Roadmap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
