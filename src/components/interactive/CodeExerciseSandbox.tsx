"use client";

import React from "react";
import { RealSandboxEngine } from "./RealSandboxEngine";
import { getExerciseForLesson } from "@/data/lessonExercises";
import { SandboxExercise } from "@/lib/sandbox/sandboxTypes";

interface CodeExerciseSandboxProps {
  lessonId: string;
  exercise?: Partial<SandboxExercise>;
  onExercisePassed?: () => void;
}

export function CodeExerciseSandbox({
  lessonId,
  exercise,
  onExercisePassed,
}: CodeExerciseSandboxProps) {
  const fullExercise: SandboxExercise = getExerciseForLesson(
    lessonId,
    exercise?.lessonSlug || "lesson",
    exercise?.title || "Coding Challenge"
  );

  const mergedExercise: SandboxExercise = {
    ...fullExercise,
    ...(exercise || {}),
  } as SandboxExercise;

  return (
    <RealSandboxEngine
      lessonId={lessonId}
      exercise={mergedExercise}
      onExercisePassed={onExercisePassed}
    />
  );
}
