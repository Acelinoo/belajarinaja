"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail, User, ArrowRight, ShieldCheck, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { BotCompanionCharacter } from "@/components/fun/characters/BotCompanionCharacter";
import { RocketAdventureIllustration } from "@/components/fun/illustrations/RocketAdventureIllustration";

export default function AuthLoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuthStore();
  const { completedLessons } = useCurriculumProgressStore();
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
    }, 600);
  };

  // 1. FUN MODE: Rocket Launchpad Registration
  if (theme === "fun") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-[#FFF8E7] text-[#243447]">
        <div className="w-full max-w-md space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#D97706] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t.auth.backHome}</span>
          </Link>

          <div className="p-8 rounded-[40px] border-4 border-[#FED7AA] bg-white shadow-[0_20px_50px_rgba(255,155,84,0.15)] text-center space-y-6">
            <div className="flex justify-center">
              <RocketAdventureIllustration className="w-24 h-24" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-[#243447]">
                {isRegister ? t.auth.registerTitle : t.auth.loginTitle}
              </h2>
              <p className="text-xs text-[#64748B] font-medium">
                {isRegister ? t.auth.registerSubtitle : t.auth.loginSubtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {isRegister && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#243447]">{t.auth.fullName}</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Penjelajah"
                    className="w-full px-4 py-2.5 text-xs font-bold rounded-full border-2 border-[#FED7AA] bg-white text-[#243447] focus:outline-none focus:border-[#5CC8FF]"
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447]">{t.auth.email}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="explorer@belajarinaja.com"
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-full border-2 border-[#FED7AA] bg-white text-[#243447] focus:outline-none focus:border-[#5CC8FF]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#243447]">{t.auth.password}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-full border-2 border-[#FED7AA] bg-white text-[#243447] focus:outline-none focus:border-[#5CC8FF]"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#FFD84D] hover:bg-[#FFC933] text-[#243447] font-black text-xs h-11 shadow-[0_4px_16px_rgba(255,216,77,0.45)] mt-2"
              >
                {loading ? t.auth.processing : isRegister ? t.auth.btnRegister : t.auth.btnLogin} &rarr;
              </Button>
            </form>

            <div className="pt-2 border-t border-[#FED7AA]/50 text-xs text-[#64748B]">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="font-black text-[#D97706] hover:underline"
              >
                {isRegister ? t.auth.hasAccount : t.auth.noAccount}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. DARK MODE: Monochrome Terminal Access Console (100% Monochrome)
  if (theme === "dark") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-[#050505] text-[#FFFFFF] font-mono">
        <div className="w-full max-w-md space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#888888] hover:text-[#FFFFFF]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>RETURN_TO_ROOT</span>
          </Link>

          <div className="p-8 rounded border border-[#222222] bg-[#0A0A0A] space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#888888]">
                <Terminal className="h-3.5 w-3.5 text-[#FFFFFF]" />
                <span>AUTH_PROTOCOL // ACCESS_NODE</span>
              </div>
              <h2 className="text-lg font-black text-[#FFFFFF]">
                {isRegister ? "REGISTER_CREDENTIALS" : "AUTHENTICATE_SESSION"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-1">
                  <label className="text-xs text-[#888888]">USER_HANDLE</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#050505] border border-[#222222] text-[#FFFFFF] rounded focus:outline-none focus:border-[#FFFFFF]"
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-[#888888]">COMM_EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#050505] border border-[#222222] text-[#FFFFFF] rounded focus:outline-none focus:border-[#FFFFFF]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#888888]">PASSKEY_HASH</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#050505] border border-[#222222] text-[#FFFFFF] rounded focus:outline-none focus:border-[#FFFFFF]"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full font-mono text-xs bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-black h-9 rounded mt-2"
              >
                {loading ? "AUTHENTICATING..." : isRegister ? "SUBMIT_REGISTRATION" : "AUTHORIZE_ACCESS"}
              </Button>
            </form>

            <div className="pt-2 border-t border-[#1A1A1A] text-xs text-center">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-[#888888] hover:text-[#FFFFFF]"
              >
                {isRegister ? "[SWITCH_TO_LOGIN]" : "[CREATE_NEW_ACCOUNT]"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. LIGHT MODE: Modern Neo-Brutalism Login Card
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-[#F7F4EA] text-[#121212]">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-black text-[#121212] hover:underline decoration-[#FFD84D] decoration-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.auth.backHome}</span>
        </Link>

        <div className="p-8 rounded-2xl border-2 border-black bg-white shadow-[8px_8px_0px_#121212] space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-7 w-7 items-center justify-center rounded border-2 border-black bg-[#FFD84D] font-mono font-black text-xs shadow-[1.5px_1.5px_0px_#121212]">
                BA
              </div>
              <span className="font-black text-sm text-[#121212]">BelajarinAja</span>
            </div>
            <h2 className="text-xl font-black text-[#121212]">
              {isRegister ? t.auth.registerTitle : t.auth.loginTitle}
            </h2>
            <p className="text-xs text-[#555555]">
              {isRegister ? t.auth.registerSubtitle : t.auth.loginSubtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#121212]">{t.auth.fullName}</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg border-2 border-black bg-white text-[#121212] shadow-[2px_2px_0px_#121212] focus:outline-none"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#121212]">{t.auth.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border-2 border-black bg-white text-[#121212] shadow-[2px_2px_0px_#121212] focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#121212]">{t.auth.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border-2 border-black bg-white text-[#121212] shadow-[2px_2px_0px_#121212] focus:outline-none"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg border-2 border-black bg-[#FFD84D] hover:bg-[#F5CB32] text-[#121212] font-black text-xs h-10 shadow-[3px_3px_0px_#121212] mt-2"
            >
              {loading ? t.auth.processing : isRegister ? t.auth.btnRegister : t.auth.btnLogin}
            </Button>
          </form>

          <div className="pt-2 border-t-2 border-black text-xs text-center font-bold">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-[#121212] hover:underline decoration-[#FFD84D] decoration-2"
            >
              {isRegister ? t.auth.hasAccount : t.auth.noAccount}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
