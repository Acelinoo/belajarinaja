"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeLanguageSwitcher } from "@/components/common/ThemeLanguageSwitcher";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { getTranslations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Map,
  BookOpen,
  LayoutDashboard,
  Settings,
  Search,
  LogIn,
  User,
  Menu,
  X,
} from "lucide-react";

export function LightNeoNavbar() {
  const pathname = usePathname();
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { completedLessons } = useCurriculumProgressStore();
  const { user, isAuthenticated } = useAuthStore();
  const { openSearch, openAuthModal } = useModalStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const completedCount = Object.values(completedLessons).filter(
    (item) => item.completed
  ).length;

  const navLinks = [
    { href: "/roadmap", label: t.nav.roadmap, icon: Map },
    { href: "/glossary", label: t.nav.glossary, icon: BookOpen },
    { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { href: "/settings", label: t.nav.settings, icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-black bg-[#F7F4EA]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Neo-Brutalist Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-[#FFD84D] text-[#121212] font-mono font-black text-base shadow-[2px_2px_0px_#121212] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0px_#121212] transition-all">
            BA
          </div>
          <span className="font-black tracking-tight text-lg text-[#121212]">
            Belajarin<span className="text-[#121212] bg-[#FFD84D] px-1.5 py-0.5 rounded-sm border border-black ml-1 text-sm shadow-[1px_1px_0px_#121212]">Aja</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded border-2 transition-all ${
                    isActive
                      ? "border-black bg-[#FFD84D] text-[#121212] shadow-[2px_2px_0px_#121212]"
                      : "border-transparent text-[#555555] hover:text-[#121212] hover:bg-black/5"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search */}
          <button
            type="button"
            onClick={openSearch}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-black bg-white text-xs font-bold text-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#FFD84D]/30 transition-all"
          >
            <Search className="h-3.5 w-3.5" />
            <span>{t.common.search}...</span>
            <kbd className="text-[10px] font-mono bg-[#EAE4D5] px-1.5 py-0.2 rounded border border-black">
              ⌘K
            </kbd>
          </button>

          {/* Theme & Language Switcher */}
          <ThemeLanguageSwitcher />

          {/* Authentication */}
          {isAuthenticated && user ? (
            <Link href="/dashboard">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-[#70B7FF] text-[#121212] font-black text-sm shadow-[2px_2px_0px_#121212]">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button
                size="sm"
                className="rounded-lg border-2 border-black bg-[#FFD84D] hover:bg-[#F5CB32] text-[#121212] font-black text-xs h-9 px-4 shadow-[2.5px_2.5px_0px_#121212] gap-1.5"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.nav.login}</span>
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-white text-[#121212] shadow-[2px_2px_0px_#121212]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 border-t-2 border-black bg-white space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span
                    className={`flex items-center gap-2 p-2.5 text-xs font-black rounded-lg border-2 border-black ${
                      isActive
                        ? "bg-[#FFD84D] shadow-[2px_2px_0px_#121212]"
                        : "bg-[#F7F4EA]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
