"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, Compass, User, BookOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeLanguageSwitcher } from "@/components/common/ThemeLanguageSwitcher";
import { useModalStore } from "@/store/useModalStore";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useGuestProgressStore } from "@/store/useGuestProgressStore";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openSearch } = useModalStore();
  const { user, isAuthenticated, logout } = useUserAuthStore();
  const { completedLessons } = useGuestProgressStore();

  const completedCount = Object.keys(completedLessons).filter(
    (k) => completedLessons[k]?.completed
  ).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-black bg-[#F7F4EA]/95 backdrop-blur-md dark:border-b dark:border-[#1C242D] dark:bg-[#05070A]/85 dark:backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-black bg-[#FFD84D] text-[#121212] font-mono font-black text-sm shadow-[2px_2px_0px_#121212] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all dark:border dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-[0_0_12px_rgba(34,211,238,0.2)]">
              BA
            </div>
            <span className="font-black tracking-tight text-base text-foreground">
              Belajarin<span className="text-[#121212] dark:text-cyan-400 bg-[#FFD84D] dark:bg-transparent px-1 rounded-sm border-2 border-black dark:border-0 ml-0.5 shadow-[1.5px_1.5px_0px_#121212] dark:shadow-none">Aja</span>
            </span>
          </Link>
          <Badge variant="outline" className="hidden text-[10px] lg:inline-flex">
            v1.0 • 20 Tahap
          </Badge>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-xs sm:text-sm md:flex font-bold dark:font-medium">
          <Link
            href="/roadmap"
            className="text-foreground/80 hover:text-foreground transition-colors dark:text-[#94A3B8] dark:hover:text-cyan-300"
          >
            Roadmap 20 Tahap
          </Link>
          <Link
            href="/glossary"
            className="text-foreground/80 hover:text-foreground transition-colors dark:text-[#94A3B8] dark:hover:text-cyan-300"
          >
            Glosarium
          </Link>
          <Link
            href="/dashboard"
            className="text-foreground/80 hover:text-foreground transition-colors dark:text-[#94A3B8] dark:hover:text-cyan-300"
          >
            Dashboard
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={openSearch}
            className="hidden sm:flex h-8 px-2.5 text-xs gap-2 border-2 border-black bg-white text-foreground shadow-[2px_2px_0px_#121212] hover:bg-[#EAE4D5] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:text-[#94A3B8] dark:hover:text-cyan-300 dark:hover:border-cyan-500/40 dark:shadow-none"
          >
            <Search className="h-3.5 w-3.5 text-black dark:text-cyan-400" />
            <span>Cari modul...</span>
            <kbd className="font-mono text-[10px] font-bold bg-[#FFD84D] text-[#121212] px-1.5 py-0.5 rounded border border-black dark:bg-[#0F141A] dark:text-cyan-400 dark:border dark:border-[#1C242D]">
              ⌘K
            </kbd>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={openSearch}
            className="sm:hidden h-8 w-8 p-0 text-foreground dark:text-[#94A3B8] dark:hover:text-cyan-300 dark:border-[#1C242D] dark:bg-[#090D12]"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Theme & Language Switcher */}
          <ThemeLanguageSwitcher />

          {/* User Auth State */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button size="sm" variant="outline" className="text-xs gap-1.5 h-8 font-bold dark:font-medium">
                  <User className="h-3.5 w-3.5 text-primary dark:text-cyan-400" />
                  <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                </Button>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                onClick={logout}
                className="h-8 w-8 p-0 text-foreground dark:text-[#94A3B8] dark:hover:text-red-400"
                title="Keluar"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button size="sm" className="text-xs font-bold h-8">
                  {completedCount > 0 ? "Simpan Progress" : "Masuk / Daftar"}
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden h-8 w-8 p-0 text-foreground dark:text-[#94A3B8] dark:border-[#1C242D] dark:bg-[#090D12]"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b-2 border-black bg-white p-4 space-y-3 md:hidden shadow-[4px_4px_0px_#121212] dark:border-b dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-none">
          <nav className="flex flex-col space-y-2 text-sm font-bold dark:font-medium">
            <Link
              href="/roadmap"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-[#FFD84D] border-2 border-transparent hover:border-black transition-colors text-foreground dark:hover:bg-[#151B22] dark:hover:text-cyan-300 dark:border-0"
            >
              Roadmap 20 Tahap
            </Link>
            <Link
              href="/glossary"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-[#70B7FF] border-2 border-transparent hover:border-black transition-colors text-foreground dark:hover:bg-[#151B22] dark:hover:text-cyan-300 dark:border-0"
            >
              Glosarium Web Dev
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-[#7BE495] border-2 border-transparent hover:border-black transition-colors text-foreground dark:hover:bg-[#151B22] dark:hover:text-cyan-300 dark:border-0"
            >
              Dashboard Siswa
            </Link>
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-[#FF6FAE] border-2 border-transparent hover:border-black transition-colors text-foreground dark:hover:bg-[#151B22] dark:hover:text-cyan-300 dark:border-0"
            >
              Masuk / Registrasi Akun
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
