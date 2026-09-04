import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { guestProgress, bookmarkedLessons = [], email: bodyEmail } = body;

    const email = (session?.user?.email || bodyEmail || "").toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { status: "error", message: "Email atau sesi autentikasi diperlukan untuk sinkronisasi." },
        { status: 401 }
      );
    }

    // Normalisasi input guestProgress (bisa array atau object record)
    let progressList: any[] = [];
    if (Array.isArray(guestProgress)) {
      progressList = guestProgress;
    } else if (guestProgress && typeof guestProgress === "object") {
      progressList = Object.values(guestProgress);
    }

    // 1. Dapatkan atau daftarkan akun user di database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const cleanUsername = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");
      user = await prisma.user.create({
        data: {
          email,
          name: cleanUsername || "Pelajar",
          username: cleanUsername,
          role: "STUDENT",
        },
      });
    }

    // 2. Simpan setiap progres materi tamu/lokal ke Cloud Database
    let syncedCount = 0;
    for (const item of progressList) {
      if (!item?.lessonId) continue;

      const isCompleted = Boolean(item.completed || item.passed);
      const score =
        typeof item.score === "number"
          ? item.score
          : typeof item.quizScore === "number"
          ? item.quizScore
          : 100;
      const completedAtDate = item.completedAt ? new Date(item.completedAt) : new Date();

      // Pastikan lesson ada
      let lesson = await prisma.lesson.findUnique({
        where: { id: item.lessonId },
      });
      if (!lesson && item.lessonSlug) {
        lesson = await prisma.lesson.findUnique({
          where: { slug: item.lessonSlug },
        });
      }

      const targetLessonId = lesson ? lesson.id : item.lessonId;

      try {
        await prisma.userProgress.upsert({
          where: {
            userId_lessonId: {
              userId: user.id,
              lessonId: targetLessonId,
            },
          },
          update: {
            status: isCompleted ? "COMPLETED" : "IN_PROGRESS",
            quizScore: score,
            completedAt: isCompleted ? completedAtDate : undefined,
          },
          create: {
            userId: user.id,
            lessonId: targetLessonId,
            status: isCompleted ? "COMPLETED" : "IN_PROGRESS",
            quizScore: score,
            completedAt: isCompleted ? completedAtDate : null,
          },
        });
        syncedCount++;
      } catch (upsertErr) {
        console.warn(`[Sync API] Gagal sync materi ${item.lessonId}:`, upsertErr);
      }
    }

    // 3. Simpan bookmarks jika disediakan
    if (Array.isArray(bookmarkedLessons)) {
      for (const lessonId of bookmarkedLessons) {
        try {
          await prisma.bookmark.upsert({
            where: {
              userId_lessonId: {
                userId: user.id,
                lessonId,
              },
            },
            update: {},
            create: {
              userId: user.id,
              lessonId,
            },
          });
        } catch (bErr) {}
      }
    }

    // 4. Ambil seluruh data gabungan terbaru dari database
    const refreshedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        progress: {
          include: {
            lesson: {
              select: { slug: true },
            },
          },
        },
        bookmarks: {
          select: { lessonId: true },
        },
      },
    });

    const allCompletedLessons: Record<string, any> = {};
    refreshedUser?.progress.forEach((p) => {
      allCompletedLessons[p.lessonId] = {
        lessonId: p.lessonId,
        lessonSlug: p.lesson?.slug || undefined,
        completed: p.status === "COMPLETED",
        passed: p.status === "COMPLETED",
        quizStarted: true,
        quizCompleted: true,
        score: p.quizScore ?? 100,
        quizScore: p.quizScore ?? 100,
        completedAt: p.completedAt?.toISOString() || new Date().toISOString(),
        attempts: 1,
      };
    });

    const allBookmarkedLessons = (refreshedUser?.bookmarks || []).map((b) => b.lessonId);

    return NextResponse.json({
      status: "success",
      syncedCount,
      message: `Berhasil menyinkronkan ${syncedCount} materi ke akun Anda.`,
      completedLessons: allCompletedLessons,
      bookmarkedLessons: allBookmarkedLessons,
    });
  } catch (error: any) {
    console.error("[Sync API] Error:", error);
    return NextResponse.json(
      { status: "error", message: error?.message || "Gagal menyinkronkan progres" },
      { status: 500 }
    );
  }
}
