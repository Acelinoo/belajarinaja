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
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Guest Progress Notice */}
        {guestCount > 0 && (
          <div className="rounded-lg border border-primary/30 bg-primary/10 p-3.5 text-xs text-foreground flex items-center justify-between">
            <div>
              <span className="font-semibold text-primary">Progress Belajar Ditemukan!</span>
              <p className="text-muted-foreground mt-0.5">
                {guestCount} materi yang Anda pelajari sebagai Guest akan otomatis disinkronkan ke akun ini.
              </p>
            </div>
          </div>
        )}

        <Card className="border-border">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground font-mono font-bold text-xs">
                BA
              </div>
              <span className="font-semibold tracking-tight text-sm">BelajarinAja</span>
            </div>
            <CardTitle className="text-xl font-bold tracking-tight">
              {isRegister ? "Buat Akun Baru" : "Masuk ke Akun Anda"}
            </CardTitle>
            <CardDescription className="text-xs">
              {isRegister
                ? "Simpan progress belajar, klaim sertifikat, dan sinkronkan data di semua perangkat."
                : "Lanjutkan belajar dan akses statistik pembelajaran Anda."}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {isRegister && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Nama lengkap Anda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9 text-xs"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
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
                <label className="text-xs font-medium text-foreground">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 text-xs"
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button type="submit" className="w-full text-xs font-medium gap-2" disabled={loading}>
                {loading ? "Memproses..." : isRegister ? "Daftar & Sinkronkan Data" : "Masuk Sekarang"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>

              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-muted-foreground hover:text-foreground text-center"
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
