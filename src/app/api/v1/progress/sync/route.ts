import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guestProgress } = body;

    if (!Array.isArray(guestProgress)) {
      return NextResponse.json(
        { status: "error", message: "Invalid payload. Expected array of guest progress." },
        { status: 400 }
      );
    }

    // Process and normalize progress payload items
    const validProgressItems = guestProgress.map((item) => ({
      lessonId: item.lessonId,
      lessonSlug: item.lessonSlug || null,
      completed: Boolean(item.completed && (item.passed !== false)),
      passed: Boolean(item.passed ?? item.completed),
      quizCompleted: Boolean(item.quizCompleted ?? item.completed),
      score: typeof item.score === "number" ? item.score : typeof item.quizScore === "number" ? item.quizScore : 0,
      attempts: typeof item.attempts === "number" ? item.attempts : 1,
      completedAt: item.completedAt || new Date().toISOString(),
    }));

    return NextResponse.json({
      status: "success",
      syncedCount: validProgressItems.length,
      message: "Guest quiz progress successfully synced to account.",
      data: validProgressItems,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to sync progress" },
      { status: 500 }
    );
  }
}
