"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Trophy,
  Award,
  Play,
  HelpCircle,
  Eye,
  Star,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { CURRICULUM_STAGES } from "@/data/curriculum";
import { NovaCharacter } from "./characters/NovaCharacter";
import { ChapterIntroductionModal } from "./ChapterIntroductionModal";
import type { StageItem, LessonItem } from "@/data/curriculum";

// 5 Epic Story Realms
const STORY_REGIONS = [
  {
    id: "region-1",
    nameId: "Kepulauan Fondasi Web",
    nameEn: "The Web Archipelago",
    subtitleId: "Menemukan rahasia bagaimana internet & protokol web bekerja",
    subtitleEn: "Discovering how internet and web protocols connect the world",
    stageRange: [1, 2],
    bgColor: "from-[#5CC8FF]/20 to-[#45E0C0]/20",
    accentColor: "#5CC8FF",
    borderColor: "#5CC8FF",
    bannerIcon: "⛵",
  },
  {
    id: "region-2",
    nameId: "Lembah Semantik HTML",
    nameEn: "HTML Valley & Blueprints",
    subtitleId: "Merakit struktur dan kerangka website yang kokoh dan ramah SEO",
    subtitleEn: "Crafting solid semantic structure and accessible layout blueprints",
    stageRange: [3, 4],
    bgColor: "from-[#FFD84D]/25 to-[#FF9F43]/20",
    accentColor: "#FFD84D",
    borderColor: "#F59E0B",
    bannerIcon: "🏛️",
  },
  {
    id: "region-3",
    nameId: "Kota Estetika CSS",
    nameEn: "CSS City of Styles",
    subtitleId: "Menata visual, tata letak Flexbox & Grid, animasi, dan responsivitas",
    subtitleEn: "Styling aesthetics, Flexbox, Grid, fluid responsiveness, and animations",
    stageRange: [5, 8],
    bgColor: "from-[#FF9F43]/20 to-[#FF6B6B]/20",
    accentColor: "#FF9F43",
    borderColor: "#F97316",
    bannerIcon: "🎨",
  },
  {
    id: "region-4",
    nameId: "Hutan Logika JavaScript",
    nameEn: "JavaScript Forest of Logic",
    subtitleId: "Menghidupkan interaktivitas web dengan DOM, Events, dan Asynchronous logic",
    subtitleEn: "Powering interactive dynamics with DOM, Events, and Async workflows",
    stageRange: [9, 14],
    bgColor: "from-[#45E0C0]/20 to-[#5CC8FF]/25",
    accentColor: "#45E0C0",
    borderColor: "#10B981",
    bannerIcon: "⚡",
  },
  {
    id: "region-5",
    nameId: "Benteng Fullstack & React",
    nameEn: "Fullstack Citadel & Beyond",
    subtitleId: "Menguasai React, Next.js 15, PostgreSQL, Prisma ORM, dan Capstone Project",
    subtitleEn: "Mastering React, Next.js 15, PostgreSQL, Prisma ORM, and Production Capstone",
    stageRange: [15, 20],
    bgColor: "from-[#FFD84D]/30 to-[#5CC8FF]/30",
    accentColor: "#FFD84D",
    borderColor: "#F59E0B",
    bannerIcon: "🏰",
  },
];

