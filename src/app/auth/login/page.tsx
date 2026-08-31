"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail, User, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useGuestProgressStore } from "@/store/useGuestProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { RocketAdventureIllustration } from "@/components/fun/illustrations/RocketAdventureIllustration";

export default function AuthLoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useUserAuthStore();
  const { completedLessons } = useGuestProgressStore();
  const { theme, language } = useThemeLanguageStore();
  const t = getTranslations(language);

  const guestCount = Object.keys(completedLessons).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setUser({
        id: "usr_mock_01",
        name: name || (isRegister ? "Web Developer" : "Student BelajarinAja"),
        email: email || "student@belajarinaja.com",
        role: "STUDENT",
      });
      setLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 ${theme === "fun" ? "bg-[#FFF8E7] text-[#243447]" : "bg-background text-foreground"}`}>
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <Link
          href="/"
          className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${theme === "fun" ? "text-[#D97706] hover:underline" : "text-black dark:text-[#94A3B8] hover:underline decoration-[#FFD84D] decoration-2 dark:no-underline dark:hover:text-cyan-300"}`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.auth.backHome}</span>
        </Link>

        {/* Guest Progress Notice */}
        {guestCount > 0 && (
          <div className={`p-3.5 text-xs flex items-center justify-between ${theme === "fun" ? "rounded-3xl border-2 border-[#FED7AA] bg-white shadow-[0_4px_15px_rgba(255,155,84,0.1)] text-[#243447]" : "rounded-xl border-2 border-black bg-[#FFD84D]/30 text-[#121212] shadow-[4px_4px_0px_#121212] dark:border dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-[#F1F5F9] dark:shadow-none"}`}>
            <div>
              <span className="font-black dark:text-cyan-300 fun:text-[#D97706]">
                {guestCount} {t.auth.guestFound}
              </span>
              <p className="mt-0.5 font-medium dark:font-normal text-neutral-800 dark:text-[#8292A6] fun:text-[#64748B]">
                {t.auth.guestSyncDesc}
              </p>
            </div>
          </div>
        )}

        <Card className={`${theme === "fun" ? "border-2 border-[#FED7AA] bg-white rounded-3xl shadow-[0_20px_50px_rgba(255,155,84,0.12)] p-2" : "border-2 border-black bg-white shadow-[8px_8px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-[0_25px_60px_rgba(0,0,0,0.9)]"}`}>
          <CardHeader className="space-y-1 text-center sm:text-left">
            {theme === "fun" ? (
              <div className="flex justify-center mb-2">
                <RocketAdventureIllustration className="w-20 h-20" />
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-7 w-7 items-center justify-center rounded border-2 border-black bg-[#FFD84D] text-[#121212] font-mono font-black text-xs shadow-[1.5px_1.5px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
                  BA
                </div>
                <span className="font-black tracking-tight text-sm text-foreground">
                  Belajarin<span className="text-[#121212] dark:text-cyan-400 bg-[#FFD84D] dark:bg-transparent px-1 rounded-sm border border-black dark:border-0 ml-0.5">Aja</span>
                </span>
              </div>
            )}

            <CardTitle className="text-xl font-black tracking-tight text-foreground fun:text-[#243447]">
              {isRegister ? t.auth.registerTitle : t.auth.loginTitle}
            </CardTitle>
            <CardDescription className="text-xs font-medium text-[#555555] dark:font-normal dark:text-[#8292A6] fun:text-[#64748B]">
              {isRegister ? t.auth.registerSubtitle : t.auth.loginSubtitle}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {isRegister && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground fun:text-[#243447]">
                    {t.auth.fullNameLabel}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-[#121212] dark:text-cyan-400 fun:text-[#5CC8FF]" />
                    <Input
                      type="text"
                      placeholder={t.auth.fullNameLabel}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`pl-9 text-xs bg-white ${theme === "fun" ? "rounded-full border-[#E2E8F0] text-[#243447]" : "dark:bg-[#05070A] dark:border-[#1C242D] dark:text-[#F1F5F9]"}`}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground fun:text-[#243447]">
                  {t.auth.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#121212] dark:text-cyan-400 fun:text-[#5CC8FF]" />
                  <Input
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-9 text-xs bg-white ${theme === "fun" ? "rounded-full border-[#E2E8F0] text-[#243447]" : "dark:bg-[#05070A] dark:border-[#1C242D] dark:text-[#F1F5F9]"}`}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground fun:text-[#243447]">
                  {t.auth.passwordLabel}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#121212] dark:text-cyan-400 fun:text-[#5CC8FF]" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-9 text-xs bg-white ${theme === "fun" ? "rounded-full border-[#E2E8F0] text-[#243447]" : "dark:bg-[#05070A] dark:border-[#1C242D] dark:text-[#F1F5F9]"}`}
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button
                type="submit"
                className={`w-full text-xs font-black gap-2 h-9 ${theme === "fun" ? "rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] shadow-[0_4px_12px_rgba(255,216,77,0.4)]" : "shadow-[3px_3px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-400 dark:hover:text-[#05070A] dark:shadow-none"}`}
                disabled={loading}
              >
                {loading
                  ? t.auth.processing
                  : isRegister
                  ? t.auth.submitRegister
                  : t.auth.submitLogin}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>

              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className={`text-xs font-bold text-center transition-colors ${theme === "fun" ? "text-[#FF6B6B] hover:underline" : "text-black underline hover:text-primary dark:text-[#8292A6] dark:no-underline dark:hover:text-cyan-300"}`}
              >
                {isRegister ? t.auth.hasAccountToggle : t.auth.noAccountToggle}
              </button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

