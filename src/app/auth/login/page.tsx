"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail, User, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { getTranslations } from "@/lib/translations";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";

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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-background text-foreground transition-colors">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.auth.backHome}</span>
        </Link>

        <div className="p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            {theme === "fun" ? (
              <NovaCharacter state="curious" className="w-14 h-14" />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold text-sm">
                BA
              </div>
            )}

            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              {isRegister ? t.auth.registerTitle : t.auth.loginTitle}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isRegister ? t.auth.registerSubtitle : t.auth.loginSubtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">{t.auth.fullName}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Lengkap"
                    className="pl-9 h-10 text-xs rounded-md bg-card border-border"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">{t.auth.email}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="pl-9 h-10 text-xs rounded-md bg-card border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">{t.auth.password}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 h-10 text-xs rounded-md bg-card border-border"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 text-xs font-bold rounded-md"
            >
              {loading ? t.auth.processing : isRegister ? t.auth.btnRegister : t.auth.btnLogin}
            </Button>
          </form>

          {/* Toggle Register / Login */}
          <div className="pt-2 text-center text-xs text-muted-foreground">
            {isRegister ? (
              <span>
                {t.auth.hasAccount}{" "}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="text-primary font-semibold hover:underline"
                >
                  {t.auth.btnLogin}
                </button>
              </span>
            ) : (
              <span>
                {t.auth.noAccount}{" "}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="text-primary font-semibold hover:underline"
                >
                  {t.auth.btnRegister}
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
