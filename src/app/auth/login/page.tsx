"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useGuestProgressStore } from "@/store/useGuestProgressStore";

export default function AuthLoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useUserAuthStore();
  const { completedLessons } = useGuestProgressStore();

  const guestCount = Object.keys(completedLessons).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setUser({
        id: "usr_mock_01",
        name: name || "Student BelajarinAja",
        email: email || "student@belajarinaja.com",
        role: "STUDENT",
      });
      setLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-black dark:text-[#94A3B8] hover:underline decoration-[#FFD84D] decoration-2 transition-colors dark:no-underline dark:hover:text-cyan-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Guest Progress Notice */}
        {guestCount > 0 && (
          <div className="rounded-xl border-2 border-black bg-[#FFD84D]/30 p-3.5 text-xs text-[#121212] shadow-[4px_4px_0px_#121212] flex items-center justify-between dark:border dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-[#F1F5F9] dark:shadow-none">
            <div>
              <span className="font-black text-black dark:text-cyan-300">Progress Belajar Ditemukan!</span>
              <p className="text-neutral-800 dark:text-[#8292A6] mt-0.5 font-medium dark:font-normal">
                {guestCount} materi yang Anda pelajari sebagai Guest akan otomatis disinkronkan ke akun ini.
              </p>
            </div>
          </div>
        )}

        <Card className="border-2 border-black bg-white shadow-[8px_8px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-7 w-7 items-center justify-center rounded border-2 border-black bg-[#FFD84D] text-[#121212] font-mono font-black text-xs shadow-[1.5px_1.5px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
                BA
              </div>
              <span className="font-black tracking-tight text-sm text-foreground">
                Belajarin<span className="text-[#121212] dark:text-cyan-400 bg-[#FFD84D] dark:bg-transparent px-1 rounded-sm border border-black dark:border-0 ml-0.5">Aja</span>
              </span>
            </div>
            <CardTitle className="text-xl font-black tracking-tight text-foreground">
              {isRegister ? "Buat Akun Baru" : "Masuk ke Akun Anda"}
            </CardTitle>
            <CardDescription className="text-xs font-medium text-[#555555] dark:font-normal dark:text-[#8292A6]">
              {isRegister
                ? "Simpan progress belajar, klaim sertifikat, dan sinkronkan data di semua perangkat."
                : "Lanjutkan belajar dan akses statistik pembelajaran Anda."}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {isRegister && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-[#121212] dark:text-cyan-400" />
                    <Input
                      type="text"
                      placeholder="Nama lengkap Anda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9 text-xs bg-white dark:bg-[#05070A] dark:border-[#1C242D] dark:text-[#F1F5F9]"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#121212] dark:text-cyan-400" />
                  <Input
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 text-xs bg-white dark:bg-[#05070A] dark:border-[#1C242D] dark:text-[#F1F5F9]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#121212] dark:text-cyan-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 text-xs bg-white dark:bg-[#05070A] dark:border-[#1C242D] dark:text-[#F1F5F9]"
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button type="submit" className="w-full text-xs font-black gap-2 h-9 shadow-[3px_3px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-400 dark:hover:text-[#05070A] dark:shadow-none" disabled={loading}>
                {loading ? "Memproses..." : isRegister ? "Daftar & Sinkronkan Data" : "Masuk Sekarang"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>

              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs font-bold text-black underline hover:text-primary text-center dark:text-[#8292A6] dark:no-underline dark:hover:text-cyan-300 transition-colors"
              >
                {isRegister
                  ? "Sudah memiliki akun? Masuk di sini"
                  : "Belum punya akun? Daftar gratis sekarang"}
              </button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
