"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { useModalStore } from "@/store/useModalStore";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useGuestProgressStore } from "@/store/useGuestProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";

export function AuthModal() {
  const router = useRouter();
  const { isLoginModalOpen, closeLoginModal } = useModalStore();
  const { setUser } = useUserAuthStore();
  const { completedLessons } = useGuestProgressStore();
  const { language } = useThemeLanguageStore();
  const t = getTranslations(language);

  const [isRegister, setIsRegister] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const guestCount = Object.keys(completedLessons).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setUser({
        id: "usr_mock_live_01",
        name: name || (isRegister ? "Web Developer" : "Student BelajarinAja"),
        email: email || "student@belajarinaja.com",
        role: "STUDENT",
      });
      setLoading(false);
      closeLoginModal();
      router.push("/dashboard");
    }, 600);
  };

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={closeLoginModal}>
      <DialogContent className="max-w-md bg-card border border-border p-6 rounded-2xl shadow-xl dark:border dark:border-[#222222] dark:bg-[#0A0A0A] dark:shadow-none dark:font-mono fun:border-2 fun:border-[#FED7AA] fun:rounded-3xl fun:shadow-[0_20px_60px_rgba(255,155,84,0.15)]">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-[#C6E7FF] text-[#0F172A] font-mono font-black text-xs shadow-xs dark:border dark:border-[#333333] dark:bg-[#111111] dark:text-[#FFFFFF] dark:shadow-none fun:rounded-full fun:border-[#FED7AA]">
              BA
            </div>
            <span className="font-bold tracking-tight text-sm text-foreground dark:text-[#FFFFFF]">
              Belajarin<span className="text-[#0F172A] dark:text-[#FFFFFF] fun:text-[#FF6B6B] bg-[#C6E7FF] dark:bg-transparent fun:bg-[#FFF8E7] px-1 rounded border border-[#93C5FD] dark:border-0 fun:border-[#FED7AA] ml-0.5">Aja</span>
            </span>
          </div>

          <DialogTitle className="text-xl font-black tracking-tight text-foreground dark:text-[#FFFFFF]">
            {isRegister ? t.auth.registerTitle : t.auth.loginTitle}
          </DialogTitle>

          <DialogDescription className="text-xs font-medium text-muted-foreground dark:text-[#888888]">
            {isRegister ? t.auth.registerSubtitle : t.auth.loginSubtitle}
          </DialogDescription>
        </DialogHeader>

        {/* Guest Progress Notice */}
        {guestCount > 0 && (
          <div className="rounded-xl border border-[#FFDDAE] bg-[#FFDDAE]/30 p-3 text-xs text-amber-950 shadow-xs flex items-center gap-2.5 dark:border dark:border-[#333333] dark:bg-[#111111] dark:text-[#CCCCCC] dark:shadow-none fun:rounded-2xl fun:border-[#FED7AA] fun:bg-[#FFF8E7]">
            <ShieldCheck className="h-4 w-4 text-amber-800 dark:text-[#FFFFFF] fun:text-[#FF9F43] shrink-0" />
            <div>
              <span className="font-bold text-foreground dark:text-[#FFFFFF] fun:text-[#243447]">
                {guestCount} {t.auth.guestFound}
              </span>
              <p className="text-muted-foreground dark:text-[#888888] fun:text-[#64748B] text-[11px] mt-0.5 font-medium">
                {guestCount} {t.auth.guestSyncDesc}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground dark:text-[#888888]">
                {t.auth.fullNameLabel}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground dark:text-[#888888] fun:text-[#5CC8FF]" />
                <Input
                  type="text"
                  placeholder={t.auth.fullNameLabel}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 text-xs"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground dark:text-[#888888]">
              {t.auth.emailLabel}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground dark:text-[#888888] fun:text-[#5CC8FF]" />
              <Input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground dark:text-[#888888]">
              {t.auth.passwordLabel}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground dark:text-[#888888] fun:text-[#5CC8FF]" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-9 text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground dark:text-[#888888] dark:hover:text-[#FFFFFF]"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <Button
              type="submit"
              className="w-full text-xs font-bold gap-2 h-9 rounded-md"
              disabled={loading}
            >
              {loading
                ? t.auth.processing
                : isRegister
                ? t.auth.submitRegister
                : t.auth.submitLogin}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>

            <OAuthButtons onSuccess={closeLoginModal} />

            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="w-full text-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors pt-2 block"
            >
              {isRegister ? t.auth.hasAccountToggle : t.auth.noAccountToggle}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
