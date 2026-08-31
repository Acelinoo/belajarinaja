"use client";

import { useState } from "react";
import { ShieldCheck, ArrowRight, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGuestProgressStore } from "@/store/useGuestProgressStore";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";

export function GuestSyncPromptBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { completedLessons } = useGuestProgressStore();
  const { isAuthenticated } = useUserAuthStore();
  const { openLoginModal } = useModalStore();
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);

  const completedCount = Object.keys(completedLessons).filter(
    (k) => completedLessons[k]?.completed
  ).length;

  if (isAuthenticated || completedCount === 0 || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-md p-4 rounded-xl border-2 border-black bg-[#FFD84D] text-[#121212] shadow-[6px_6px_0px_#121212] animate-in slide-in-from-bottom-5 dark:border dark:border-cyan-500/30 dark:bg-[#090D12]/95 dark:backdrop-blur-md dark:shadow-[0_10px_35px_rgba(0,0,0,0.8)] dark:text-[#F1F5F9] fun:border-2 fun:border-[#FED7AA] fun:bg-[#FFF8E7] fun:rounded-2xl fun:shadow-[0_10px_30px_rgba(255,155,84,0.2)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-black bg-white text-[#121212] shadow-[1.5px_1.5px_0px_#121212] shrink-0 mt-0.5 dark:border dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none fun:rounded-full fun:border-[#FED7AA] fun:bg-[#FFD84D]">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-[#121212] dark:text-[#F1F5F9] fun:text-[#243447]">
              {t.auth.guestFound} ({completedCount} {t.roadmap.lessonsCount})
            </h4>
            <p className="text-[11px] text-neutral-800 dark:text-[#8292A6] fun:text-[#64748B] mt-0.5 leading-relaxed font-medium dark:font-normal">
              {completedCount} {t.auth.guestSyncDesc}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-[#121212] hover:text-black p-1 dark:text-[#94A3B8] dark:hover:text-cyan-300"
          aria-label={t.common.close}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setDismissed(true)}
          className="h-7 text-[11px] px-2.5 font-bold border-2 border-black bg-white text-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#EAE4D5] dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#94A3B8] dark:hover:text-cyan-300 dark:hover:bg-[#151B22] dark:shadow-none dark:font-medium fun:rounded-full fun:border-[#E2E8F0] fun:bg-white"
        >
          {t.common.cancel}
        </Button>
        <Button
          size="sm"
          onClick={openLoginModal}
          className="h-7 text-[11px] gap-1.5 px-3 font-black border-2 border-black bg-[#121212] text-white shadow-[2px_2px_0px_#000000] hover:bg-neutral-800 dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-400 dark:hover:text-[#05070A] dark:shadow-none dark:font-semibold fun:rounded-full fun:border-0 fun:bg-[#5CC8FF] fun:text-[#243447] fun:shadow-none"
        >
          {t.auth.submitRegister}
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

