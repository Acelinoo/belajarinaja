import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const queryEmail = searchParams.get("email");

    const email = (session?.user?.email || queryEmail || "").toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Parameter email atau sesi login diperlukan" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        progress: {
          include: {
            lesson: {
              select: {
                id: true,
                slug: true,
              },
            },
          },
        },
        bookmarks: {
          select: {
            lessonId: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        completedLessons: {},
        bookmarkedLessons: [],
      });
    }

    const completedLessons: Record<string, any> = {};
    for (const p of user.progress) {
      completedLessons[p.lessonId] = {
        lessonId: p.lessonId,
        lessonSlug: p.lesson?.slug || undefined,
        completed: p.status === "COMPLETED",
        passed: p.status === "COMPLETED",
        quizStarted: true,
        quizCompleted: true,
        score: p.quizScore ?? 100,
        quizScore: p.quizScore ?? 100,
        attempts: 1,
        completedAt: p.completedAt?.toISOString() || new Date().toISOString(),
      };
    }

    const bookmarkedLessons = user.bookmarks.map((b) => b.lessonId);

    return NextResponse.json({
      success: true,
      completedLessons,
      bookmarkedLessons,
    });
  } catch (error: any) {
    console.error("[Progress API] GET error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal mengambil data progres" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const {
      email: bodyEmail,
      lessonId,
      lessonSlug,
      score,
      quizScore,
      passed,
      completedAt,
    } = body;

    const email = (session?.user?.email || bodyEmail || "").toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email atau sesi login diperlukan untuk menyimpan progres" },
        { status: 401 }
      );
    }

    if (!lessonId) {
      return NextResponse.json(
        { success: false, error: "Parameter lessonId diperlukan" },
        { status: 400 }
      );
    }

    // 1. Dapatkan atau buat data pengguna di database
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

    // 2. Dapatkan data pelajaran yang valid dari database
    let lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson && lessonSlug) {
      lesson = await prisma.lesson.findUnique({
        where: { slug: lessonSlug },
      });
    }

    if (!lesson) {
      // Cari jika ada kecocokan id atau slug di tabel lesson
      lesson = await prisma.lesson.findFirst({
        where: {
          OR: [{ id: lessonId }, { slug: lessonSlug || lessonId }],
        },
      });
    }

    const targetLessonId = lesson ? lesson.id : lessonId;
    const isPassed = Boolean(passed);
    const finalScore =
      typeof score === "number"
        ? score
        : typeof quizScore === "number"
        ? quizScore
        : 100;
    const completionDate = completedAt ? new Date(completedAt) : new Date();

    // 3. Simpan / Perbarui UserProgress di Prisma
    const progressRecord = await prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: targetLessonId,
        },
      },
      update: {
        status: isPassed ? "COMPLETED" : "IN_PROGRESS",
        quizScore: finalScore,
        completedAt: isPassed ? completionDate : undefined,
      },
      create: {
        userId: user.id,
        lessonId: targetLessonId,
        status: isPassed ? "COMPLETED" : "IN_PROGRESS",
        quizScore: finalScore,
        completedAt: isPassed ? completionDate : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Progres materi berhasil disimpan ke Cloud Database",
      data: progressRecord,
    });
  } catch (error: any) {
    console.error("[Progress API] POST error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal menyimpan progres" },
      { status: 500 }
    );
  }
}
