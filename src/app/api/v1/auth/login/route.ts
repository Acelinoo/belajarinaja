import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan kata sandi wajib diisi" },
        { status: 400 }
      );
    }

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

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = cleanEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");

    // In production, verify with database / bcrypt
    const mockUser = {
      id: `usr_${Buffer.from(cleanEmail).toString("base64").substring(0, 10)}`,
      name: cleanUsername.replace(/[._]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
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
      message: "Login berhasil",
      user: mockUser,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memproses permintaan login" },
      { status: 500 }
    );
  }
}
