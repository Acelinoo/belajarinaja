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
  Code2,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { ThemeLanguageSwitcher } from "@/components/common/ThemeLanguageSwitcher";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";
import { CURRICULUM_STAGES } from "@/data/curriculum";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { completedLessons, clearGuestProgress } = useCurriculumProgressStore();
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const totalLessons = CURRICULUM_STAGES.reduce(
    (acc, stage) => acc + stage.lessons.length,
    0
  );
  const completedCount = isAuthenticated
    ? Object.values(completedLessons).filter((item) => item?.completed).length
    : 0;
  const progressPercent = Math.min(100, Math.round((completedCount / (totalLessons || 1)) * 100));

  const navLinks = [
    { href: "/roadmap", label: t.nav.roadmap || "Roadmap", icon: Map },
    { href: "/dashboard", label: t.nav.dashboard || "Dashboard", icon: Compass },
    { href: "/glossary", label: t.nav.glossary || "Glosarium", icon: BookOpen },
    { href: "/certificates", label: t.nav.certificates || "Sertifikat", icon: Award },
  ];

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur-md transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <img
            src="/logo.png"
            alt="Logo BelajarinAja"
            className="h-8 w-8 rounded-lg object-contain dark:invert transition-transform group-hover:scale-105"
          />
          <span className="font-bold text-sm sm:text-base tracking-tight text-foreground flex items-center gap-0.5">
            Belajarin<span className="text-primary font-black">Aja</span>
          </span>
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
                    ? "bg-secondary text-foreground font-bold shadow-xs border border-border"
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 border border-border text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title={language === "en" ? "Search Lessons (⌘K)" : "Cari Materi (⌘K)"}
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{language === "en" ? "Search..." : "Cari..."}</span>
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
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground border border-border transition-colors cursor-pointer"
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="h-5 w-5 rounded-full object-cover border border-border" />
                ) : (
                  <User className="h-4 w-4 text-primary" />
                )}
                <span className="hidden sm:inline truncate max-w-[100px] font-bold">
                  {user?.name || (language === "en" ? "Student" : "Pelajar")}
                </span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-border shadow-xl p-2 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-2 border-b border-border mb-1 flex items-center gap-2.5">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="h-9 w-9 rounded-xl object-cover border border-border shrink-0" />
                    ) : (
                      <div className="h-9 w-9 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="font-bold text-foreground truncate">
                        {user?.name || (language === "en" ? "Web Student" : "Pelajar Web")}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono truncate">@{user?.username || "developer"}</p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-secondary text-foreground transition-colors font-medium"
                  >
                    <Compass className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{t.nav.dashboard}</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-secondary text-foreground transition-colors font-medium"
                  >
                    <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{t.nav.settings}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors font-medium cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{t.nav.logout}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login">
              <Button size="sm" className="h-8 text-xs font-bold rounded-md px-3 gap-1.5">
                <LogIn className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.nav.login}</span>
              </Button>
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden h-8 w-8 rounded-md bg-secondary border border-border flex items-center justify-center text-foreground cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <nav className="space-y-1">
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
                      ? "bg-secondary text-foreground font-bold border border-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <Icon className="h-4 w-4 text-primary" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            >
              <Settings className="h-4 w-4 text-primary" />
              <span>{t.nav.settings}</span>
            </Link>

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>{t.nav.logout}</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}