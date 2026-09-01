"use client";

import React from "react";
import Link from "next/link";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getTranslations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import {
  Terminal,
  Map,
  Activity,
  Bookmark,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Shield,
  Layers,
} from "lucide-react";
import type { Lesson, Stage } from "@/types/curriculum";

interface DarkTelemetryDashboardProps {
  totalLessons: number;
  completedCount: number;
  percentage: number;
  allLessons: Array<Lesson & { stageOrder: number; stageTitle: string; category?: string }>;
  categories: string[];
  resumeLesson: (Lesson & { stageOrder: number; stageTitle: string }) | null;
}

export function DarkTelemetryDashboard({
  totalLessons,
  completedCount,
  percentage,
  allLessons,
  categories,
  resumeLesson,
}: DarkTelemetryDashboardProps) {
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);
  const { user } = useAuthStore();
  const { bookmarkedLessons, toggleBookmark } = useCurriculumProgressStore();

  const bookmarkedItems = allLessons.filter((l) => bookmarkedLessons.includes(l.id));

  return (
    <div className="space-y-6 font-mono">
      {/* Telemetry Station Header */}
      <div className="p-6 rounded border border-[#222222] bg-[#0A0A0A] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1A1A1A]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#888888]">
              <Activity className="h-3.5 w-3.5 text-[#FFFFFF]" />
              <span className="font-bold text-[#FFFFFF]">TELEMETRY_LOG // USER_NODE</span>
              <span>•</span>
              <span>STATION_ID: {user?.id?.slice(0, 8) || "GUEST_SESSION"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#FFFFFF]">
              {user?.name || "STUDENT_TERMINAL"} // TELEMETRY
            </h1>
            <p className="text-xs text-[#666666]">
              {user?.email || "LOCAL_STORAGE_MODE • DATA_SYNC_STANDBY"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/roadmap">
              <Button size="sm" className="h-8 text-xs font-mono bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-bold px-4 gap-1.5 shadow-none">
                <Map className="h-3.5 w-3.5" />
                <span>OPEN_ROADMAP</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Monochrome KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded border border-[#222222] bg-[#050505] space-y-1">
            <span className="text-[10px] text-[#666666] uppercase block">TOTAL_PROGRESS</span>
            <div className="text-2xl font-black text-[#FFFFFF]">{percentage}%</div>
            <div className="text-[10px] text-[#888888]">{completedCount} of {totalLessons} modules verified</div>
          </div>

          <div className="p-4 rounded border border-[#222222] bg-[#050505] space-y-1">
            <span className="text-[10px] text-[#666666] uppercase block">COMPLETED_MODULES</span>
            <div className="text-2xl font-black text-[#FFFFFF]">{completedCount}</div>
            <div className="text-[10px] text-[#888888]">{totalLessons - completedCount} modules pending</div>
          </div>

          <div className="p-4 rounded border border-[#222222] bg-[#050505] space-y-1">
            <span className="text-[10px] text-[#666666] uppercase block">BOOKMARKS_CACHED</span>
            <div className="text-2xl font-black text-[#FFFFFF]">{bookmarkedLessons.length}</div>
            <div className="text-[10px] text-[#888888]">Saved for quick reference</div>
          </div>

          <div className="p-4 rounded border border-[#222222] bg-[#050505] space-y-1">
            <span className="text-[10px] text-[#666666] uppercase block">CERTIFICATE_HASH</span>
            <div className="text-2xl font-black text-[#FFFFFF]">{percentage >= 100 ? "VERIFIED" : "LOCKED"}</div>
            <div className="text-[10px] text-[#888888]">{percentage >= 100 ? "Ready to issue" : "Requires 100% completion"}</div>
          </div>
        </div>
      </div>

      {/* Resume Execution Prompt */}
      {resumeLesson && (
        <div className="p-5 rounded border border-[#333333] bg-[#0A0A0A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-[#888888]">
              <span className="text-[#FFFFFF] font-bold">[ACTIVE_EXECUTION_TARGET]</span>
              <span>•</span>
              <span>STAGE_{resumeLesson.stageOrder}</span>
            </div>
            <h3 className="text-sm font-black text-[#FFFFFF]">
              {language === "en" && resumeLesson.titleEn ? resumeLesson.titleEn : resumeLesson.title}
            </h3>
            <p className="text-xs text-[#888888] max-w-xl truncate">
              {language === "en" && resumeLesson.descriptionEn ? resumeLesson.descriptionEn : resumeLesson.description}
            </p>
          </div>

          <Link href={`/lessons/${resumeLesson.slug}`} className="shrink-0">
            <Button size="sm" className="h-8 text-xs font-mono bg-[#171717] hover:bg-[#222222] text-[#FFFFFF] border border-[#333333] gap-1">
              <span>RESUME_MODULE</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      )}

      {/* Bookmarked Lessons Stream */}
      <div className="p-6 rounded border border-[#222222] bg-[#0A0A0A] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A] text-xs text-[#888888]">
          <span>BOOKMARKED_MODULES_STREAM ({bookmarkedItems.length})</span>
        </div>

        {bookmarkedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {bookmarkedItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded border border-[#222222] bg-[#050505] space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-[#666666] mb-1">
                    <span>{item.id}</span>
                    <span>{item.estimatedMinutes} MIN</span>
                  </div>
                  <h4 className="text-xs font-black text-[#FFFFFF]">
                    {language === "en" && item.titleEn ? item.titleEn : item.title}
                  </h4>
                  <p className="text-[11px] text-[#888888] line-clamp-2 mt-1">
                    {language === "en" && item.descriptionEn ? item.descriptionEn : item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1A1A1A] flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(item.id)}
                    className="text-[11px] text-[#888888] hover:text-[#FFFFFF] flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>UNPIN</span>
                  </button>
                  <Link href={`/lessons/${item.slug}`}>
                    <Button size="sm" className="h-6 text-[10px] bg-[#171717] hover:bg-[#222222] text-[#FFFFFF] border border-[#333333] font-mono">
                      OPEN
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded border border-[#1A1A1A] bg-[#050505] text-center space-y-1 text-xs text-[#666666]">
            <div>NO_BOOKMARKS_STORED</div>
            <p>Save key modules for quick telemetry access.</p>
          </div>
        )}
      </div>
    </div>
  );
}
