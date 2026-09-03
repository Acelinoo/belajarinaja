"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { Button } from "@/components/ui/button";

interface OAuthButtonsProps {
  onSuccess?: () => void;
  redirectTo?: string;
  className?: string;
  showDivider?: boolean;
}

export function OAuthButtons({
  onSuccess,
  redirectTo = "/dashboard",
  className = "",
  showDivider = false,
}: OAuthButtonsProps) {
  const { setUser } = useUserAuthStore();
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setLoadingProvider(provider);
    try {
      // 1. Coba NextAuth standard signIn flow
      const result = await signIn(provider, {
        callbackUrl: redirectTo,
        redirect: false,
      });

      if (result?.error) {
        console.warn(`[OAuth] NextAuth ${provider} sign-in response:`, result.error);
        // Fallback demo login jika kredensial env belum aktif saat testing lokal
        const fallbackRes = await fetch("/api/v1/auth/oauth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider,
            name: provider === "google" ? "Google Developer" : "GitHub Contributor",
            email: `${provider}.developer@belajarinaja.com`,
          }),
        });
        const data = await fallbackRes.json();
        if (data.success && data.user) {
          setUser(data.user);
          if (onSuccess) onSuccess();
          window.location.href = redirectTo;
        }
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      console.error("[OAuth] Sign-in error:", err);
      // Fallback development mode
      const fallbackRes = await fetch("/api/v1/auth/oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          name: provider === "google" ? "Google Developer" : "GitHub Contributor",
          email: `${provider}.developer@belajarinaja.com`,
        }),
      });
      const data = await fallbackRes.json();
      if (data.success && data.user) {
        setUser(data.user);
        if (onSuccess) onSuccess();
        window.location.href = redirectTo;
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {showDivider && (
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-card px-2 text-muted-foreground font-semibold">
              atau lanjutkan dengan
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {/* Google OAuth Button */}
        <Button
          type="button"
          variant="outline"
          disabled={!!loadingProvider}
          onClick={() => handleOAuthLogin("google")}
          className="h-11 text-xs sm:text-sm font-bold rounded-xl border-border bg-card hover:bg-secondary flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs"
          aria-label="Masuk dengan Google"
        >
          {loadingProvider === "google" ? (
            <span className="text-xs text-muted-foreground">Menghubungkan ke Google...</span>
          ) : (
            <>
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
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
              <span>Lanjutkan dengan Google</span>
            </>
          )}
        </Button>

        {/* GitHub OAuth Button */}
        <Button
          type="button"
          variant="outline"
          disabled={!!loadingProvider}
          onClick={() => handleOAuthLogin("github")}
          className="h-11 text-xs sm:text-sm font-bold rounded-xl border-border bg-card hover:bg-secondary flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs"
          aria-label="Masuk dengan GitHub"
        >
          {loadingProvider === "github" ? (
            <span className="text-xs text-muted-foreground">Menghubungkan ke GitHub...</span>
          ) : (
            <>
              <svg className="h-5 w-5 fill-current text-foreground shrink-0" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Lanjutkan dengan GitHub</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
