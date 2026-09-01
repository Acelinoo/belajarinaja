"use client";

import React from "react";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { FunNavbar } from "@/components/fun/FunNavbar";
import { DarkCommandNavbar } from "@/components/dark/DarkCommandNavbar";
import { LightNeoNavbar } from "@/components/light/LightNeoNavbar";

export function Navbar() {
  const { theme } = useThemeLanguageStore();

  if (theme === "fun") {
    return <FunNavbar />;
  }

  if (theme === "dark") {
    return <DarkCommandNavbar />;
  }

  return <LightNeoNavbar />;
}
