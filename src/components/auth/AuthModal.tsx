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
      <DialogContent className="max-w-md bg-[#181A22] border-border p-6 rounded-xl">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground font-mono font-bold text-xs">
              BA
            </div>
            <span className="font-semibold tracking-tight text-sm text-foreground">
              BelajarinAja
            </span>
          </div>

          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            {isRegister ? "Buat Akun Siswa" : "Masuk ke Akun"}
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground">
            {isRegister
              ? "Simpan progress belajar Anda ke cloud secara permanen dan klaim sertifikat."
              : "Lanjutkan pembelajaran dan akses dashboard statistik Anda."}
          </DialogDescription>
        </DialogHeader>

        {/* Guest Progress Notice */}
        {guestCount > 0 && (
          <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-xs text-foreground flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <div>
              <span className="font-semibold text-primary">
                {guestCount} Materi Selesai Terdeteksi!
              </span>
              <p className="text-muted-foreground text-[11px] mt-0.5">
                Progress browser Anda akan otomatis dipindahkan ke akun baru.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
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
                  className="pl-9 text-xs bg-background/50 border-border"
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
                className="pl-9 text-xs bg-background/50 border-border"
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
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-9 text-xs bg-background/50 border-border"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
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
              className="w-full text-xs font-medium gap-2 h-9"
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
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
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
