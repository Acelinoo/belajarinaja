import Link from "next/link";
import { Terminal, Shield, Code, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-2 border-black bg-white dark:border-border/80 dark:bg-card/40 py-12 text-[#404040] dark:text-muted-foreground text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded border-2 border-black bg-[#FFD84D] text-[#121212] font-mono font-black text-xs shadow-[2px_2px_0px_#121212] dark:border-0 dark:bg-primary dark:text-primary-foreground dark:shadow-none">
                BA
              </div>
              <span className="font-black tracking-tight text-foreground text-sm">
                Belajarin<span className="text-[#121212] dark:text-primary bg-[#FFD84D] dark:bg-transparent px-1 rounded-sm border border-black dark:border-0 ml-0.5">Aja</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm font-medium dark:font-normal">
              Platform belajar Web Development terstruktur 20 tahap dari nol. Modul ringkas, latihan interaktif di browser, dan guest access tanpa rintangan login.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] font-bold">
              <span className="inline-block h-2.5 w-2.5 border border-black rounded-none bg-[#7BE495] dark:rounded-full dark:border-0 dark:bg-emerald-400"></span>
              <span className="text-foreground">100% Freemium & Open Curriculum</span>
            </div>
          </div>

          {/* Col 2: Kurikulum */}
          <div className="space-y-2.5">
            <h4 className="font-black text-foreground text-xs uppercase font-mono tracking-wider">
              Kurikulum
            </h4>
            <ul className="space-y-1.5 font-medium dark:font-normal">
              <li>
                <Link href="/roadmap" className="hover:text-foreground hover:underline transition-colors">
                  Web Fundamentals
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground hover:underline transition-colors">
                  HTML5 & Modern CSS
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground hover:underline transition-colors">
                  JavaScript & TypeScript
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground hover:underline transition-colors">
                  React & Next.js 16
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Fitur Belajar */}
          <div className="space-y-2.5">
            <h4 className="font-black text-foreground text-xs uppercase font-mono tracking-wider">
              Fitur Platform
            </h4>
            <ul className="space-y-1.5 font-medium dark:font-normal">
              <li>
                <Link href="/#guest-mode" className="hover:text-foreground hover:underline transition-colors">
                  Guest Learning Mode
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground hover:underline transition-colors">
                  Progress Tracker
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground hover:underline transition-colors">
                  Interactive Quiz
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="hover:text-foreground hover:underline transition-colors">
                  Glosarium Istilah
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground hover:underline transition-colors">
                  In-Browser Code Sandbox
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Akun & Bantuan */}
          <div className="space-y-2.5">
            <h4 className="font-black text-foreground text-xs uppercase font-mono tracking-wider">
              Akses
            </h4>
            <ul className="space-y-1.5 font-medium dark:font-normal">
              <li>
                <Link href="/auth/login" className="hover:text-foreground hover:underline transition-colors">
                  Masuk Akun
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-foreground hover:underline transition-colors">
                  Registrasi Gratis
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground hover:underline transition-colors">
                  Sertifikat Kelulusan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="mt-10 pt-6 border-t-2 border-black dark:border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium dark:font-normal">
          <div>
            © 2026 BelajarinAja. Dibangun dengan standar keunggulan rekayasa web frontend modern.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground hover:underline">
              Privasi
            </Link>
            <Link href="/" className="hover:text-foreground hover:underline">
              Ketentuan
            </Link>
            <Link href="/roadmap" className="hover:text-foreground hover:underline">
              Roadmap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
