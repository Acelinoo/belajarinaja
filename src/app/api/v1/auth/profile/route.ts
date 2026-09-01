import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    let { name, username, bio, dailyGoalMinutes, avatarUrl } = body;

    // Validate and sanitize inputs
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Nama lengkap minimal 2 karakter" },
        { status: 400 }
      );
    }

    // Sanitize string fields to prevent XSS / HTML injection
    const sanitize = (str?: string) =>
      (str || "").replace(/[<>]/g, "").trim();

    const cleanName = sanitize(name);
    const cleanUsername = sanitize(username).toLowerCase().replace(/[^a-z0-9_]/g, "");
    const cleanBio = sanitize(bio).substring(0, 300); // cap at 300 chars

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui",
      updatedData: {
        name: cleanName,
        username: cleanUsername,
        bio: cleanBio,
        dailyGoalMinutes: Math.min(120, Math.max(10, Number(dailyGoalMinutes) || 30)),
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
    const { confirmation } = body;

    if (confirmation !== "HAPUS AKUN SAYA") {
      return NextResponse.json(
        { error: "Konfirmasi teks tidak cocok untuk menghapus akun" },
        { status: 400 }
      );
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
