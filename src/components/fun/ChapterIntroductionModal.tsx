"use client";

import React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NovaCharacter } from "./characters/NovaCharacter";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { Sparkles, ArrowRight, CheckCircle2, BookOpen, Clock, Target, Star } from "lucide-react";
import type { StageItem } from "@/data/curriculum";

interface ChapterIntroductionModalProps {
  stage: StageItem;
  isOpen: boolean;
  onClose: () => void;
}

export function ChapterIntroductionModal({
  stage,
  isOpen,
  onClose,
}: ChapterIntroductionModalProps) {
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);

  const stageTitle = language === "en" && stage.titleEn ? stage.titleEn : stage.titleId;
  const stageDesc = language === "en" && stage.descriptionEn ? stage.descriptionEn : stage.description;
  const firstLesson = stage.lessons[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-[36px] border-3 border-[#FED7AA] bg-white shadow-[0_25px_60px_rgba(255,155,84,0.2)]">
        {/* Story Banner Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-b from-[#FFF8E7] to-white border-b-2 border-[#FED7AA]/60 text-center space-y-3">
          <NovaCharacter state="excited" className="w-24 h-24 mx-auto" />

          <div className="space-y-1">
            <span className="text-[10px] font-black text-[#D97706] bg-white px-3 py-1 rounded-full border border-[#FED7AA] inline-block shadow-sm">
              🌟 MISI TAHAP {stage.orderIndex}
            </span>
            <DialogTitle className="text-xl sm:text-2xl font-black text-[#243447] tracking-tight">
              {stageTitle}
            </DialogTitle>
          </div>

          <p className="text-xs text-[#64748B] leading-relaxed max-w-md mx-auto font-medium">
            {stageDesc}
          </p>
        </div>

        {/* Quest Discovery Objectives */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <span className="text-[11px] font-black text-[#243447] flex items-center gap-1.5 uppercase tracking-wider">
              <Target className="h-4 w-4 text-[#FF9F43]" />
              <span>Target Petualangan yang Akan Dikuasai:</span>
            </span>

            <div className="space-y-2">
              {stage.lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF8E7] border border-[#FED7AA] text-xs font-bold text-[#243447]"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-[#FFD84D] flex items-center justify-center text-[10px] font-black shrink-0">
                      {idx + 1}
                    </span>
                    <span>{language === "en" && lesson.titleEn ? lesson.titleEn : lesson.title}</span>
                  </div>
                  <span className="text-[10px] text-[#D97706] font-black">
                    +{lesson.estimatedMinutes} Menit
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reward & Action */}
          <div className="pt-2 flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-full border-[#FED7AA] text-[#64748B] hover:text-[#243447] font-black text-xs h-11 px-5"
            >
              Nanti Saja
            </Button>

            {firstLesson && (
              <Link href={`/lessons/${firstLesson.slug}`} className="flex-1" onClick={onClose}>
                <Button className="w-full rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] font-black text-xs h-11 shadow-[0_4px_16px_rgba(255,216,77,0.4)] gap-2">
                  <Sparkles className="h-4 w-4 text-[#D97706]" />
                  <span>Mulai Petualangan Sekarang!</span>
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