export function FunRoadmapMap() {
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { completedLessons, isLessonUnlocked } = useCurriculumProgressStore();

  const [selectedStageForBriefing, setSelectedStageForBriefing] = useState<StageItem | null>(null);

  const completedCount = Object.values(completedLessons).filter(
    (item) => item?.completed
  ).length;
  const totalLessons = 20;
  const percentage = Math.round((completedCount / totalLessons) * 100);

  // Find active journey stage
  let activeStageIndex = 0;
  CURRICULUM_STAGES.forEach((stage, idx) => {
    const isStageDone = stage.lessons.every((l) => completedLessons[l.id]?.completed);
    if (isStageDone && idx < CURRICULUM_STAGES.length - 1) {
      activeStageIndex = idx + 1;
    }
  });

  return (
    <div className="space-y-10">
      {/* World Map Hero Header */}
      <div className="relative p-8 sm:p-12 rounded-[40px] border-4 border-[#FED7AA] bg-gradient-to-b from-[#FFF8E7] to-white shadow-[0_20px_50px_rgba(255,155,84,0.12)] overflow-hidden">
        {/* Scenery Vector Clouds */}
        <div className="absolute -top-6 -right-6 w-48 h-48 rounded-full bg-[#5CC8FF]/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-48 h-48 rounded-full bg-[#FFD84D]/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF8E7] border-2 border-[#FED7AA] shadow-[0_4px_12px_rgba(255,155,84,0.15)]">
              <Compass className="h-4 w-4 text-[#D97706]" />
              <span className="text-xs font-black text-[#D97706] uppercase tracking-wider">
                🗺️ PETA PETUALANGAN WEB DEVELOPER
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[#243447] tracking-tight">
              Jelajahi 5 Benua Koding Menuju Kelulusan
            </h1>

            <p className="text-xs sm:text-sm font-medium text-[#64748B] leading-relaxed">
              Taklukkan pulau demi pulau koding, kumpulkan bintang di setiap level, dan raih Piala Web Developer Utama bersama NOVA!
            </p>

            {/* Journey Progress Bar */}
            <div className="pt-2 max-w-md space-y-1.5">
              <div className="flex items-center justify-between text-xs font-black text-[#243447]">
                <span>Kemajuan Petualangan: {percentage}%</span>
                <span className="text-[#D97706]">{completedCount} / {totalLessons} Misi Selesai</span>
              </div>
              <div className="h-3.5 w-full bg-[#FFF8E7] rounded-full border-2 border-[#FED7AA] p-0.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FFD84D] to-[#FF9F43] rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* NOVA Welcome Dialogue Banner */}
          <div className="flex flex-col items-center p-6 rounded-[32px] border-2 border-[#FED7AA] bg-white shadow-[0_12px_30px_rgba(255,155,84,0.15)] text-center max-w-xs">
            <NovaCharacter
              state={percentage === 100 ? "celebrating" : percentage > 50 ? "excited" : "curious"}
              className="w-20 h-20 mb-2"
              speechText={
                percentage === 100
                  ? "Luar biasa! Kamu sudah menyelesaikan seluruh peta!"
                  : "Ayo taklukkan pulau berikutnya, Explorer!"
              }
            />
            <span className="text-xs font-black text-[#243447]">Pemandu Petualangan NOVA</span>
            <span className="text-[10px] text-[#64748B]">Siap membantumu di setiap tantangan</span>
          </div>
        </div>
      </div>

      {/* 5 World Regions Container */}
      <div className="space-y-12">
        {STORY_REGIONS.map((region, rIdx) => {
          const regionStages = CURRICULUM_STAGES.filter(
            (s) => s.orderIndex >= region.stageRange[0] && s.orderIndex <= region.stageRange[1]
          );

          return (
            <section
              key={region.id}
              className="relative p-6 sm:p-10 rounded-[36px] border-3 border-[#FED7AA] bg-white shadow-[0_15px_40px_rgba(255,155,84,0.08)] space-y-6"
            >
              {/* Region Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[#FED7AA]/60">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{region.bannerIcon}</span>
                    <span className="text-[11px] font-black text-[#D97706] uppercase tracking-widest">
                      BENUA {rIdx + 1}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#243447]">
                    {language === "en" ? region.nameEn : region.nameId}
                  </h2>
                  <p className="text-xs text-[#64748B] font-medium">
                    {language === "en" ? region.subtitleEn : region.subtitleId}
                  </p>
                </div>
              </div>

              {/* Region Stage Islands Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {regionStages.map((stage) => {
                  const stageLessons = stage.lessons;
                  const completedInStage = stageLessons.filter(
                    (l) => completedLessons[l.id]?.completed
                  ).length;
                  const isStageComplete = completedInStage === stageLessons.length && stageLessons.length > 0;
                  const isStageAccessible = stageLessons.some((l) => isLessonUnlocked(l.id));
                  const firstLesson = stageLessons[0];

                  const stageTitle = language === "en" && stage.titleEn ? stage.titleEn : stage.titleId;
                  const stageDesc = language === "en" && stage.descriptionEn ? stage.descriptionEn : stage.description;

                  return (
                    <div
                      key={stage.id}
                      className={`p-6 rounded-[28px] border-2 transition-all duration-300 flex flex-col justify-between space-y-4 ${
                        isStageComplete
                          ? "border-[#45E0C0] bg-[#F0FDF4] shadow-[0_8px_25px_rgba(69,224,192,0.15)]"
                          : isStageAccessible
                          ? "border-[#FED7AA] bg-[#FFF8E7] shadow-[0_8px_25px_rgba(255,155,84,0.1)] hover:-translate-y-1"
                          : "border-[#E2E8F0] bg-[#F8FAFC] opacity-75"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                            isStageComplete
                              ? "bg-[#45E0C0] text-[#17202A] border-[#45E0C0]"
                              : isStageAccessible
                              ? "bg-[#FFD84D] text-[#243447] border-[#FED7AA]"
                              : "bg-[#E2E8F0] text-[#94A3B8] border-[#CBD5E1]"
                          }`}>
                            Tahap {stage.orderIndex}
                          </span>

                          <div className="flex items-center gap-1 text-xs font-black">
                            {isStageComplete ? (
                              <span className="text-[#059669] flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Lulus</span>
                              </span>
                            ) : isStageAccessible ? (
                              <span className="text-[#D97706] flex items-center gap-1">
                                <Star className="h-4 w-4 fill-[#FFD84D] text-[#FFD84D]" />
                                <span>{completedInStage}/{stageLessons.length}</span>
                              </span>
                            ) : (
                              <span className="text-[#94A3B8] flex items-center gap-1">
                                <Lock className="h-3.5 w-3.5" />
                                <span>Terkunci</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="text-base font-black text-[#243447] leading-snug">
                          {stageTitle}
                        </h3>

                        <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed font-medium">
                          {stageDesc}
                        </p>
                      </div>

                      {/* Island Actions */}
                      <div className="pt-2 flex items-center gap-2">
                        {isStageAccessible ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => setSelectedStageForBriefing(stage)}
                              className="rounded-full bg-[#FFF8E7] hover:bg-[#FFE8B8] text-[#D97706] border border-[#FED7AA] font-black text-xs h-9 px-4 gap-1.5 flex-1"
                            >
                              <BookOpen className="h-3.5 w-3.5" />
                              <span>Story Briefing</span>
                            </Button>

                            {firstLesson && (
                              <Link href={`/lessons/${firstLesson.slug}`} className="flex-1">
                                <Button
                                  size="sm"
                                  className="w-full rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] font-black text-xs h-9 px-4 shadow-[0_3px_10px_rgba(255,216,77,0.35)] gap-1"
                                >
                                  <span>{isStageComplete ? "Ulangi" : "Mulai Misi"}</span>
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                            )}
                          </>
                        ) : (
                          <div className="w-full text-center py-1.5 text-xs font-bold text-[#94A3B8] bg-white rounded-full border border-[#E2E8F0]">
                            Selesaikan tahap sebelumnya untuk membuka
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Chapter Story Introduction Briefing Modal */}
      {selectedStageForBriefing && (
        <ChapterIntroductionModal
          stage={selectedStageForBriefing}
          isOpen={!!selectedStageForBriefing}
          onClose={() => setSelectedStageForBriefing(null)}
        />
      )}
    </div>
  );
}
