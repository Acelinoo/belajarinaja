"use client";

import React, { useState } from "react";
import { useThemeLanguageStore } from "@/store/useThemeLanguageStore";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchCommandModal } from "@/components/common/SearchCommandModal";
import { FunRoadmapMap } from "@/components/fun/FunRoadmapMap";
import { DarkCommandRoadmap } from "@/components/dark/DarkCommandRoadmap";
import { LightNeoRoadmap } from "@/components/light/LightNeoRoadmap";

const CATEGORIES = [
  "ALL",
  "Web Fundamentals",
  "HTML5 Semantic",
  "Modern CSS",
  "JavaScript Core",
  "TypeScript Core",
  "React Modern",
  "Next.js 15 App Router",
  "Database & Backend",
  "Keamanan & Capstone",
];

export default function RoadmapPage() {
  const { theme } = useThemeLanguageStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  return (
    <div className={`min-h-screen flex flex-col ${
      theme === "fun"
        ? "bg-[#FFF8E7] text-[#243447]"
        : theme === "dark"
        ? "bg-[#050505] text-[#FFFFFF]"
        : "bg-[#F7F4EA] text-[#121212]"
    }`}>
      <Navbar />
      <SearchCommandModal />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {theme === "fun" ? (
            <FunRoadmapMap />
          ) : theme === "dark" ? (
            <DarkCommandRoadmap />
          ) : (
            <LightNeoRoadmap
              search={search}
              setSearch={setSearch}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={CATEGORIES}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
