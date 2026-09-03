"use client";

import React, { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useUserAuthStore } from "@/store/useUserAuthStore";
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

function SessionSync() {
  const { data: session, status } = useSession();
  const { setUser, user, logout } = useUserAuthStore();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const email = session.user.email || "developer@belajarinaja.com";
      const provider =
        (session.user as any).provider ||
        (session.user.image?.includes("github") ? "github" : "google");

      setUser({
        id:
          (session.user as any).id ||
          user?.id ||
          `usr_${Buffer.from(email).toString("base64").substring(0, 10)}`,
        name: user?.name || session.user.name || email.split("@")[0],
        email,
        username:
          user?.username ||
          email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, ""),
        bio: user?.bio || "Web Development Enthusiast di BelajarinAja",
        avatarUrl:
          user?.avatarUrl ||
          session.user.image ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
        dailyGoalMinutes: user?.dailyGoalMinutes || 30,
        role: (session.user as any).role || user?.role || "STUDENT",
        connectedAccounts: {
          google: provider === "google" || !!user?.connectedAccounts?.google,
          github: provider === "github" || !!user?.connectedAccounts?.github,
        },
        accountStatus: "VERIFIED_STUDENT",
      });
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
      {children}
    </SessionProvider>
  );
}
