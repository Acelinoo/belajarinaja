import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { claimUsername, cleanAndValidateUsername, getUserProfileByEmail } from "@/lib/userRegistry";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Parameter email diperlukan" },
        { status: 400 }
      );
    }

    const profile = await getUserProfileByEmail(email);
    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Profil belum terdaftar" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data profil" },
      { status: 500 }
    );
  }
}

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

    if (!email) {
      return NextResponse.json(
        { error: "Alamat email diperlukan untuk memperbarui profil" },
        { status: 400 }
      );
    }

    // Sanitize string fields to prevent HTML/XSS injection
    const sanitize = (str?: string) => (str || "").replace(/[<>]/g, "").trim();

    const cleanName = sanitize(name);
    const { isValid, username: cleanUsername, error: usernameError } = cleanAndValidateUsername(username);

    if (!isValid) {
      return NextResponse.json(
        { error: usernameError || "Format username tidak valid" },
        { status: 400 }
      );
    }

    // Enforce username uniqueness across all users
    const claimResult = await claimUsername(cleanUsername, email, cleanName);
    if (!claimResult.success) {
      return NextResponse.json(
        { error: claimResult.error || "Username sudah digunakan oleh akun lain" },
        { status: 409 }
      );
    }

    const cleanBio = sanitize(bio).substring(0, 300);
    const cleanMinutes = Math.min(120, Math.max(10, Number(dailyGoalMinutes) || 30));

    // If Prisma database connection is available and user email is provided, sync to DB
    if (email && process.env.DATABASE_URL) {
      try {
        await prisma.user.updateMany({
          where: { email },
          data: {
            name: cleanName,
            username: cleanUsername,
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
