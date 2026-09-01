import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan kata sandi wajib diisi" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Format alamat email tidak valid" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Kata sandi minimal 8 karakter" },
        { status: 400 }
      );
    }

    const cleanName = (name || "").replace(/[<>]/g, "").trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = cleanEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      role: "STUDENT" as const,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
      bio: "Pelajar Web Development di BelajarinAja",
      dailyGoalMinutes: 30,
      createdAt: new Date().toISOString(),
      connectedAccounts: {
        google: false,
        github: false,
      },
      accountStatus: "VERIFIED_STUDENT" as const,
    };

    return NextResponse.json({
      success: true,
      message: "Akun berhasil didaftarkan",
      user: newUser,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memproses pendaftaran akun" },
      { status: 500 }
    );
  }
}
