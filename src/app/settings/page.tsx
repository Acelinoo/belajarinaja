"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Moon,
  Sun,
  Palette,
  Globe,
  Trash2,
  Save,
  Check,
  Settings,
  ShieldCheck,
  ShieldAlert,
  Lock,
  LogOut,
  Clock,
  ExternalLink,
  Laptop,
  AlertTriangle,
  Eye,
  EyeOff,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { getTranslations } from "@/lib/translations";
import { NovaCharacter } from "@/components/fun/characters/NovaCharacter";

type SettingsTab = "profile" | "account" | "security" | "preferences";

export default function SettingsPage() {
  const router = useRouter();
  const { user, setUser, updateProfile, connectAccount, disconnectAccount, setDailyGoal, logout, deleteAccount } = useAuthStore();
  const { theme, setTheme, language, setLanguage } = useThemeLanguageStore();
  const { clearGuestProgress } = useCurriculumProgressStore();
  const t = getTranslations(language);

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Profile Form States
  const [name, setName] = useState(user?.name || "Pelajar Web");
  const [username, setUsername] = useState(user?.username || "developer");
  const [bio, setBio] = useState(user?.bio || "Web Development Enthusiast di BelajarinAja");
  const [avatarSeed, setAvatarSeed] = useState(user?.email || "developer");
  const [dailyMinutes, setDailyMinutes] = useState(user?.dailyGoalMinutes || 30);
  const [savedNotice, setSavedNotice] = useState(false);

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);

  // Delete Account Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      username: username.trim(),
      bio: bio.trim(),
      dailyGoalMinutes: dailyMinutes,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordNotice("Kata sandi baru minimal 8 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordNotice("Konfirmasi kata sandi tidak cocok");
      return;
    }

    setPasswordNotice("Kata sandi berhasil diperbarui!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordNotice(null), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText === "HAPUS AKUN SAYA") {
      deleteAccount();
      setIsDeleteModalOpen(false);
      router.push("/");
    }
  };

  const handleClearLocalData = () => {
    if (confirm(t.settings.confirmReset)) {
      clearGuestProgress();
      alert("Seluruh data progress belajar di browser ini telah dibersihkan.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
              {theme === "fun" ? (
                <NovaCharacter state="thinking" className="w-16 h-16 shrink-0" />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold">
                  <Settings className="h-6 w-6" />
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                  PENGATURAN AKUN & SISTEM
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {t.settings.title}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t.settings.subtitle}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs font-semibold text-destructive hover:bg-destructive/10 border-destructive/30 gap-1.5 shrink-0"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar (Log Out)</span>
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-border gap-2 overflow-x-auto pb-1">
            {[
              { id: "profile", label: "Profil Pengguna", icon: User },
              { id: "account", label: "Akun & OAuth", icon: ShieldCheck },
              { id: "security", label: "Keamanan", icon: Lock },
              { id: "preferences", label: "Tampilan & Preferensi", icon: Palette },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`px-4 py-2.5 rounded-t-lg text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
                    isActive
                      ? "border-primary text-primary bg-secondary/50"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* =========================================================================
              TAB 1: PROFILE SETTINGS & LIVE PREVIEW
             ========================================================================= */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Form */}
              <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-6">
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-base font-bold text-foreground">Edit Informasi Profil</h2>
                    <p className="text-xs text-muted-foreground">
                      Nama ini akan digunakan pada dashboard, sertifikat kelulusan, dan kartu portofolio Anda.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Nama Lengkap</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-10 text-xs rounded-md bg-card border-border"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Username</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">@</span>
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                        className="pl-7 h-10 text-xs rounded-md bg-card border-border font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Bio / Deskripsi Singkat</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 text-xs rounded-md bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Pilih Gaya Avatar Bot</label>
                    <div className="flex gap-2">
                      {["developer", "acelino", "coder", "explorer", "wizard"].map((seed) => (
                        <button
                          key={seed}
                          type="button"
                          onClick={() => setAvatarSeed(seed)}
                          className={`p-1.5 rounded-lg border-2 transition-all ${
                            avatarSeed === seed ? "border-primary bg-primary/10" : "border-border bg-card"
                          }`}
                        >
                          <img
                            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`}
                            alt={seed}
                            className="w-8 h-8 rounded"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 flex items-center gap-3">
                    <Button type="submit" size="sm" className="text-xs font-bold rounded-md px-6 gap-1.5">
                      <Save className="h-3.5 w-3.5" />
                      <span>{t.settings.saveChanges}</span>
                    </Button>
                    {savedNotice && (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" />
                        <span>Profil berhasil disimpan!</span>
                      </span>
                    )}
                  </div>
                </form>
              </div>

              {/* Profile Live Preview Card */}
              <div className="p-6 rounded-2xl border border-border bg-secondary/30 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Pratinjau Kartu Profil
                  </span>
                  <div className="p-5 rounded-xl border border-border bg-card text-center space-y-3 shadow-xs">
                    <img
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`}
                      alt="Avatar"
                      className="w-16 h-16 mx-auto rounded-full border-2 border-primary/40 bg-secondary"
                    />
                    <div>
                      <h3 className="text-sm font-extrabold text-foreground">{name || "Pelajar Web"}</h3>
                      <span className="text-[11px] text-muted-foreground font-mono">@{username || "developer"}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-3 leading-relaxed">
                      {bio || "Web Development Enthusiast di BelajarinAja"}
                    </p>
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                      Pelajar Terverifikasi
                    </Badge>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground text-center">
                  Tampilan ini sinkron secara realtime ke seluruh sistem.
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: ACCOUNT & CONNECTED OAUTH ACCOUNTS
             ========================================================================= */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-foreground">Informasi Akun Utama</h2>
                  <p className="text-xs text-muted-foreground">
                    Alamat email terdaftar dan tanggal pembuatan akun.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg border border-border bg-secondary/30 space-y-1">
                    <span className="text-muted-foreground block text-[11px]">Alamat Email (Read-Only)</span>
                    <span className="font-semibold text-foreground">{user?.email || "student@belajarinaja.com"}</span>
                  </div>
                  <div className="p-3.5 rounded-lg border border-border bg-secondary/30 space-y-1">
                    <span className="text-muted-foreground block text-[11px]">Status Akun</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Aktif • Pelajar Terverifikasi</span>
                  </div>
                </div>
              </div>

              {/* Connected Accounts Section */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-foreground">Akun Terhubung (Connected OAuth Accounts)</h2>
                  <p className="text-xs text-muted-foreground">
                    Hubungkan akun Google atau GitHub Anda untuk login cepat dan aman dengan 1-klik.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Google Connection */}
                  <div className="p-4 rounded-xl border border-border bg-secondary/30 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                      </svg>
                      <div>
                        <span className="text-xs font-bold text-foreground block">Google</span>
                        <span className="text-[11px] text-muted-foreground">
                          {user?.connectedAccounts?.google ? "Terhubung ke Akun Google" : "Belum terhubung"}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={user?.connectedAccounts?.google ? "outline" : "default"}
                      onClick={() => user?.connectedAccounts?.google ? disconnectAccount("google") : connectAccount("google")}
                      className="text-xs font-semibold rounded-md h-8"
                    >
                      {user?.connectedAccounts?.google ? "Putuskan" : "Hubungkan"}
                    </Button>
                  </div>

                  {/* GitHub Connection */}
                  <div className="p-4 rounded-xl border border-border bg-secondary/30 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 fill-current text-foreground shrink-0" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      <div>
                        <span className="text-xs font-bold text-foreground block">GitHub</span>
                        <span className="text-[11px] text-muted-foreground">
                          {user?.connectedAccounts?.github ? "Terhubung ke Akun GitHub" : "Belum terhubung"}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={user?.connectedAccounts?.github ? "outline" : "default"}
                      onClick={() => user?.connectedAccounts?.github ? disconnectAccount("github") : connectAccount("github")}
                      className="text-xs font-semibold rounded-md h-8"
                    >
                      {user?.connectedAccounts?.github ? "Putuskan" : "Hubungkan"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: SECURITY & PASSWORD & DANGER ZONE
             ========================================================================= */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Password Update Form */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-foreground">Perbarui Kata Sandi</h2>
                  <p className="text-xs text-muted-foreground">
                    Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.
                  </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Kata Sandi Saat Ini</label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-10 text-xs rounded-md bg-card border-border"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Kata Sandi Baru</label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      className="h-10 text-xs rounded-md bg-card border-border"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Konfirmasi Kata Sandi Baru</label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi baru"
                      className="h-10 text-xs rounded-md bg-card border-border"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      <span>{showPassword ? "Sembunyikan" : "Perlihatkan"} kata sandi</span>
                    </button>
                  </div>

                  <Button type="submit" size="sm" className="text-xs font-bold rounded-md px-6">
                    Simpan Kata Sandi Baru
                  </Button>

                  {passwordNotice && (
                    <p className={`text-xs font-semibold ${passwordNotice.includes("berhasil") ? "text-emerald-600" : "text-destructive"}`}>
                      {passwordNotice}
                    </p>
                  )}
                </form>
              </div>

              {/* Active Sessions */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-foreground">Sesi Aktif (Active Sessions)</h2>
                  <p className="text-xs text-muted-foreground">
                    Perangkat yang saat ini sedang mengakses akun BelajarinAja Anda.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-secondary/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Laptop className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-foreground block">Browser Saat Ini (Desktop / Web)</span>
                      <span className="text-[11px] text-muted-foreground">Indonesia • Aktif sekarang</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                    Sesi Ini
                  </Badge>
                </div>
              </div>

              {/* Danger Zone: Delete Account */}
              <div className="p-6 sm:p-8 rounded-2xl border-2 border-destructive/30 bg-destructive/5 space-y-4">
                <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Zona Berbahaya (Danger Zone)</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Menghapus akun Anda akan menghapus seluruh data profil, riwayat kemajuan kurikulum, dan sertifikat yang diterbitkan secara permanen dari basis data.
                </p>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-xs font-bold rounded-md"
                >
                  Hapus Akun Permanen
                </Button>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: PREFERENCES, THEME, LANGUAGE, LEARNING GOAL
             ========================================================================= */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              {/* Atmosphere Theme Selector */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-foreground">Suasana Tampilan (Atmosphere Theme)</h2>
                  <p className="text-xs text-muted-foreground">
                    Pilih suasana desain yang paling mendukung fokus dan kenyamanan belajar Anda.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "light", label: "Light Mode", desc: "Neo-Brutalism & Editorial" },
                    { id: "dark", label: "Dark Mode", desc: "Obsidian Command Center" },
                    { id: "fun", label: "Fun Mode", desc: "Playful Learning World" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTheme(item.id as "light" | "dark" | "fun")}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        theme === item.id
                          ? "border-primary bg-secondary shadow-xs font-bold ring-1 ring-primary"
                          : "border-border bg-card hover:bg-secondary/40"
                      }`}
                    >
                      <span className="text-xs font-bold text-foreground block">{item.label}</span>
                      <span className="text-[11px] text-muted-foreground block mt-0.5">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selector */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-foreground">Bahasa Antarmuka & Materi (Language)</h2>
                  <p className="text-xs text-muted-foreground">
                    Pilih bahasa pengantar untuk seluruh teks kurikulum, kuis, dan instruksi.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                  {[
                    { id: "id", label: "Bahasa Indonesia", tag: "ID" },
                    { id: "en", label: "English (Technical)", tag: "EN" },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setLanguage(lang.id as "id" | "en")}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        language === lang.id
                          ? "border-primary bg-secondary shadow-xs font-bold ring-1 ring-primary"
                          : "border-border bg-card hover:bg-secondary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{lang.label}</span>
                        <Badge variant="outline" className="text-[10px]">{lang.tag}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Learning Goal */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-foreground">Target Waktu Belajar Harian</h2>
                  <p className="text-xs text-muted-foreground">
                    Tetapkan komitmen waktu harian untuk menjaga konsistensi dan ritme belajar Anda.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
                  {[
                    { minutes: 15, label: "15 Menit / Hari", desc: "Santai & Bertahap" },
                    { minutes: 30, label: "30 Menit / Hari", desc: "Direkomendasikan" },
                    { minutes: 60, label: "60 Menit / Hari", desc: "Intensif & Cepat" },
                  ].map((goal) => (
                    <button
                      key={goal.minutes}
                      type="button"
                      onClick={() => {
                        setDailyMinutes(goal.minutes);
                        setDailyGoal(goal.minutes);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        dailyMinutes === goal.minutes
                          ? "border-primary bg-secondary shadow-xs font-bold ring-1 ring-primary"
                          : "border-border bg-card hover:bg-secondary/40"
                      }`}
                    >
                      <span className="text-xs font-bold text-foreground block">{goal.label}</span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">{goal.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Local Progress */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-foreground">Reset Data Progress Belajar Lokal</h2>
                  <p className="text-xs text-muted-foreground">
                    Hapus catatan skor kuis dan checklist materi yang tersimpan di browser ini jika Anda ingin mengulang dari awal.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearLocalData}
                  className="text-xs font-semibold rounded-md border-border gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Reset Progress Belajar</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl border-2 border-destructive bg-card shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-destructive font-bold text-base">
              <AlertTriangle className="h-5 w-5" />
              <span>Konfirmasi Hapus Akun</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tindakan ini permanen. Ketik <strong className="text-foreground font-mono">HAPUS AKUN SAYA</strong> di bawah ini untuk mengonfirmasi penghapusan akun Anda.
            </p>

            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="HAPUS AKUN SAYA"
              className="h-10 text-xs rounded-md font-mono"
            />

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmText("");
                }}
                className="text-xs font-semibold rounded-md"
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleteConfirmText !== "HAPUS AKUN SAYA"}
                onClick={handleDeleteAccount}
                className="text-xs font-bold rounded-md"
              >
                Hapus Akun Permanen
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
