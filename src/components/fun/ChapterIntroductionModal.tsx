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
import { ArrowRight, BookOpen, Clock, Target } from "lucide-react";
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
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);

  const stageTitle = language === "en" && stage.titleEn ? stage.titleEn : stage.titleId;
  const stageDesc = language === "en" && stage.descriptionEn ? stage.descriptionEn : stage.description;
  const firstLesson = stage.lessons[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-secondary/50 border-b border-border text-center space-y-3">
          {theme === "fun" ? (
            <NovaCharacter state="excited" className="w-16 h-16 mx-auto" />
          ) : (
            <div className="h-10 w-10 rounded-xl bg-card border border-border text-primary flex items-center justify-center font-bold mx-auto">
              <BookOpen className="h-5 w-5" />
            </div>
          )}

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
              IKHTISAR TAHAP {stage.orderIndex}
            </span>
            <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              {stageTitle}
            </DialogTitle>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
            {stageDesc}
          </p>
        </div>

        {/* Lessons List in Stage */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block">
              Materi yang Akan Dipelajari:
            </span>

            <div className="space-y-2">
              {stage.lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border text-xs text-foreground"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded bg-secondary text-primary font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold">{language === "en" && lesson.titleEn ? lesson.titleEn : lesson.title}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {lesson.estimatedMinutes} Menit
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="pt-2 flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-xs font-semibold rounded-md h-10 px-4"
            >
              Tutup
            </Button>

            {firstLesson && (
              <Link href={`/lessons/${firstLesson.slug}`} className="flex-1" onClick={onClose}>
                <Button className="w-full text-xs font-bold rounded-md h-10 gap-1.5">
                  <span>Mulai Belajar</span>
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
