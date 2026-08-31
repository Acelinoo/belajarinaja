"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, ArrowRight, CheckCircle2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useModalStore } from "@/store/useModalStore";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useGuestProgressStore } from "@/store/useGuestProgressStore";

export function AuthModal() {
  const router = useRouter();
  const { isLoginModalOpen, closeLoginModal } = useModalStore();
  const { setUser } = useUserAuthStore();
  const { completedLessons } = useGuestProgressStore();

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
        name: name || (isRegister ? "Pelajar Web Dev" : "Student BelajarinAja"),
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
      <DialogContent className="max-w-md bg-white border-2 border-black p-6 rounded-xl shadow-[8px_8px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-7 w-7 items-center justify-center rounded border-2 border-black bg-[#FFD84D] text-[#121212] font-mono font-black text-xs shadow-[1.5px_1.5px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none">
              BA
            </div>
            <span className="font-black tracking-tight text-sm text-foreground">
              Belajarin<span className="text-[#121212] dark:text-cyan-400 bg-[#FFD84D] dark:bg-transparent px-1 rounded-sm border border-black dark:border-0 ml-0.5">Aja</span>
            </span>
          </div>

          <DialogTitle className="text-xl font-black tracking-tight text-foreground">
            {isRegister ? "Buat Akun Siswa" : "Masuk ke Akun"}
          </DialogTitle>

          <DialogDescription className="text-xs font-medium text-[#555555] dark:font-normal dark:text-[#8292A6]">
            {isRegister
              ? "Simpan progress belajar Anda ke cloud secara permanen dan klaim sertifikat."
              : "Lanjutkan pembelajaran dan akses dashboard statistik Anda."}
          </DialogDescription>
        </DialogHeader>

        {/* Guest Progress Notice */}
        {guestCount > 0 && (
          <div className="rounded-lg border-2 border-black bg-[#FFD84D]/30 p-3 text-xs text-[#121212] shadow-[3px_3px_0px_#121212] flex items-center gap-2.5 dark:border dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-[#F1F5F9] dark:shadow-none">
            <ShieldCheck className="h-4 w-4 text-black dark:text-cyan-400 shrink-0" />
            <div>
              <span className="font-black text-black dark:text-cyan-300">
                {guestCount} Materi Selesai Terdeteksi!
              </span>
              <p className="text-neutral-800 dark:text-[#8292A6] text-[11px] mt-0.5 font-medium dark:font-normal">
                Progress browser Anda akan otomatis dipindahkan ke akun baru.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
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
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-9 text-xs bg-white dark:bg-[#05070A] dark:border-[#1C242D] dark:text-[#F1F5F9]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#121212] hover:text-black dark:text-[#8292A6] dark:hover:text-cyan-300"
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
              className="w-full text-xs font-bold gap-2 h-9 shadow-[3px_3px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-400 dark:hover:text-[#05070A] dark:shadow-none dark:font-semibold"
              disabled={loading}
            >
              {loading
                ? "Menghubungkan..."
                : isRegister
                ? "Daftar & Migrasikan Progress"
                : "Masuk Sekarang"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>

            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="w-full text-center text-xs font-bold text-black underline hover:text-primary dark:text-[#8292A6] dark:no-underline dark:hover:text-cyan-300 transition-colors"
            >
              {isRegister
                ? "Sudah memiliki akun? Masuk di sini"
                : "Belum punya akun? Buat akun gratis"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
