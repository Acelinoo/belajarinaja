import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, email, name, avatarUrl } = body;

    if (!provider || !["google", "github"].includes(provider)) {
      return NextResponse.json(
        { error: "Provider OAuth tidak valid (hanya mendukung Google & GitHub)" },
        { status: 400 }
      );
    }

    const oauthUser = {
      id: `usr_${provider}_${Date.now().toString(36)}`,
      name: name || (provider === "google" ? "Google Developer" : "GitHub Contributor"),
      username: email ? email.split("@")[0] : `dev_${provider}`,
      email: email || `${provider}.user@belajarinaja.com`,
      role: "STUDENT" as const,
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${provider}_${email || "dev"}`,
      bio: `Pelajar Web Development via ${provider === "google" ? "Google Account" : "GitHub"}`,
      dailyGoalMinutes: 30,
      createdAt: new Date().toISOString(),
      connectedAccounts: {
        google: provider === "google",
        github: provider === "github",
      },
      accountStatus: "VERIFIED_STUDENT" as const,
    };

    return NextResponse.json({
      success: true,
      message: `Autentikasi ${provider === "google" ? "Google" : "GitHub"} berhasil`,
      user: oauthUser,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memproses autentikasi OAuth" },
      { status: 500 }
    );
  }
}
