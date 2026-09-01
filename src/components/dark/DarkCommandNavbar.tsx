"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Terminal,
  Layers,
  Award,
  BookOpen,
  Settings,
  Search,
  LogIn,
  User,
  Activity,
  Code2,
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

export function DarkCommandNavbar() {
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

  const navItems = [
    { href: "/roadmap", label: "DEPENDENCY_TREE", labelEn: "DEPENDENCY_TREE", icon: Layers },
    { href: "/glossary", label: "CLI_DICTIONARY", labelEn: "CLI_DICTIONARY", icon: BookOpen },
    { href: "/certificates", label: "CRYPTO_SEAL", labelEn: "CRYPTO_SEAL", icon: Award },
    { href: "/dashboard", label: "TELEMETRY", labelEn: "TELEMETRY", icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#222222] bg-[#050505]/95 backdrop-blur-md font-mono text-xs text-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
        {/* Terminal Header Left: Root Node */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-6 w-6 rounded bg-[#FFFFFF] text-[#000000] flex items-center justify-center font-bold text-xs">
              &gt;_
            </div>
            <div className="flex items-center gap-1.5 font-black text-sm tracking-tight text-[#FFFFFF]">
              <span>BELAJARINAJA</span>
              <span className="text-[10px] text-[#888888] font-normal hidden sm:inline">
                // v1.0.4-LTS
              </span>
            </div>
          </Link>

          {/* Module telemetry status indicator */}
          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-[#222222] text-[#888888] text-[11px]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FFFFFF] animate-pulse" />
            <span>EXEC_SYNC: {progressPercent}% ({completedCount}/20)</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#171717] text-[#FFFFFF] border border-[#333333] font-bold"
                    : "text-[#888888] hover:text-[#FFFFFF] hover:bg-[#0D0D0D]"
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Tools & Switchers */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openSearch}
            className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#0A0A0A] border border-[#222222] text-[11px] text-[#888888] hover:text-[#FFFFFF] hover:border-[#444444] transition-colors"
          >
            <Search className="h-3 w-3" />
            <span className="hidden sm:inline">QUERY_TREE</span>
            <kbd className="text-[9px] bg-[#171717] px-1.5 py-0.5 rounded border border-[#333333] text-[#CCCCCC]">
              ⌘K
            </kbd>
          </button>

          <ThemeLanguageSwitcher />

          {isAuthenticated ? (
            <Link href="/dashboard">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0A0A0A] border border-[#222222] text-[11px] text-[#FFFFFF]">
                <User className="h-3 w-3" />
                <span className="truncate max-w-[70px]">{user?.name}</span>
              </div>
            </Link>
          ) : (
            <Button
              size="sm"
              onClick={openLoginModal}
              className="h-7 text-xs font-mono bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-black rounded px-3"
            >
              AUTH_SESSION
            </Button>
          )}

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-[#888888] hover:text-[#FFFFFF]"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 bg-[#0A0A0A] border-b border-[#222222] space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs ${
                  isActive ? "bg-[#171717] text-[#FFFFFF]" : "text-[#888888] hover:text-[#FFFFFF]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
