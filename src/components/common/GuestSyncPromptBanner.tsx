"use client";

import { useState } from "react";
import { ShieldCheck, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGuestProgressStore } from "@/store/useGuestProgressStore";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useModalStore } from "@/store/useModalStore";

export function GuestSyncPromptBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { completedLessons } = useGuestProgressStore();
  const { isAuthenticated } = useUserAuthStore();
  const { openLoginModal } = useModalStore();

  const completedCount = Object.keys(completedLessons).filter(
    (k) => completedLessons[k]?.completed
  ).length;

  if (isAuthenticated || completedCount === 0 || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-md p-4 rounded-xl border-2 border-black bg-[#FFD84D] text-[#121212] shadow-[6px_6px_0px_#121212] animate-in slide-in-from-bottom-5 dark:border-primary/40 dark:bg-[#121318]/95 dark:backdrop-blur-md dark:shadow-2xl dark:text-foreground">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-black bg-white text-[#121212] shadow-[1.5px_1.5px_0px_#121212] shrink-0 mt-0.5 dark:border-0 dark:bg-primary/20 dark:text-primary dark:shadow-none">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-[#121212] dark:text-foreground">
              Simpan {completedCount} Progress Belajar Anda?
            </h4>
            <p className="text-[11px] text-neutral-800 dark:text-muted-foreground mt-0.5 leading-relaxed font-medium dark:font-normal">
              Progress Anda saat ini hanya tersimpan di browser. Buat akun gratis agar progress tidak hilang.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-[#121212] hover:text-black p-1 dark:text-muted-foreground dark:hover:text-foreground"
          aria-label="Tutup Banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setDismissed(true)}
          className="h-7 text-[11px] px-2.5 font-bold border-2 border-black bg-white text-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#EAE4D5] dark:border-border dark:bg-transparent dark:text-foreground dark:shadow-none dark:font-normal"
        >
          Nanti Saja
        </Button>
        <Button
          size="sm"
          onClick={openLoginModal}
          className="h-7 text-[11px] gap-1.5 px-3 font-black border-2 border-black bg-[#121212] text-white shadow-[2px_2px_0px_#000000] hover:bg-neutral-800 dark:border-transparent dark:bg-primary dark:text-primary-foreground dark:shadow-none dark:font-medium"
        >
          Simpan Progress
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
