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

    const cleanEmail = email ? email.trim().toLowerCase() : `${provider}.user@belajarinaja.com`;
    const cleanName = name ? (name || "").replace(/[<>]/g, "").trim() : (provider === "google" ? "Google Developer" : "GitHub Contributor");
    const cleanUsername = cleanEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");

    const oauthUser = {
      id: `usr_${provider}_${Buffer.from(cleanEmail).toString("base64").substring(0, 10)}`,
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      role: "STUDENT" as const,
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${provider}_${cleanEmail}`,
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
