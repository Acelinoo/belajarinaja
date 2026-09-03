import { NextResponse } from "next/server";
import { isUsernameAvailable, cleanAndValidateUsername } from "@/lib/userRegistry";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const currentEmail = searchParams.get("currentEmail") || undefined;

    if (!username) {
      return NextResponse.json(
        { error: "Parameter username wajib disertakan" },
        { status: 400 }
      );
    }

    const { isValid, error, username: cleanUsername } = cleanAndValidateUsername(username);
    if (!isValid) {
      return NextResponse.json({
        available: false,
        error,
      });
    }

    const available = await isUsernameAvailable(cleanUsername, currentEmail);

    return NextResponse.json({
      available,
      username: cleanUsername,
      message: available
        ? "Username tersedia"
        : `Username '@${cleanUsername}' sudah digunakan oleh pengguna lain`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memeriksa ketersediaan username" },
      { status: 500 }
    );
  }
}
