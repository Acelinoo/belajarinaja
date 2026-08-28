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
    <div className="fixed bottom-4 right-4 z-40 max-w-md p-4 rounded-xl border border-primary/40 bg-[#121318]/95 backdrop-blur-md shadow-2xl animate-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/20 text-primary shrink-0 mt-0.5">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground">
              Simpan {completedCount} Progress Belajar Anda?
            </h4>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
              Progress Anda saat ini hanya tersimpan di browser. Buat akun gratis agar progress tidak hilang.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground p-1"
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
          className="h-7 text-[11px] px-2.5"
        >
          Nanti Saja
        </Button>
        <Button
          size="sm"
          onClick={openLoginModal}
          className="h-7 text-[11px] gap-1.5 px-3 font-medium"
        >
          Simpan Progress
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
