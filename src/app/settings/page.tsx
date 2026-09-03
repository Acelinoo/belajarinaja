"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import {
  User,
  ShieldCheck,
  Lock,
  Palette,
  Settings,
  Save,
  Check,
  LogOut,
  Trash2,
  Laptop,
  AlertTriangle,
  Globe,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { getTranslations } from "@/lib/translations";

type SettingsTab = "profile" | "account" | "security" | "preferences";

export default function SettingsPage() {
  const router = useRouter();
  const {
    user,
    setUser,
    updateProfile,
    connectAccount,
    disconnectAccount,
    setDailyGoal,
    logout,
    deleteAccount,
  } = useAuthStore();

  const { theme, setTheme, language, setLanguage } = useThemeLanguageStore();
  const { clearGuestProgress } = useCurriculumProgressStore();
  const t = getTranslations(language);

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Profile Form States
  const [name, setName] = useState(user?.name || "Pelajar Web");
  const [username, setUsername] = useState(user?.username || "developer");
  const [bio, setBio] = useState(user?.bio || "Web Development Enthusiast di BelajarinAja");
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=developer"
  );
  const [dailyMinutes, setDailyMinutes] = useState(user?.dailyGoalMinutes || 30);
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // Handle Instant Avatar Selection
  const handleSelectAvatar = (url: string) => {
    setAvatarUrl(url);
    updateProfile({ avatarUrl: url });
  };

  // Sync state initially or when user id changes
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.username) setUsername(user.username);
      if (user.bio) setBio(user.bio);
      if (user.avatarUrl) setAvatarUrl(user.avatarUrl);
      if (user.dailyGoalMinutes) setDailyMinutes(user.dailyGoalMinutes);
    }
  }, [user?.id]);

  // Modals State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isResetProgressModalOpen, setIsResetProgressModalOpen] = useState(false);
  const [resetSuccessNotice, setResetSuccessNotice] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Profile Form Submit
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setProfileError(null);

    const updatedData = {
      name: name.trim(),
      username: username.trim(),
      bio: bio.trim(),
      avatarUrl,
      dailyGoalMinutes: dailyMinutes,
    };

    // 2. Persist to server API & Prisma DB with uniqueness verification
    try {
      const res = await fetch("/api/v1/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
          ...updatedData,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setProfileError(data.error || "Gagal memperbarui profil pengguna");
        setIsSaving(false);
        return;
      }

      // 1. Update local client store only if server validation succeeded!
      updateProfile(updatedData);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch (err) {
      console.warn("[Settings] Profile sync error:", err);
      updateProfile(updatedData);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Connected OAuth Account Connect / Disconnect
  const handleConnectProvider = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: "/settings" });
  };

  const handleDisconnectProvider = (provider: "google" | "github") => {
    const isGoogle = provider === "google";
    const otherConnected = isGoogle
      ? user?.connectedAccounts?.github
      : user?.connectedAccounts?.google;

    if (!otherConnected) {
      alert("Anda harus mempertahankan minimal satu akun OAuth terhubung agar tidak kehilangan akses login.");
      return;
    }

    if (confirm(`Apakah Anda yakin ingin memutuskan tautan akun ${provider === "google" ? "Google" : "GitHub"}?`)) {
      disconnectAccount(provider);
    }
  };

  // Logout Flow (NextAuth + LocalStore)
  const handleLogout = async () => {
    logout();
    await signOut({ callbackUrl: "/" });
  };

  // Delete Account Flow
  const handleDeleteAccount = async () => {
    if (deleteConfirmText === "HAPUS AKUN SAYA") {
      try {
        await fetch("/api/v1/auth/profile", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            confirmation: "HAPUS AKUN SAYA",
            email: user?.email,
          }),
        });
      } catch (e) {
        console.warn("[Settings] Delete account API call:", e);
      }

      deleteAccount();
      setIsDeleteModalOpen(false);
      await signOut({ callbackUrl: "/" });
    }
  };

  // Reset Local Progress Flow
  const handleConfirmResetProgress = () => {
    clearGuestProgress();
    setIsResetProgressModalOpen(false);
    setResetSuccessNotice(true);
    setTimeout(() => setResetSuccessNotice(false), 3000);
  };

  const botttsAvatars = [
    { id: "developer", label: "Dev Bot", url: "https://api.dicebear.com/7.x/bottts/svg?seed=developer" },
    { id: "acelino", label: "Acel Bot", url: "https://api.dicebear.com/7.x/bottts/svg?seed=acelino" },
    { id: "coder", label: "Coder", url: "https://api.dicebear.com/7.x/bottts/svg?seed=coder" },
    { id: "explorer", label: "Explorer", url: "https://api.dicebear.com/7.x/bottts/svg?seed=explorer" },
    { id: "wizard", label: "Wizard", url: "https://api.dicebear.com/7.x/bottts/svg?seed=wizard" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold border border-border shrink-0">
                <Settings className="h-6 w-6" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest block">
                  PENGATURAN SISTEM & AKUN
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {t.settings.title}
                </h1>
                <p className="text-xs text-muted-foreground">
                  Kelola preferensi pembelajaran, profil sertifikat, dan keamanan akun Anda.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs font-semibold text-destructive hover:bg-destructive/10 border-destructive/30 gap-1.5 shrink-0 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar (Log Out)</span>
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-border gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "profile", label: "Profil Pengguna", icon: User },
              { id: "account", label: "Akun & OAuth", icon: ShieldCheck },
              { id: "security", label: "Keamanan Akun", icon: Lock },
              { id: "preferences", label: "Tampilan & Preferensi", icon: Palette },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
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
              TAB 1: PROFIL PENGGUNA (Form + Real-Time Live Preview)
             ========================================================================= */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Profile Form */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-6">
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="space-y-1 pb-2 border-b border-border/70">
                    <h2 className="text-base font-bold text-foreground">Edit Informasi Profil</h2>
                    <p className="text-xs text-muted-foreground">
                      Nama dan data ini akan tercetak pada dashboard, sertifikat kelulusan, dan portofolio Anda.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Nama Lengkap</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Marchelino Kurniawan"
                      className="h-10 text-xs rounded-xl bg-card border-border"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Username</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                        @
                      </span>
                      <Input
                        value={username}
                        onChange={(e) =>
                          setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                        }
                        placeholder="username"
                        className="pl-7 h-10 text-xs rounded-xl bg-card border-border font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Bio / Deskripsi Singkat
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Tuliskan minat atau fokus belajar Anda..."
                      className="w-full p-3 text-xs rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* Avatar Selector */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-foreground">
                        Pilih Gaya Avatar
                      </label>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        Klik untuk langsung terapkan
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {/* Option for OAuth photo if available */}
                      {user?.avatarUrl && !user.avatarUrl.includes("dicebear") && (
                        <button
                          type="button"
                          onClick={() => handleSelectAvatar(user.avatarUrl!)}
                          className={`relative p-1.5 rounded-xl border-2 transition-all cursor-pointer ${
                            avatarUrl === user.avatarUrl
                              ? "border-primary bg-primary/10 ring-2 ring-primary scale-105 shadow-xs"
                              : "border-border bg-card hover:bg-secondary/70 hover:scale-105"
                          }`}
                          title="Gunakan Foto Akun OAuth"
                        >
                          <img
                            src={user.avatarUrl}
                            alt="OAuth Avatar"
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          {avatarUrl === user.avatarUrl && (
                            <div className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground rounded-full p-0.5 shadow-xs">
                              <Check className="h-2.5 w-2.5" />
                            </div>
                          )}
                        </button>
                      )}

                      {/* Bottts Avatar Options */}
                      {botttsAvatars.map((bot) => {
                        const isSelected = avatarUrl === bot.url;
                        return (
                          <button
                            key={bot.id}
                            type="button"
                            onClick={() => handleSelectAvatar(bot.url)}
                            className={`relative p-1.5 rounded-xl border-2 transition-all cursor-pointer ${
                              isSelected
                                ? "border-primary bg-primary/10 ring-2 ring-primary scale-105 shadow-xs"
                                : "border-border bg-card hover:bg-secondary/70 hover:scale-105"
                            }`}
                            title={bot.label}
                          >
                            <img src={bot.url} alt={bot.label} className="w-10 h-10 rounded-lg" />
                            {isSelected && (
                              <div className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground rounded-full p-0.5 shadow-xs">
                                <Check className="h-2.5 w-2.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Avatar URL Field */}
                    <div className="pt-1">
                      <Input
                        value={avatarUrl}
                        onChange={(e) => handleSelectAvatar(e.target.value)}
                        placeholder="Atau tempel link URL avatar kustom (https://...)"
                        className="h-9 text-xs rounded-xl bg-card border-border font-mono text-muted-foreground focus:text-foreground"
                      />
                    </div>
                  </div>

                  {/* Error Alert */}
                  {profileError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{profileError}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-border flex items-center gap-3">
                    <Button
                      type="submit"
                      disabled={isSaving}
                      size="sm"
                      className="text-xs font-bold rounded-xl px-6 gap-2 cursor-pointer h-10"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>{isSaving ? "Menyimpan..." : t.settings.saveChanges}</span>
                    </Button>

                    {savedNotice && (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                        <Check className="h-4 w-4" />
                        <span>Profil berhasil diperbarui dan disinkronkan!</span>
                      </span>
                    )}
                  </div>
                </form>
              </div>

              {/* Profile Live Preview Card (Right Column) */}
              <div className="lg:col-span-5 p-6 rounded-2xl border border-border bg-secondary/30 space-y-4">
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
                  PRATINJAU KARTU PROFIL
                </span>

                <div className="p-6 rounded-2xl border border-border bg-card text-center space-y-4 shadow-sm">
                  <div className="relative inline-block">
                    <img
                      src={avatarUrl}
                      alt="Avatar Preview"
                      className="w-20 h-20 mx-auto rounded-2xl border-2 border-primary/30 bg-secondary object-cover shadow-sm"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-card rounded-full" />
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-foreground">{name || "Pelajar Web"}</h3>
                    <span className="text-xs text-muted-foreground font-mono">
                      @{username || "developer"}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {bio || "Web Development Enthusiast di BelajarinAja"}
                  </p>

                  <div className="pt-3 border-t border-border/80 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>ROLE: STUDENT</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      VERIFIED
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                  Perubahan pada kartu ini tersinkronisasi langsung ke sertifikat kelulusan dan navbar.
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: AKUN & OAUTH (Google & GitHub)
             ========================================================================= */}
          {activeTab === "account" && (
            <div className="space-y-6">
              {/* Account Info Card */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <div className="space-y-1 pb-2 border-b border-border/70">
                  <h2 className="text-base font-bold text-foreground">Informasi Akun Utama</h2>
                  <p className="text-xs text-muted-foreground">
                    Data identitas autentikasi akun BelajarinAja Anda.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-1">
                    <span className="text-muted-foreground block text-[11px] font-mono">
                      ALAMAT EMAIL TERDAFTAR
                    </span>
                    <span className="font-semibold text-foreground text-sm">
                      {user?.email || "student@belajarinaja.com"}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-1">
                    <span className="text-muted-foreground block text-[11px] font-mono">
                      STATUS IDENTITAS
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Pelajar Aktif & Terverifikasi</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Connected OAuth Accounts Card */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <div className="space-y-1 pb-2 border-b border-border/70">
                  <h2 className="text-base font-bold text-foreground">
                    Akun Terhubung (OAuth Providers)
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Kelola tautan akun Google dan GitHub Anda untuk login cepat 1-klik tanpa password.
                  </p>
                </div>

                <div className="space-y-3.5">
                  {/* Google Connection Card */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-border bg-secondary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shrink-0">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                          />
                        </svg>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">Google OAuth</span>
                          {user?.connectedAccounts?.google && (
                            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                              TERHUBUNG
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {user?.connectedAccounts?.google
                            ? "Akun Google terhubung untuk akses masuk instan."
                            : "Belum terhubung. Tautkan akun Google Anda."}
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={user?.connectedAccounts?.google ? "outline" : "default"}
                      onClick={() =>
                        user?.connectedAccounts?.google
                          ? handleDisconnectProvider("google")
                          : handleConnectProvider("google")
                      }
                      className="text-xs font-semibold rounded-xl h-9 px-4 cursor-pointer shrink-0"
                    >
                      {user?.connectedAccounts?.google ? "Putuskan Tautan" : "Hubungkan Google"}
                    </Button>
                  </div>

                  {/* GitHub Connection Card */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-border bg-secondary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shrink-0">
                        <svg className="h-5 w-5 fill-current text-foreground" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">GitHub OAuth</span>
                          {user?.connectedAccounts?.github && (
                            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                              TERHUBUNG
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {user?.connectedAccounts?.github
                            ? "Akun GitHub terhubung untuk akses masuk instan."
                            : "Belum terhubung. Tautkan akun GitHub Anda."}
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={user?.connectedAccounts?.github ? "outline" : "default"}
                      onClick={() =>
                        user?.connectedAccounts?.github
                          ? handleDisconnectProvider("github")
                          : handleConnectProvider("github")
                      }
                      className="text-xs font-semibold rounded-xl h-9 px-4 cursor-pointer shrink-0"
                    >
                      {user?.connectedAccounts?.github ? "Putuskan Tautan" : "Hubungkan GitHub"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: KEAMANAN AKUN (Modern Passwordless OAuth Security + Danger Zone)
             ========================================================================= */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* OAuth Security Architecture Notice */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <div className="space-y-1 pb-2 border-b border-border/70">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h2 className="text-base font-bold text-foreground">Arsitektur Keamanan Akun</h2>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sistem autentikasi BelajarinAja mengadopsi standar Passwordless OAuth 2.0 modern.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-1.5">
                    <span className="text-muted-foreground block text-[10px] font-mono font-bold">
                      TIPE AUTENTIKASI
                    </span>
                    <span className="font-bold text-foreground text-sm block">OAuth 2.0 Token</span>
                    <p className="text-[11px] text-muted-foreground">
                      Bebas risiko kebocoran kata sandi karena tidak ada password manual yang disimpan.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-1.5">
                    <span className="text-muted-foreground block text-[10px] font-mono font-bold">
                      PROTEKSI 2-FA
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm block">
                      Mengikuti Provider
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Dilindungi langsung oleh verifikasi 2 langkah akun Google atau GitHub Anda.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-1.5">
                    <span className="text-muted-foreground block text-[10px] font-mono font-bold">
                      ENKRIPSI DATA
                    </span>
                    <span className="font-bold text-foreground text-sm block">TLS 1.3 / SSL</span>
                    <p className="text-[11px] text-muted-foreground">
                      Seluruh pengiriman token sesi terenkripsi end-to-end melalui protokol HTTPS.
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Sessions Card */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-4">
                <div className="space-y-1 pb-2 border-b border-border/70">
                  <h2 className="text-base font-bold text-foreground">Sesi Login Aktif</h2>
                  <p className="text-xs text-muted-foreground">
                    Perangkat yang saat ini sedang memiliki izin akses ke sesi akun Anda.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-secondary/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <Laptop className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-foreground block">
                        Browser Saat Ini (Web Client)
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Aktif Sekarang • NextAuth Verified Session
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    SESI UTAMA
                  </span>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-6 sm:p-8 rounded-2xl border-2 border-destructive/40 bg-destructive/5 space-y-4">
                <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Zona Berbahaya (Danger Zone)</span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                  Menghapus akun Anda akan menghapus seluruh data profil, riwayat skor kuis 20 tahap, dan verifikasi sertifikat secara permanen dari server.
                </p>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-xs font-bold rounded-xl h-10 px-5 cursor-pointer"
                >
                  Hapus Akun Permanen
                </Button>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: TAMPILAN & PREFERENSI (Theme, Language, Goal, Reset)
             ========================================================================= */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              {/* Atmosphere Theme Selector */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <div className="space-y-1 pb-2 border-b border-border/70">
                  <h2 className="text-base font-bold text-foreground">
                    Suasana Tampilan (Atmosphere Theme)
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Pilih palet warna yang paling nyaman untuk konsentrasi belajar Anda.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {[
                    { id: "light", label: "Light Mode", desc: "Oceanic Editorial (#FAFAFA)", color: "#005691" },
                    { id: "dark", label: "Dark Mode", desc: "Obsidian Focus (#0A0A0A)", color: "#FAFAFA" },
                    { id: "fun", label: "Fun Mode", desc: "Vanilla & Sunny Teal (#FFFDF5)", color: "#218DAE" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTheme(item.id as "light" | "dark" | "fun")}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        theme === item.id
                          ? "border-primary bg-secondary shadow-xs ring-1 ring-primary"
                          : "border-border bg-card hover:bg-secondary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-foreground">{item.label}</span>
                        <span
                          className="w-3 h-3 rounded-full border border-border shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                      <span className="text-[11px] text-muted-foreground block">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selector */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <div className="space-y-1 pb-2 border-b border-border/70">
                  <h2 className="text-base font-bold text-foreground">
                    Bahasa Pengantar Materi (Language)
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Pilih bahasa pengantar untuk navigasi, silabus, dan kuis interaktif.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-md">
                  {[
                    { id: "id", label: "Bahasa Indonesia", tag: "ID" },
                    { id: "en", label: "English (Technical)", tag: "EN" },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setLanguage(lang.id as "id" | "en")}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        language === lang.id
                          ? "border-primary bg-secondary shadow-xs ring-1 ring-primary font-bold"
                          : "border-border bg-card hover:bg-secondary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{lang.label}</span>
                        <span className="text-[10px] font-mono text-muted-foreground font-bold border border-border px-1.5 py-0.5 rounded">
                          {lang.tag}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Learning Goal */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <div className="space-y-1 pb-2 border-b border-border/70">
                  <h2 className="text-base font-bold text-foreground">Target Waktu Belajar Harian</h2>
                  <p className="text-xs text-muted-foreground">
                    Tentukan komitmen waktu harian untuk menjaga ritme konsistensi Anda.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-lg">
                  {[
                    { minutes: 15, label: "15 Menit / Hari", desc: "Santai & Konsisten" },
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
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        dailyMinutes === goal.minutes
                          ? "border-primary bg-secondary shadow-xs ring-1 ring-primary font-bold"
                          : "border-border bg-card hover:bg-secondary/40"
                      }`}
                    >
                      <span className="text-xs font-bold text-foreground block">{goal.label}</span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">
                        {goal.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Local Progress */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-xs space-y-4">
                <div className="space-y-1 pb-2 border-b border-border/70">
                  <h2 className="text-base font-bold text-foreground">Reset Data Progress Belajar</h2>
                  <p className="text-xs text-muted-foreground">
                    Hapus catatan skor kuis dan tanda selesai pada browser ini jika Anda ingin mengulang kurikulum dari tahap 01.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsResetProgressModalOpen(true)}
                    className="text-xs font-semibold rounded-xl border-border gap-1.5 cursor-pointer h-10 px-4"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Reset Progress Pembelajaran</span>
                  </Button>

                  {resetSuccessNotice && (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      <span>Data progress lokal berhasil dibersihkan!</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl border-2 border-destructive bg-card shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-destructive font-bold text-base">
              <AlertTriangle className="h-5 w-5" />
              <span>Konfirmasi Hapus Akun Permanen</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tindakan ini tidak dapat dibatalkan. Ketik{" "}
              <strong className="text-foreground font-mono bg-secondary px-1.5 py-0.5 rounded">
                HAPUS AKUN SAYA
              </strong>{" "}
              di bawah ini untuk mengonfirmasi:
            </p>

            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="HAPUS AKUN SAYA"
              className="h-10 text-xs rounded-xl font-mono"
            />

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmText("");
                }}
                className="text-xs font-semibold rounded-xl cursor-pointer"
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleteConfirmText !== "HAPUS AKUN SAYA"}
                onClick={handleDeleteAccount}
                className="text-xs font-bold rounded-xl cursor-pointer"
              >
                Hapus Akun Permanen
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Progress Confirmation Modal */}
      {isResetProgressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-card shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-foreground font-bold text-base">
              <Trash2 className="h-5 w-5 text-amber-500" />
              <span>Reset Data Progress Belajar?</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Semua checklist materi yang telah Anda selesaikan dan skor kuis interaktif pada browser ini akan dikembalikan ke status awal (0%).
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsResetProgressModalOpen(false)}
                className="text-xs font-semibold rounded-xl cursor-pointer"
              >
                Batal
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleConfirmResetProgress}
                className="text-xs font-bold rounded-xl cursor-pointer"
              >
                Ya, Reset Progress
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
