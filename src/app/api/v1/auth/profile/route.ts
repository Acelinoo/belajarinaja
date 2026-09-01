import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, username, bio, dailyGoalMinutes, avatarUrl } = body;

    // Validate inputs
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Nama lengkap minimal 2 karakter" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui",
      updatedData: {
        name: name.trim(),
        username: username?.trim(),
        bio: bio?.trim(),
        dailyGoalMinutes: Number(dailyGoalMinutes) || 30,
        avatarUrl,
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
