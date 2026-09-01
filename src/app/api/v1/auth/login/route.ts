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

    // In production, verify with database / bcrypt
    const mockUser = {
      id: `usr_${Buffer.from(email).toString("base64").substring(0, 10)}`,
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
      username: email.split("@")[0],
      email: email,
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
