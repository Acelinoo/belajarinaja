"use client";

import { ShieldCheck, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { useModalStore } from "@/store/useModalStore";
import { useGuestProgressStore } from "@/store/useGuestProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";

export function AuthModal() {
  const { isLoginModalOpen, closeLoginModal } = useModalStore();
  const { completedLessons } = useGuestProgressStore();
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);

  const guestCount = Object.keys(completedLessons).length;

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={closeLoginModal}>
      <DialogContent className="max-w-md bg-card border border-border p-6 sm:p-8 rounded-2xl shadow-xl">
        <DialogHeader className="space-y-3 text-center items-center">
          <div className="relative group">
            <img
              src="/logo.png"
              alt="Logo BelajarinAja"
              className="w-16 h-16 rounded-2xl object-cover shadow-md ring-1 ring-border transition-transform group-hover:scale-105"
            />
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1 rounded-full shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
            </div>
          </div>

          <div className="space-y-1">
            <DialogTitle className="text-xl font-black tracking-tight text-foreground">
              Masuk ke Belajarin<span className="text-primary font-black">Aja</span>
            </DialogTitle>

            <DialogDescription className="text-xs font-medium text-muted-foreground max-w-xs mx-auto">
              Simpan sertifikat, pantau progres milestone belajar, dan sinkronkan aktivitas belajarmu.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Guest Progress Notice */}
        {guestCount > 0 && (
          <div className="rounded-xl border border-border bg-secondary/60 p-3 text-xs flex items-center gap-2.5 shadow-xs my-1">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <div>
              <span className="font-bold text-foreground block">
                {guestCount} {t.auth.guestFound}
              </span>
              <p className="text-muted-foreground text-[11px] mt-0.5">
                {guestCount} {t.auth.guestSyncDesc}
              </p>
            </div>
          </div>
        )}

        {/* Exclusive OAuth Buttons */}
        <div className="space-y-3 pt-2">
          <OAuthButtons
            onSuccess={closeLoginModal}
            redirectTo="/dashboard"
            showDivider={false}
          />

          <p className="text-[11px] text-center text-muted-foreground pt-1">
            Hanya butuh 1 klik. Tanpa ribet mengingat password.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
