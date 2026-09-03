"use client";

import React, { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useUserAuthStore } from "@/store/useUserAuthStore";

function SessionSync() {
  const { data: session, status } = useSession();
  const { setUser, user } = useUserAuthStore();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const email = session.user.email || "developer@belajarinaja.com";
      const name = session.user.name || email.split("@")[0];
      const provider = (session.user as any).provider || (session.user.image?.includes("github") ? "github" : "google");

      setUser({
        id: (session.user as any).id || `usr_${Buffer.from(email).toString("base64").substring(0, 10)}`,
        name,
        email,
        username: email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, ""),
        avatarUrl: session.user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
        role: (session.user as any).role || "STUDENT",
        connectedAccounts: {
          google: provider === "google" || !!user?.connectedAccounts?.google,
          github: provider === "github" || !!user?.connectedAccounts?.github,
        },
        accountStatus: "VERIFIED_STUDENT",
      });
    }
  }, [session, status, setUser]);

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionSync />
      {children}
    </SessionProvider>
  );
}
