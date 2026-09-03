"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faPalette,
  faBolt,
  faBullseye,
  faGraduationCap,
  faCode,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { GuestLessonProgress } from "@/store/useGuestProgressStore";
import { CURRICULUM_STAGES } from "@/data/curriculum";

interface AchievementBadgesProps {
  completedLessons: Record<string, GuestLessonProgress>;
}

export function AchievementBadges({ completedLessons }: AchievementBadgesProps) {
  const { language } = useThemeLanguageStore();

  const completedList = Object.values(completedLessons).filter(
    (l) => l.completed && l.passed !== false
  );
  const totalCompleted = completedList.length;

  const hasScore100 = completedList.some(
    (l) => (l.score && l.score >= 100) || (l.quizScore && l.quizScore >= 100)
  );

  // Check stage completions
  const isStageCompleted = (stageId: string) => {
    const stage = CURRICULUM_STAGES.find((s) => s.id === stageId);
    if (!stage) return false;
    return stage.lessons.every(
      (lesson) => !!completedLessons[lesson.id]?.completed
    );
  };

  const achievements = [
    {
      id: "first_step",
      icon: faGraduationCap,
      title: language === "en" ? "First Step" : "Langkah Awal",
      desc:
        language === "en"
          ? "Completed your first coding lesson"
          : "Menyelesaikan materi koding pertama",
      unlocked: totalCompleted >= 1,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      id: "html_architect",
      icon: faCode,
      title: language === "en" ? "HTML Architect" : "Arsitek HTML",
      desc:
        language === "en"
          ? "Mastered Stage 2: HTML5 Semantics"
          : "Menguasai Tahap 2: HTML5 Semantik",
      unlocked: isStageCompleted("stage-2"),
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      id: "css_artisan",
      icon: faPalette,
      title: language === "en" ? "CSS Artisan" : "Pakar CSS",
      desc:
        language === "en"
          ? "Mastered Modern CSS & Flexbox Layouts"
          : "Menguasai Modern CSS & Flexbox",
      unlocked: isStageCompleted("stage-3") && isStageCompleted("stage-4"),
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      id: "js_engine",
      icon: faBolt,
      title: language === "en" ? "JavaScript Engine" : "Mesin JavaScript",
      desc:
        language === "en"
          ? "Mastered JS Runtime & Logic Control"
          : "Menguasai JavaScript Runtime & Logika",
      unlocked: isStageCompleted("stage-7") && isStageCompleted("stage-8"),
      color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    },
    {
      id: "precision_master",
      icon: faBullseye,
      title: language === "en" ? "Perfect Precision" : "Presisi Sempurna",
      desc:
        language === "en"
          ? "Achieved a 100% score on a knowledge quiz"
          : "Mencapai skor kuis evaluasi sempurna 100%",
      unlocked: hasScore100,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "curriculum_master",
      icon: faAward,
      title: language === "en" ? "Fullstack Graduate" : "Lulusan Fullstack",
      desc:
        language === "en"
          ? "Completed all 20 stages of the curriculum"
          : "Menyelesaikan seluruh 20 tahap kurikulum",
      unlocked: totalCompleted >= 116,
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="p-4 sm:p-6 rounded-2xl border border-border bg-card shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/70">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20 shrink-0">
            <FontAwesomeIcon icon={faAward} className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {language === "en" ? "Curriculum Achievements" : "Lencana Prestasi Kurikulum"}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {language === "en"
                ? `${unlockedCount} of ${achievements.length} achievements unlocked`
                : `${unlockedCount} dari ${achievements.length} lencana terbuka`}
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-foreground">
          {Math.round((unlockedCount / achievements.length) * 100)}%
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
        {achievements.map((item) => (
          <div
            key={item.id}
            className={`p-3 sm:p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
              item.unlocked
                ? "bg-secondary/40 border-border/80"
                : "bg-secondary/15 border-dashed border-border/40 opacity-60"
            }`}
          >
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${
                item.unlocked ? item.color : "bg-muted text-muted-foreground border-border"
              }`}
            >
              <FontAwesomeIcon
                icon={item.unlocked ? item.icon : faLock}
                className="h-4 w-4"
              />
            </div>

            <div className="space-y-0.5">
              <span className="text-xs font-bold text-foreground block">
                {item.title}
              </span>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
