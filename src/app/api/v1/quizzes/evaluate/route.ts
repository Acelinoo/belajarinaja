import { NextRequest, NextResponse } from "next/server";
import { CURRICULUM_STAGES } from "@/data/curriculum";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lessonId, answers } = body;

    if (!lessonId || typeof answers !== "object") {
      return NextResponse.json(
        { status: "error", message: "Invalid payload. Required lessonId and answers map." },
        { status: 400 }
      );
    }

    let targetLesson = null;
    for (const stage of CURRICULUM_STAGES) {
      const match = stage.lessons.find((l) => l.id === lessonId);
      if (match) {
        targetLesson = match;
        break;
      }
    }

    if (!targetLesson) {
      return NextResponse.json(
        { status: "error", message: "Lesson not found" },
        { status: 404 }
      );
    }

    let correctCount = 0;
    const total = targetLesson.quizzes.length;
    const breakdown = targetLesson.quizzes.map((quiz) => {
      const userSelected = answers[quiz.id];
      const isCorrect = userSelected === quiz.correctIndex;
      if (isCorrect) correctCount++;

      return {
        quizId: quiz.id,
        isCorrect,
        correctIndex: quiz.correctIndex,
        explanation: quiz.explanation,
      };
    });

    const score = total > 0 ? Math.round((correctCount / total) * 100) : 100;
    const passed = score >= 80;

    return NextResponse.json({
      status: "success",
      score,
      passed,
      breakdown,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to evaluate quiz" },
      { status: 500 }
    );
  }
}
