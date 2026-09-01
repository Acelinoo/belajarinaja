"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Map,
  Compass,
  Award,
  BookOpen,
  Settings,
  Search,
  LogIn,
  User,
  Menu,
  X,
} from "lucide-react";
import { ThemeLanguageSwitcher } from "@/components/common/ThemeLanguageSwitcher";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { NovaCharacter } from "./characters/NovaCharacter";

export function FunNavbar() {
  const pathname = usePathname();
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { completedLessons } = useCurriculumProgressStore();
  const { user, isAuthenticated } = useAuthStore();
  const { openSearch, openLoginModal } = useModalStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const completedCount = Object.values(completedLessons).filter(
    (item) => item?.completed
  ).length;

  const totalLessons = 20;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const navLinks = [
    { href: "/roadmap", label: "Peta Petualangan", labelEn: "World Map", icon: Map },
    { href: "/glossary", label: "Buku Mantra", labelEn: "Spellbook", icon: BookOpen },
    { href: "/certificates", label: "Piala Kelulusan", labelEn: "Trophy Hall", icon: Award },
    { href: "/dashboard", label: "Markas", labelEn: "Explorer HQ", icon: Compass },
  ];

  return (
    <header className="sticky top-3 z-40 px-4 sm:px-6 max-w-6xl mx-auto w-full transition-all duration-300">
      <nav className="rounded-full border-2 border-[#FED7AA] bg-white/95 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-[0_8px_30px_rgba(255,155,84,0.12)] flex items-center justify-between gap-4">
        {/* Brand Logo & Companion Guide */}
        <Link href="/" className="flex items-center gap-3 group">
          <NovaCharacter state="idle" className="w-9 h-9 shrink-0 transition-transform group-hover:scale-110" />
          <div className="flex flex-col">
            <span className="font-black text-sm tracking-tight text-[#243447]">
              Belajarin<span className="text-[#FF6B6B] bg-[#FFF8E7] px-1.5 py-0.5 rounded-full border border-[#FED7AA] ml-0.5">Aja</span>
            </span>
            <span className="text-[9px] font-black text-[#D97706] tracking-wider uppercase">
              ★ {progressPercent}% Selesai
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#FFD84D] text-[#243447] shadow-[0_2px_10px_rgba(255,216,77,0.5)]"
                    : "text-[#64748B] hover:text-[#243447] hover:bg-[#FFF8E7]"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#243447]" : "text-[#FF9F43]"}`} />
                <span>{language === "en" ? link.labelEn : link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <button
            type="button"
            onClick={openSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF8E7] border border-[#FED7AA] text-xs font-bold text-[#64748B] hover:text-[#243447] transition-colors"
          >
            <Search className="h-3.5 w-3.5 text-[#D97706]" />
            <span className="hidden sm:inline">Cari Misi...</span>
          </button>

          {/* Theme & Language Switcher */}
          <ThemeLanguageSwitcher />

          {/* Auth Button */}
          {isAuthenticated ? (
            <Link href="/dashboard">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF8E7] border border-[#FED7AA] text-xs font-black text-[#243447]">
                <User className="h-3.5 w-3.5 text-[#5CC8FF]" />
                <span className="hidden sm:inline truncate max-w-[80px]">{user?.name}</span>
              </div>
            </Link>
          ) : (
            <Button
              size="sm"
              onClick={openLoginModal}
              className="rounded-full bg-[#5CC8FF] hover:bg-[#45B8F0] text-[#243447] font-black text-xs h-8 px-4 shadow-[0_3px_12px_rgba(92,200,255,0.35)]"
            >
              <LogIn className="h-3 w-3 mr-1" />
              <span>Masuk</span>
            </Button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-[#243447] hover:bg-[#FFF8E7]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-3xl border-2 border-[#FED7AA] bg-white shadow-[0_15px_35px_rgba(255,155,84,0.15)] space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-black ${
                  isActive
                    ? "bg-[#FFD84D] text-[#243447]"
                    : "text-[#64748B] hover:bg-[#FFF8E7]"
                }`}
              >
                <Icon className="h-4 w-4 text-[#FF9F43]" />
                <span>{language === "en" ? link.labelEn : link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
