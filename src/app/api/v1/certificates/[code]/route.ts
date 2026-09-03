import { NextResponse } from "next/server";
import { verifyCertificate } from "@/lib/certificateService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const resolvedParams = await params;
    const code = resolvedParams.code;

    if (!code) {
      return NextResponse.json(
        { valid: false, error: "Nomor sertifikat wajib diisi" },
        { status: 400 }
      );
    }

    const certificate = await verifyCertificate(code);

    if (!certificate) {
      return NextResponse.json(
        {
          valid: false,
          error: "Sertifikat tidak ditemukan atau belum terdaftar dalam sistem akreditasi",
          code: code.toUpperCase(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      certificate,
    });
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: "Gagal memverifikasi sertifikat" },
      { status: 500 }
    );
  }
}
