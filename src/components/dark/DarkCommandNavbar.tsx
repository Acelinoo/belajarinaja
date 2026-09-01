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
import {
  Terminal,
  Map,
  BookOpen,
  LayoutDashboard,
  Settings,
  Search,
  LogIn,
  User,
  Activity,
  Menu,
  X,
} from "lucide-react";

export function DarkCommandNavbar() {
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
  const percentage = Math.round((completedCount / 20) * 100);

  const navLinks = [
    { href: "/roadmap", label: "ROADMAP", icon: Map },
    { href: "/glossary", label: "GLOSSARY", icon: BookOpen },
    { href: "/dashboard", label: "TELEMETRY", icon: LayoutDashboard },
    { href: "/settings", label: "CONFIG", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#222222] bg-[#050505]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4 font-mono">
        {/* Brand Terminal Node */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded border border-[#333333] bg-[#111111] text-[#FFFFFF] text-xs font-black group-hover:border-[#FFFFFF] transition-colors">
              <Terminal className="h-3.5 w-3.5" />
            </div>
            <span className="font-black text-sm tracking-tight text-[#FFFFFF]">
              BELAJARINAJA<span className="text-[#888888] text-xs ml-1 font-normal">[v1.0]</span>
            </span>
          </Link>

          {/* Telemetry Status Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-[#222222] bg-[#0A0A0A] text-[10px] text-[#888888]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFFFFF] animate-pulse" />
            <span>SYS_ONLINE • {percentage}% SYNCED</span>
          </div>
        </div>

        {/* Monospace Navigation Items */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-wider rounded border transition-all ${
                    isActive
                      ? "border-[#FFFFFF] bg-[#171717] text-[#FFFFFF] font-black"
                      : "border-transparent text-[#888888] hover:text-[#FFFFFF] hover:bg-[#111111]"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{link.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Action Bar */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <button
            type="button"
            onClick={openSearch}
            className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded border border-[#222222] bg-[#0A0A0A] text-xs text-[#888888] hover:text-[#FFFFFF] hover:border-[#333333] transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="text-[11px] uppercase tracking-wider">COMMAND_SEARCH</span>
            <kbd className="text-[10px] bg-[#171717] px-1 py-0.2 rounded border border-[#333333] text-[#CCCCCC]">
              ⌘K
            </kbd>
          </button>

          {/* Theme & Language Switcher */}
          <ThemeLanguageSwitcher />

          {/* Authentication Terminal Button */}
          {isAuthenticated && user ? (
            <Link href="/dashboard">
              <div className="flex h-7 w-7 items-center justify-center rounded border border-[#333333] bg-[#111111] text-[#FFFFFF] font-bold text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button
                size="sm"
                className="rounded border border-[#333333] bg-[#111111] hover:bg-[#222222] text-[#FFFFFF] text-xs font-mono h-7 px-3 gap-1.5 shadow-none"
              >
                <LogIn className="h-3 w-3" />
                <span className="hidden sm:inline">AUTH_LOGIN</span>
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-7 w-7 items-center justify-center rounded border border-[#222222] bg-[#0A0A0A] text-[#FFFFFF]"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 border-t border-[#222222] bg-[#0A0A0A] space-y-2 font-mono">
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
                    className={`flex items-center gap-2 p-2 text-xs rounded border ${
                      isActive
                        ? "border-[#FFFFFF] bg-[#171717] text-[#FFFFFF]"
                        : "border-[#222222] text-[#888888]"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
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
