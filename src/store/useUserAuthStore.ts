import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ConnectedAccounts {
  google: boolean;
  github: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  avatarUrl?: string;
  bio?: string;
  dailyGoalMinutes?: number;
  createdAt?: string;
  connectedAccounts?: ConnectedAccounts;
  accountStatus?: "ACTIVE" | "VERIFIED_STUDENT";
}

interface UserAuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  connectAccount: (provider: "google" | "github") => void;
  disconnectAccount: (provider: "google" | "github") => void;
  setDailyGoal: (minutes: number) => void;
  logout: () => void;
  deleteAccount: () => void;
}

export const useUserAuthStore = create<UserAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) =>
        set({
          user: user
            ? {
                ...user,
                username: user.username || user.email.split("@")[0] || "developer",
                bio: user.bio || "Web Development Enthusiast di BelajarinAja",
                dailyGoalMinutes: user.dailyGoalMinutes || 30,
                createdAt: user.createdAt || new Date().toISOString(),
                connectedAccounts: user.connectedAccounts || { google: false, github: false },
                accountStatus: user.accountStatus || "VERIFIED_STUDENT",
              }
            : null,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      updateProfile: (data) =>
        set((state) => {
          const baseUser: UserProfile = state.user || {
            id: `usr_${Date.now()}`,
            name: data.name || "Pelajar Web",
            username: data.username || "developer",
            email: "student@belajarinaja.com",
            role: "STUDENT",
            bio: data.bio || "Web Development Enthusiast di BelajarinAja",
            avatarUrl: data.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=developer",
            dailyGoalMinutes: data.dailyGoalMinutes || 30,
            accountStatus: "VERIFIED_STUDENT",
            connectedAccounts: { google: false, github: false },
          };
          return {
            user: { ...baseUser, ...data },
            isAuthenticated: true,
          };
        }),

      connectAccount: (provider) =>
        set((state) => {
          if (!state.user) return state;
          const currentConnected = state.user.connectedAccounts || { google: false, github: false };
          return {
            user: {
              ...state.user,
              connectedAccounts: {
                google: provider === "google" ? true : !!currentConnected.google,
                github: provider === "github" ? true : !!currentConnected.github,
              },
            },
          };
        }),

      disconnectAccount: (provider) =>
        set((state) => {
          if (!state.user) return state;
          const currentConnected = state.user.connectedAccounts || { google: false, github: false };
          return {
            user: {
              ...state.user,
              connectedAccounts: {
                google: provider === "google" ? false : !!currentConnected.google,
                github: provider === "github" ? false : !!currentConnected.github,
              },
            },
          };
        }),

      setDailyGoal: (minutes) =>
        set((state) => ({
          user: state.user ? { ...state.user, dailyGoalMinutes: minutes } : null,
        })),

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        if (typeof window !== "undefined") {
          // Clear auth cookies / storage if any
          localStorage.removeItem("belajarinaja_auth_session");
        }
      },

      deleteAccount: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("belajarinaja_auth_session");
          localStorage.removeItem("belajarinaja_guest_progress");
        }
      },
    }),
    {
      name: "belajarinaja_auth_session",
    }
  )
);

export const useAuthStore = useUserAuthStore;
