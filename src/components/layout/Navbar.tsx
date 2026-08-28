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
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-mono font-bold text-sm">
              BA
            </div>
            <span className="font-semibold tracking-tight text-base">
              Belajarin<span className="text-primary">Aja</span>
            </span>
          </Link>
          <Badge variant="outline" className="hidden text-[10px] lg:inline-flex">
            v1.0 • 20 Tahap
          </Badge>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-xs sm:text-sm md:flex">
          <Link
            href="/roadmap"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Roadmap 20 Tahap
          </Link>
          <Link
            href="/glossary"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Glosarium
          </Link>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
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
            className="hidden sm:flex h-8 px-2.5 text-xs text-muted-foreground gap-2 border-border/80"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Cari modul...</span>
            <kbd className="font-mono text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground border border-border">
              ⌘K
            </kbd>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={openSearch}
            className="sm:hidden h-8 w-8 p-0 text-muted-foreground"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Theme & Language Switcher */}
          <ThemeLanguageSwitcher />

          {/* User Auth State */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button size="sm" variant="outline" className="text-xs gap-1.5 h-8">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                </Button>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                onClick={logout}
                className="h-8 w-8 p-0 text-muted-foreground"
                title="Keluar"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button size="sm" className="text-xs font-medium h-8">
                  {completedCount > 0 ? "Simpan Progress" : "Masuk / Daftar"}
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden h-8 w-8 p-0 text-muted-foreground"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-card p-4 space-y-3 md:hidden">
          <nav className="flex flex-col space-y-2 text-sm">
            <Link
              href="/roadmap"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"
            >
              Roadmap 20 Tahap
            </Link>
            <Link
              href="/#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"
            >
              Fitur Interaktif
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"
            >
              Dashboard Siswa
            </Link>
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"
            >
              Masuk / Registrasi Akun
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
