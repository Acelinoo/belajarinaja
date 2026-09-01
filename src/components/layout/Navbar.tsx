"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Map,
  Award,
  Compass,
  Search,
  LogIn,
  LogOut,
  User,
  Settings,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { ThemeLanguageSwitcher } from "@/components/common/ThemeLanguageSwitcher";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { completedLessons } = useCurriculumProgressStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { openSearch, openLoginModal } = useModalStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const completedCount = Object.values(completedLessons).filter(
    (item) => item?.completed
  ).length;
  const totalLessons = 116;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));

  const navLinks = [
    { href: "/roadmap", label: t.nav.roadmap, icon: Map },
    { href: "/glossary", label: t.nav.glossary, icon: BookOpen },
    { href: "/certificates", label: t.nav.certificates, icon: Award },
    { href: "/dashboard", label: t.nav.dashboard, icon: Compass },
  ];

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur-md transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          {theme === "fun" ? (
            <NovaCharacter state="idle" className="w-7 h-7 shrink-0 transition-transform group-hover:scale-110" />
          ) : (
            <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-sm">
              BA
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1">
              Belajarin<span className="text-primary font-black">Aja</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-medium hidden sm:inline">
              {progressPercent > 0 ? `${progressPercent}% Selesai` : "Platform Web Dev"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "bg-secondary text-foreground font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Tools & Profile */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <button
            type="button"
            onClick={openSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/80 hover:bg-secondary border border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
            title="Cari Materi (⌘K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cari...</span>
            <kbd className="hidden sm:inline text-[9px] bg-background px-1.5 py-0.5 rounded border border-border text-muted-foreground font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Atmosphere & Language Switcher */}
          <ThemeLanguageSwitcher />

          {/* User Auth Profile Trigger / Dropdown */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground border border-border transition-colors"
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="h-4 w-4 rounded-full" />
                ) : (
                  <User className="h-3.5 w-3.5 text-primary" />
                )}
                <span className="hidden sm:inline truncate max-w-[90px]">{user?.name || "Pelajar"}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>

              {/* Desktop Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card p-1.5 shadow-lg space-y-0.5 z-50 text-xs animate-in fade-in-50 zoom-in-95">
                  <div className="px-2.5 py-2 border-b border-border mb-1">
                    <span className="font-bold text-foreground block truncate">{user?.name}</span>
                    <span className="text-[10px] text-muted-foreground truncate block">{user?.email}</span>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <Compass className="h-3.5 w-3.5" />
                    <span>Dashboard Belajar</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span>Pengaturan Akun</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-destructive hover:bg-destructive/10 transition-colors text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Keluar (Log Out)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              size="sm"
              onClick={openLoginModal}
              className="h-8 text-xs font-semibold px-3.5 rounded-md gap-1"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>{t.nav.login}</span>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-2 animate-in slide-in-from-top-2">
          {isAuthenticated && (
            <div className="p-3 rounded-lg bg-secondary/50 border border-border flex items-center justify-between gap-3 text-xs mb-2">
              <div className="space-y-0.5 truncate">
                <span className="font-bold text-foreground block truncate">{user?.name}</span>
                <span className="text-[10px] text-muted-foreground block truncate">{user?.email}</span>
              </div>
              <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" variant="outline" className="h-7 text-[11px] px-2">
                  <Settings className="h-3 w-3 mr-1" />
                  Pengaturan
                </Button>
              </Link>
            </div>
          )}

          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold ${
                  isActive
                    ? "bg-secondary text-foreground font-bold"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-border mt-2 flex flex-col gap-1">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Keluar dari Akun</span>
              </button>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLoginModal();
                }}
                className="w-full text-xs font-bold rounded-md gap-1.5"
              >
                <LogIn className="h-4 w-4" />
                <span>{t.nav.login}</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
