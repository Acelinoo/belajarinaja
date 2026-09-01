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
  Star,
  Menu,
  X,
} from "lucide-react";

export function FunNavbar() {
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
  const totalXP = completedCount * 30;

  const navLinks = [
    { href: "/roadmap", label: t.nav.roadmap, icon: Map },
    { href: "/glossary", label: t.nav.glossary, icon: BookOpen },
    { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { href: "/settings", label: t.nav.settings, icon: Settings },
  ];

  return (
    <header className="sticky top-3 z-40 px-3 sm:px-6 max-w-7xl mx-auto w-full">
      <div className="rounded-full bg-white/95 backdrop-blur-md border-2 border-[#FED7AA] shadow-[0_10px_30px_rgba(255,155,84,0.15)] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Logo with Robot Companion Avatar */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD84D] border-2 border-[#FED7AA] text-lg shadow-[0_2px_8px_rgba(255,216,77,0.4)] group-hover:scale-105 transition-transform">
            🤖
          </div>
          <span className="font-black tracking-tight text-lg text-[#243447]">
            Belajarin<span className="text-[#D97706] bg-[#FFF8E7] px-1.5 py-0.5 rounded-full border border-[#FED7AA] ml-1 text-sm">Aja</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#FFF8E7] px-3 py-1 rounded-full border border-[#FED7AA]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black rounded-full transition-all ${
                    isActive
                      ? "bg-[#FFD84D] text-[#243447] shadow-[0_2px_8px_rgba(255,216,77,0.35)]"
                      : "text-[#64748B] hover:text-[#243447] hover:bg-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls: Search, XP Counter, Theme/Lang, Auth */}
        <div className="flex items-center gap-2">
          {/* Quick Search Pill */}
          <button
            type="button"
            onClick={openSearch}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF8E7] border border-[#FED7AA] text-xs font-bold text-[#64748B] hover:text-[#243447] hover:bg-white transition-colors"
          >
            <Search className="h-3.5 w-3.5 text-[#5CC8FF]" />
            <span className="text-[11px]">{t.common.search}...</span>
            <kbd className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded-full border border-[#FED7AA] text-[#94A3B8]">
              ⌘K
            </kbd>
          </button>

          {/* Gamified XP Indicator */}
          <Link href="/dashboard" className="hidden lg:inline-flex">
            <Badge className="bg-[#FFF8E7] hover:bg-[#FFF0D4] text-[#D97706] border border-[#FED7AA] text-xs font-black rounded-full px-2.5 py-1 gap-1 shadow-sm transition-all cursor-pointer">
              <Star className="h-3.5 w-3.5 fill-[#FFD84D] text-[#FFD84D]" />
              <span>{totalXP} XP</span>
            </Badge>
          </Link>

          {/* Theme & Language Switcher */}
          <ThemeLanguageSwitcher />

          {/* User Auth / Login */}
          {isAuthenticated && user ? (
            <Link href="/dashboard">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5CC8FF] text-[#243447] font-black text-xs border-2 border-white shadow-[0_2px_8px_rgba(92,200,255,0.3)]">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button
                size="sm"
                className="rounded-full text-xs font-black bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] px-4 shadow-[0_2px_10px_rgba(255,216,77,0.4)] gap-1.5 h-8"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.nav.login}</span>
              </Button>
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF8E7] border border-[#FED7AA] text-[#243447]"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-3xl bg-white border-2 border-[#FED7AA] shadow-[0_15px_35px_rgba(255,155,84,0.2)] space-y-3">
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
                    className={`flex items-center gap-2 p-2.5 text-xs font-black rounded-2xl ${
                      isActive
                        ? "bg-[#FFD84D] text-[#243447]"
                        : "bg-[#FFF8E7] text-[#64748B] hover:text-[#243447]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#FED7AA] flex items-center justify-between">
            <span className="text-xs font-black text-[#D97706] flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-[#FFD84D] text-[#FFD84D]" />
              <span>{totalXP} XP</span>
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setMobileMenuOpen(false);
                openSearch();
              }}
              className="rounded-full text-xs font-bold border-[#FED7AA]"
            >
              <Search className="h-3.5 w-3.5 mr-1" />
              <span>{t.common.search}</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
