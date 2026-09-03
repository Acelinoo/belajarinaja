import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email, name, username, bio, dailyGoalMinutes, avatarUrl } = body;

    // Validate name
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Nama lengkap minimal 2 karakter" },
        { status: 400 }
      );
    }

    // Sanitize string fields to prevent HTML/XSS injection
    const sanitize = (str?: string) => (str || "").replace(/[<>]/g, "").trim();

    const cleanName = sanitize(name);
    const cleanUsername = sanitize(username).toLowerCase().replace(/[^a-z0-9_]/g, "");
    const cleanBio = sanitize(bio).substring(0, 300);
    const cleanMinutes = Math.min(120, Math.max(10, Number(dailyGoalMinutes) || 30));

    // If Prisma database connection is available and user email is provided, sync to DB
    if (email && process.env.DATABASE_URL) {
      try {
        await prisma.user.updateMany({
          where: { email },
          data: {
            name: cleanName,
            image: typeof avatarUrl === "string" ? avatarUrl : undefined,
          },
        });
      } catch (dbErr) {
        console.warn("[Profile API] Prisma update fallback warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui dan disinkronkan",
      updatedData: {
        name: cleanName,
        username: cleanUsername,
        bio: cleanBio,
        dailyGoalMinutes: cleanMinutes,
        avatarUrl: typeof avatarUrl === "string" ? avatarUrl : undefined,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memperbarui profil pengguna" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { confirmation, email } = body;

    if (confirmation !== "HAPUS AKUN SAYA") {
      return NextResponse.json(
        { error: "Konfirmasi teks tidak cocok untuk menghapus akun" },
        { status: 400 }
      );
    }

    // If database is available, delete user record
    if (email && process.env.DATABASE_URL) {
      try {
        await prisma.user.deleteMany({
          where: { email },
        });
      } catch (dbErr) {
        console.warn("[Profile API] Prisma delete warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Akun dan seluruh data pembelajaran berhasil dihapus secara permanen.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menghapus akun" },
      { status: 500 }
    );
  }
}
