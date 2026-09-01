"use client";

import React from "react";
import Link from "next/link";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getTranslations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Map,
  Star,
  CheckCircle2,
  Bookmark,
  Trophy,
  Compass,
  ArrowRight,
  Sparkles,
  Award,
} from "lucide-react";
import type { Lesson, Stage } from "@/types/curriculum";

interface FunDashboardHeadquartersProps {
  totalLessons: number;
  completedCount: number;
  percentage: number;
  allLessons: Array<Lesson & { stageOrder: number; stageTitle: string; category?: string }>;
  categories: string[];
  resumeLesson: (Lesson & { stageOrder: number; stageTitle: string }) | null;
}

export function FunDashboardHeadquarters({
  totalLessons,
  completedCount,
  percentage,
  allLessons,
  categories,
  resumeLesson,
}: FunDashboardHeadquartersProps) {
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { user } = useAuthStore();
  const { bookmarkedLessons, toggleBookmark } = useCurriculumProgressStore();

  const totalXP = completedCount * 30;
  const bookmarkedItems = allLessons.filter((l) => bookmarkedLessons.includes(l.id));

  return (
    <div className="space-y-8">
      {/* Explorer Chronicle Hero */}
      <div className="p-8 rounded-[36px] border-4 border-[#FED7AA] bg-white shadow-[0_20px_50px_rgba(255,155,84,0.12)] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <NovaCharacter
            state={percentage === 100 ? "celebrating" : "excited"}
            className="w-24 h-24 shrink-0"
            speechText={language === "en" ? "Welcome back, Explorer!" : "Markas koding siap!"}
          />
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-black text-[#D97706] bg-[#FFF8E7] px-3.5 py-1 rounded-full border border-[#FED7AA]">
                Tingkat Petualang: Level {Math.floor(completedCount / 3) + 1}
              </span>
              <span className="text-[11px] font-black text-[#0284C7] bg-[#F0F9FF] px-3 py-0.5 rounded-full border border-[#BAE6FD]">
                ⭐ {totalXP} XP
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#243447] tracking-tight">
              {t.dashboard.welcome} {user?.name || "Explorer"}!
            </h1>
            <p className="text-xs text-[#64748B] font-medium">
              {user?.email || "Akun Penjelajah Lokal • Progress tersimpan otomatis di browser ini"}
            </p>
          </div>
        </div>

        <Link href="/roadmap">
          <Button size="lg" className="rounded-full font-black text-xs px-8 bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] shadow-[0_4px_16px_rgba(255,216,77,0.4)] gap-2">
            <Compass className="h-4 w-4" />
            <span>Lanjutkan Petualangan</span>
          </Button>
        </Link>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-[28px] border-2 border-[#FED7AA] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-[#D97706]">
            <span>Misi Ditaklukkan</span>
            <CheckCircle2 className="h-4 w-4 text-[#059669]" />
          </div>
          <div className="text-3xl font-black text-[#243447]">{completedCount} / {totalLessons}</div>
          <p className="text-[11px] text-[#64748B]">Tahap kurikulum yang telah terselesaikan</p>
        </div>

        <div className="p-6 rounded-[28px] border-2 border-[#FED7AA] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-[#D97706]">
            <span>Total XP Diperoleh</span>
            <Star className="h-4 w-4 fill-[#FFD84D] text-[#FFD84D]" />
          </div>
          <div className="text-3xl font-black text-[#243447]">{totalXP} XP</div>
          <p className="text-[11px] text-[#64748B]">+30 XP per misi kelulusan koding</p>
        </div>

        <div className="p-6 rounded-[28px] border-2 border-[#FED7AA] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-[#D97706]">
            <span>Sertifikat Kelulusan</span>
            <Award className="h-4 w-4 text-[#FF9F43]" />
          </div>
          <div className="text-3xl font-black text-[#243447]">{percentage}%</div>
          <p className="text-[11px] text-[#64748B]">Selesaikan 100% untuk mengklaim piala</p>
        </div>
      </div>

      {/* Bookmarked Quests */}
      {bookmarkedItems.length > 0 && (
        <div className="p-6 rounded-[32px] border-2 border-[#FED7AA] bg-white space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h3 className="text-base font-black text-[#243447] flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-[#D97706]" />
            <span>Misi Tersimpan ({bookmarkedItems.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bookmarkedItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#FFF8E7] border border-[#FED7AA] flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-[#243447]">{item.title}</h4>
                  <span className="text-[10px] text-[#64748B]">Tahap {item.stageOrder}: {item.stageTitle}</span>
                </div>
                <Link href={`/lessons/${item.slug}`}>
                  <Button size="sm" className="rounded-full bg-[#FFD84D] text-[#243447] font-black text-xs h-8 px-3">
                    Buka
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
