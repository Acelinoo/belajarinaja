"use client";

import React, { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useCurriculumProgressStore } from "@/store/useCurriculumProgressStore";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";

function ThemeSync() {
  const { theme } = useThemeLanguageStore();

  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.remove("light", "dark", "fun");
      root.classList.add(theme);
      root.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return null;
}

function PageViewTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const lastVisitTime = sessionStorage.getItem("belajarinaja_last_visit_time");
      const now = Date.now();
      // Catat kunjungan jika sesi baru atau interval lebih dari 30 detik
      if (!lastVisitTime || now - Number(lastVisitTime) > 30000) {
        sessionStorage.setItem("belajarinaja_last_visit_time", String(now));
        fetch("/api/v1/stats/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }).catch((err) => console.warn("[PageViewTracker] error:", err));
      }
    } catch (e) {}
  }, []);

  return null;
}

function SessionSync() {
  const { data: session, status } = useSession();
  const { setUser, user, logout } = useUserAuthStore();
  const { loadUserProgress } = useCurriculumProgressStore();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const email = (session.user.email || "developer@belajarinaja.com").toLowerCase().trim();
      const provider =
        (session.user as any).provider ||
        (session.user.image?.includes("github") ? "github" : "google");

      // 1. Coba baca profil yang tersimpan di localStorage
      let localSaved: any = null;
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(`belajarinaja_saved_profile_${email}`);
          if (raw) localSaved = JSON.parse(raw);
        } catch (e) {}
      }

      const activeUser = {
        id:
          (session.user as any).id ||
          user?.id ||
          localSaved?.id ||
          `usr_${Buffer.from(email).toString("base64").substring(0, 10)}`,
        name: localSaved?.name || user?.name || session.user.name || email.split("@")[0],
        email,
        username:
          localSaved?.username ||
          user?.username ||
          email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, ""),
        bio: localSaved?.bio || user?.bio || "Web Development Enthusiast di BelajarinAja",
        avatarUrl:
          localSaved?.avatarUrl ||
          user?.avatarUrl ||
          session.user.image ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
        dailyGoalMinutes: localSaved?.dailyGoalMinutes || user?.dailyGoalMinutes || 30,
        role: (session.user as any).role || user?.role || "STUDENT",
        connectedAccounts: {
          google: provider === "google" || !!user?.connectedAccounts?.google,
          github: provider === "github" || !!user?.connectedAccounts?.github,
        },
        accountStatus: "VERIFIED_STUDENT" as const,
      };

      setUser(activeUser);

      // 2. Sinkronkan dengan data profil server jika ada
      fetch(`/api/v1/auth/profile?email=${encodeURIComponent(email)}&_t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.profile) {
            const mergedUser = {
              ...activeUser,
              username: data.profile.username || activeUser.username,
              name: data.profile.name || activeUser.name,
              bio: data.profile.bio || activeUser.bio,
              avatarUrl: data.profile.avatarUrl || activeUser.avatarUrl,
              dailyGoalMinutes: data.profile.dailyGoalMinutes || activeUser.dailyGoalMinutes,
            };
            setUser(mergedUser);
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem(
                  `belajarinaja_saved_profile_${email}`,
                  JSON.stringify(mergedUser)
                );
              } catch (e) {}
            }
          }
        })
        .catch((err) => console.warn("[AuthProvider] Profile sync warning:", err));

      // Load user progress
      loadUserProgress(email);
    } else if (status === "unauthenticated") {
      // If NextAuth session is officially unauthenticated, ensure local store is also logged out
      if (user) {
        logout();
      }
    }
  }, [session, status]);

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionSync />
      <ThemeSync />
      <PageViewTracker />
      {children}
    </SessionProvider>
  );
}
