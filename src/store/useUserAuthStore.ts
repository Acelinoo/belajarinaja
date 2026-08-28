import { create } from "zustand";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  avatarUrl?: string;
}

interface UserAuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
}

export const useUserAuthStore = create<UserAuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));
