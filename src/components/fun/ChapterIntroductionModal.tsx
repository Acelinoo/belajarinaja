"use client";

import React from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BotCompanionCharacter } from "@/components/fun/characters/BotCompanionCharacter";
import { RoadmapExplorerCharacter } from "@/components/fun/characters/RoadmapExplorerCharacter";
import { RocketAdventureIllustration } from "@/components/fun/illustrations/RocketAdventureIllustration";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { Map, Clock, Star, Sparkles, ArrowRight, CheckCircle2, X } from "lucide-react";
import type { Stage } from "@/types/curriculum";

interface ChapterIntroductionModalProps {
  stage: Stage | null;
  isOpen: boolean;
  onClose: () => void;
  completedLessonsCount: number;
}

export function ChapterIntroductionModal({
  stage,
  isOpen,
  onClose,
  completedLessonsCount,
}: ChapterIntroductionModalProps) {
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);

  if (!stage) return null;

  const stageTitle = language === "en" && stage.titleEn ? stage.titleEn : stage.titleId;
  const stageDesc = language === "en" && stage.descriptionEn ? stage.descriptionEn : stage.description;
  const totalLessonsInStage = stage.lessons.length;
  const firstLessonSlug = stage.lessons[0]?.slug;

  const totalMinutes = stage.lessons.reduce((acc, l) => acc + l.estimatedMinutes, 0);
  const totalXP = totalLessonsInStage * 30;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-[#FFF8E7] border-4 border-[#FED7AA] rounded-[32px] shadow-[0_25px_60px_rgba(255,155,84,0.25)] text-[#243447]">
        {/* Visually hidden Accessible Title */}
        <DialogTitle className="sr-only">
          {stageTitle} - {t.common.stage}
        </DialogTitle>

        {/* Top Decorative Banner */}
        <div className="relative bg-gradient-to-b from-[#FFF0D4] to-[#FFF8E7] p-6 pb-4 border-b-2 border-[#FED7AA]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD84D] text-2xl shadow-[0_4px_12px_rgba(255,216,77,0.4)] border border-[#FED7AA]">
              🚀
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#EBF8FF] text-[#0284C7] border border-[#5CC8FF]/40 text-[10px] font-black rounded-full uppercase">
                  {t.common.stage} {String(stage.orderIndex).padStart(2, "0")} • {stage.category}
                </Badge>
                <span className="text-[11px] font-bold text-[#D97706] flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-[#FFD84D] text-[#FFD84D]" />
                  +{totalXP} XP
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#243447] mt-0.5">
                {stageTitle}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/80 border border-[#FED7AA] flex items-center justify-center text-[#64748B] hover:text-[#243447] hover:bg-white transition-all shadow-sm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* World Story & Companion Greeting */}
          <div className="p-5 rounded-3xl bg-white border-2 border-[#FED7AA] shadow-[0_4px_20px_rgba(255,155,84,0.08)] flex flex-col sm:flex-row items-center gap-5">
            <BotCompanionCharacter
              className="w-24 h-24 shrink-0"
              expression="excited"
              speechBubbleText={language === "en" ? "Ready for adventure!" : "Siap berpetualang!"}
            />
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-black text-[#D97706] uppercase tracking-wider block">
                {language === "en" ? "✨ CHAPTER ADVENTURE BRIEFING" : "✨ PANDUAN MISI BAB INI"}
              </span>
              <p className="text-xs sm:text-sm font-medium text-[#475569] leading-relaxed">
                {stageDesc}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-white border-2 border-[#FED7AA]/60 space-y-1">
              <span className="text-[10px] font-bold text-[#64748B] uppercase block">
                {language === "en" ? "Quests" : "Jumlah Misi"}
              </span>
              <span className="text-base font-black text-[#243447] flex items-center justify-center gap-1">
                <Map className="h-3.5 w-3.5 text-[#5CC8FF]" />
                {totalLessonsInStage} {t.roadmap.lessonsCount}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white border-2 border-[#FED7AA]/60 space-y-1">
              <span className="text-[10px] font-bold text-[#64748B] uppercase block">
                {language === "en" ? "Est. Journey" : "Estimasi Waktu"}
              </span>
              <span className="text-base font-black text-[#243447] flex items-center justify-center gap-1">
                <Clock className="h-3.5 w-3.5 text-[#FF9F43]" />
                {totalMinutes} {t.common.minutes}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white border-2 border-[#FED7AA]/60 space-y-1">
              <span className="text-[10px] font-bold text-[#64748B] uppercase block">
                {language === "en" ? "Total Reward" : "Total Hadiah"}
              </span>
              <span className="text-base font-black text-[#16A34A] flex items-center justify-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-[#5EDC81]" />
                +{totalXP} XP
              </span>
            </div>
          </div>

          {/* What You Will Discover (Lessons preview checklist) */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#243447] uppercase tracking-wider flex items-center gap-1.5">
              <span>🎯</span>
              <span>{language === "en" ? "What You Will Discover:" : "Misi Pembelajaran yang Akan Ditempuh:"}</span>
            </h4>

            <div className="grid grid-cols-1 gap-2">
              {stage.lessons.map((lesson, idx) => {
                const title = language === "en" && lesson.titleEn ? lesson.titleEn : lesson.title;
                return (
                  <div
                    key={lesson.id}
                    className="p-3 rounded-2xl bg-white border border-[#FED7AA] flex items-center justify-between hover:border-[#5CC8FF] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF8E7] border border-[#FED7AA] text-xs font-black text-[#D97706]">
                        {idx + 1}
                      </div>
                      <span className="text-xs font-bold text-[#243447]">{title}</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#64748B]">
                      {lesson.estimatedMinutes} {t.common.minutes}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action CTA Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-[#FED7AA]/60">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto rounded-full border-[#FED7AA] text-xs font-bold bg-white text-[#243447]"
            >
              {t.common.close}
            </Button>

            {firstLessonSlug && (
              <Link href={`/lessons/${firstLessonSlug}`} className="w-full sm:w-auto">
                <Button
                  onClick={onClose}
                  className="w-full sm:w-auto rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] font-black text-xs px-8 shadow-[0_4px_16px_rgba(255,216,77,0.45)] gap-2"
                >
                  <span>{language === "en" ? "START ADVENTURE" : "MULAI PETUALANGAN"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
