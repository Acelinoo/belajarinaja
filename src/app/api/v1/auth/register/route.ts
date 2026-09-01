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

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      username: email.split("@")[0],
      email: email.trim().toLowerCase(),
      role: "STUDENT" as const,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
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
