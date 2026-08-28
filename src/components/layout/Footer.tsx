import Link from "next/link";
import { Terminal, Shield, Code, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-card/40 py-12 text-muted-foreground text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground font-mono font-bold text-xs">
                BA
              </div>
              <span className="font-semibold tracking-tight text-foreground text-sm">
                Belajarin<span className="text-primary">Aja</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              Platform belajar Web Development terstruktur 20 tahap dari nol. Modul ringkas, latihan interaktif di browser, dan guest access tanpa rintangan login.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px]">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>100% Freemium & Open Curriculum</span>
            </div>
          </div>

          {/* Col 2: Kurikulum */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-foreground text-xs uppercase font-mono tracking-wider">
              Kurikulum
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/roadmap" className="hover:text-foreground transition-colors">
                  Web Fundamentals
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground transition-colors">
                  HTML5 & Modern CSS
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground transition-colors">
                  JavaScript & TypeScript
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground transition-colors">
                  React & Next.js 16
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Fitur Belajar */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-foreground text-xs uppercase font-mono tracking-wider">
              Fitur Platform
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/#guest-mode" className="hover:text-foreground transition-colors">
                  Guest Learning Mode
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Progress Tracker
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground transition-colors">
                  Interactive Quiz
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="hover:text-foreground transition-colors">
                  Glosarium Istilah
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-foreground transition-colors">
                  In-Browser Code Sandbox
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Akun & Bantuan */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-foreground text-xs uppercase font-mono tracking-wider">
              Akses
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/auth/login" className="hover:text-foreground transition-colors">
                  Masuk Akun
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-foreground transition-colors">
                  Registrasi Gratis
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Sertifikat Kelulusan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © 2026 BelajarinAja. Dibangun dengan standar keunggulan rekayasa web frontend modern.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground">
              Privasi
            </Link>
            <Link href="/" className="hover:text-foreground">
              Ketentuan
            </Link>
            <Link href="/roadmap" className="hover:text-foreground">
              Roadmap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
