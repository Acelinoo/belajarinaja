import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { claimUsername, cleanAndValidateUsername } from "@/lib/userRegistry";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");

    if (!emailParam) {
      return NextResponse.json(
        { error: "Parameter email diperlukan" },
        { status: 400 }
      );
    }

    const email = emailParam.toLowerCase().trim();

    // 1. Cek langsung dari Cloud Database Prisma
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        return NextResponse.json(
          {
            success: true,
            profile: {
              id: user.id,
              email: user.email,
              name: user.name,
              username: user.username || email.split("@")[0].replace(/[^a-z0-9_]/g, ""),
              avatarUrl: user.avatarUrl || user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
              bio: (user as any).bio || "Web Development Enthusiast di BelajarinAja",
              dailyGoalMinutes: (user as any).dailyGoalMinutes || 30,
              role: user.role,
              createdAt: user.createdAt.toISOString(),
            },
          },
          {
            headers: {
              "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            },
          }
        );
      }
    } catch (dbErr) {
      console.warn("[Profile API] Prisma query warning:", dbErr);
    }

    return NextResponse.json(
      { success: false, message: "Profil belum terdaftar" },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Gagal mengambil data profil" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email: rawEmail, name, username, bio, dailyGoalMinutes, avatarUrl } = body;

    if (!rawEmail) {
      return NextResponse.json(
        { error: "Alamat email diperlukan untuk memperbarui profil" },
        { status: 400 }
      );
    }

    const email = rawEmail.toLowerCase().trim();

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

    // Sinkronkan ke Prisma database
    let updatedUser: any = null;
    try {
      updatedUser = await (prisma.user as any).upsert({
        where: { email },
        update: {
          name: cleanName,
          username: cleanUsername,
          bio: cleanBio,
          dailyGoalMinutes: cleanMinutes,
          avatarUrl: typeof avatarUrl === "string" ? avatarUrl : undefined,
          image: typeof avatarUrl === "string" ? avatarUrl : undefined,
        },
        create: {
          email,
          name: cleanName,
          username: cleanUsername,
          bio: cleanBio,
          dailyGoalMinutes: cleanMinutes,
          avatarUrl: typeof avatarUrl === "string" ? avatarUrl : undefined,
          image: typeof avatarUrl === "string" ? avatarUrl : undefined,
          role: "STUDENT",
        },
      });
    } catch (dbErr) {
      console.warn("[Profile API] Prisma upsert error:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui dan disinkronkan ke Cloud Database",
      profile: updatedUser
        ? {
            id: updatedUser.id,
            name: updatedUser.name,
            username: updatedUser.username,
            bio: (updatedUser as any).bio,
            dailyGoalMinutes: (updatedUser as any).dailyGoalMinutes,
            avatarUrl: updatedUser.avatarUrl || updatedUser.image,
            email: updatedUser.email,
          }
        : {
            name: cleanName,
            username: cleanUsername,
            bio: cleanBio,
            dailyGoalMinutes: cleanMinutes,
            avatarUrl: typeof avatarUrl === "string" ? avatarUrl : undefined,
            email,
          },
    });
  } catch (error: any) {
    console.error("[Profile API] PUT error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal memperbarui profil pengguna" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { confirmation, email: rawEmail } = body;

    if (confirmation !== "HAPUS AKUN SAYA") {
      return NextResponse.json(
        { error: "Konfirmasi teks tidak cocok untuk menghapus akun" },
        { status: 400 }
      );
    }

    if (!rawEmail) {
      return NextResponse.json(
        { error: "Email diperlukan" },
        { status: 400 }
      );
    }

    const email = rawEmail.toLowerCase().trim();

    try {
      await prisma.user.deleteMany({
        where: { email },
      });
    } catch (dbErr) {
      console.warn("[Profile API] Prisma delete warning:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Akun dan seluruh data pembelajaran berhasil dihapus secara permanen.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Gagal menghapus akun" },
      { status: 500 }
    );
  }
}
