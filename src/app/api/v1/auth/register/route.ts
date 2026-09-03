import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  claimUsername,
  generateUniqueUsername,
  cleanAndValidateUsername,
  isUsernameAvailable,
} from "@/lib/userRegistry";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, username: requestedUsername } = body;

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

    // Check if email already registered in Prisma
    try {
      if (process.env.DATABASE_URL) {
        const existingEmail = await prisma.user.findUnique({
          where: { email: cleanEmail },
        });
        if (existingEmail) {
          return NextResponse.json(
            { error: "Alamat email ini sudah terdaftar. Silakan login." },
            { status: 409 }
          );
        }
      }
    } catch (e) {
      console.warn("[Register API] Prisma email check warning:", e);
    }

    let finalUsername = "";
    if (requestedUsername) {
      const { isValid, username, error } = cleanAndValidateUsername(requestedUsername);
      if (!isValid) {
        return NextResponse.json({ error: error || "Format username tidak valid" }, { status: 400 });
      }
      const available = await isUsernameAvailable(username, cleanEmail);
      if (!available) {
        return NextResponse.json(
          { error: `Username '@${username}' sudah digunakan oleh akun lain. Silakan pilih username yang berbeda.` },
          { status: 409 }
        );
      }
      finalUsername = username;
    } else {
      finalUsername = await generateUniqueUsername(cleanEmail.split("@")[0], cleanEmail);
    }

    // Claim username in registry
    await claimUsername(finalUsername, cleanEmail, cleanName);

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Sync to Prisma DB if active
    try {
      if (process.env.DATABASE_URL) {
        await prisma.user.create({
          data: {
            id: userId,
            name: cleanName,
            email: cleanEmail,
            username: finalUsername,
            role: "STUDENT",
            avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
          },
        });
      }
    } catch (dbErr) {
      console.warn("[Register API] Prisma user create fallback:", dbErr);
    }

    const newUser = {
      id: userId,
      name: cleanName,
      username: finalUsername,
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
