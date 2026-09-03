"use client";

import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faCalendarDays,
  faCheck,
  faArrowTrendUp,
} from "@fortawesome/free-solid-svg-icons";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { GuestLessonProgress } from "@/store/useGuestProgressStore";

interface ActivityHeatmapProps {
  completedLessons: Record<string, GuestLessonProgress>;
}

export function ActivityHeatmap({ completedLessons }: ActivityHeatmapProps) {
  const { language } = useThemeLanguageStore();

  // Aggregate completion dates
  const { dateCounts, currentStreak, longestStreak, totalActiveDays } = useMemo(() => {
    const counts: Record<string, number> = {};
    const dateList: string[] = [];

    Object.values(completedLessons).forEach((lesson) => {
      if (lesson.completed && lesson.completedAt) {
        // Normalize date to YYYY-MM-DD
        const d = new Date(lesson.completedAt);
        if (!isNaN(d.getTime())) {
          const dateStr = d.toISOString().split("T")[0];
          counts[dateStr] = (counts[dateStr] || 0) + 1;
          if (!dateList.includes(dateStr)) {
            dateList.push(dateStr);
          }
        }
      }
    });

    dateList.sort();

    // Calculate streak
    let current = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    const todayStr = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Check if studied today or yesterday for current streak
    if (counts[todayStr] || counts[yesterdayStr]) {
      let checkDate = counts[todayStr] ? new Date() : yesterday;
      while (true) {
        const str = checkDate.toISOString().split("T")[0];
        if (counts[str]) {
          current++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Longest streak calculation
    let prevTime: number | null = null;
    dateList.forEach((dStr) => {
      const t = new Date(dStr).getTime();
      if (prevTime === null) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((t - prevTime) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      prevTime = t;
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak;
      }
    });

    return {
      dateCounts: counts,
      currentStreak: current,
      longestStreak: Math.max(current, maxStreak),
      totalActiveDays: Object.keys(counts).length,
    };
  }, [completedLessons]);

  // Generate last 112 days (16 weeks x 7 days) for a clean, responsive heatmap
  const daysGrid = useMemo(() => {
    const days: { dateStr: string; dayOfWeek: number; count: number }[] = [];
    const today = new Date();

    // Start 111 days ago
    for (let i = 111; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      days.push({
        dateStr,
        dayOfWeek: d.getDay(),
        count: dateCounts[dateStr] || 0,
      });
    }

    return days;
  }, [dateCounts]);

  const getColorClass = (count: number) => {
    if (count === 0) return "bg-secondary/70 border-border/40";
    if (count === 1) return "bg-emerald-300 dark:bg-emerald-900/60 border-emerald-400/50";
    if (count === 2) return "bg-emerald-400 dark:bg-emerald-700 border-emerald-500/60";
    return "bg-emerald-500 dark:bg-emerald-500 border-emerald-600 text-white";
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-xs space-y-5">
      {/* Header Stat Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
            <FontAwesomeIcon icon={faFire} className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {language === "en" ? "Learning Activity & Streak" : "Aktivitas & Streak Belajar"}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {language === "en"
                ? "Consistency tracker over the last 16 weeks"
                : "Pelacak konsistensi belajar 16 minggu terakhir"}
            </p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/80 border border-border text-xs font-semibold">
            <FontAwesomeIcon icon={faFire} className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-foreground">{currentStreak}</span>
            <span className="text-muted-foreground font-normal text-[11px]">
              {language === "en" ? "day streak" : "hari beruntun"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/80 border border-border text-xs font-semibold">
            <FontAwesomeIcon icon={faArrowTrendUp} className="h-3.5 w-3.5 text-primary" />
            <span className="text-foreground">{longestStreak}</span>
            <span className="text-muted-foreground font-normal text-[11px]">
              {language === "en" ? "best streak" : "terpanjang"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/80 border border-border text-xs font-semibold">
            <FontAwesomeIcon icon={faCalendarDays} className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-foreground">{totalActiveDays}</span>
            <span className="text-muted-foreground font-normal text-[11px]">
              {language === "en" ? "active days" : "hari aktif"}
            </span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[620px]">
          <div className="grid grid-flow-col grid-rows-7 gap-1.5">
            {daysGrid.map((day) => (
              <div
                key={day.dateStr}
                title={`${day.dateStr}: ${day.count} ${
                  language === "en" ? "lessons completed" : "materi selesai"
                }`}
                className={`h-3.5 w-3.5 rounded-xs border transition-transform hover:scale-125 cursor-pointer ${getColorClass(
                  day.count
                )}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Legend */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2">
        <span>
          {language === "en"
            ? "Completed quizzes record verified daily activity"
            : "Kuis yang lulus tercatat sebagai aktivitas harian terverifikasi"}
        </span>

        <div className="flex items-center gap-1.5">
          <span>{language === "en" ? "Less" : "Jarang"}</span>
          <span className="h-2.5 w-2.5 rounded-xs border border-border bg-secondary/70" />
          <span className="h-2.5 w-2.5 rounded-xs border border-emerald-400/50 bg-emerald-300 dark:bg-emerald-900/60" />
          <span className="h-2.5 w-2.5 rounded-xs border border-emerald-500/60 bg-emerald-400 dark:bg-emerald-700" />
          <span className="h-2.5 w-2.5 rounded-xs border border-emerald-600 bg-emerald-500" />
          <span>{language === "en" ? "More" : "Sering"}</span>
        </div>
      </div>
    </div>
  );
}
