import { NextResponse } from "next/server";
import { issueCertificateForStudent, getUserIssuedCertificate } from "@/lib/certificateService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, studentName, studentUsername, studentEmail, completedLessonsCount } = body;

    if (!userId || !studentName || !studentUsername) {
      return NextResponse.json(
        { error: "Data pengguna tidak lengkap untuk menerbitkan sertifikat" },
        { status: 400 }
      );
    }

    // Check existing certificate
    const existing = await getUserIssuedCertificate(studentEmail || userId);
    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Sertifikat sudah pernah diterbitkan sebelumnya",
        certificate: existing,
      });
    }

    if (Number(completedLessonsCount) < 116) {
      return NextResponse.json(
        {
          error: `Syarat kelulusan belum terpenuhi (${completedLessonsCount || 0}/116 materi selesai). Selesaikan seluruh 116 materi untuk mengklaim sertifikat kelulusan.`,
        },
        { status: 403 }
      );
    }

    const certificate = await issueCertificateForStudent({
      userId,
      studentName,
      studentUsername,
      studentEmail,
      completedLessonsCount: Number(completedLessonsCount),
    });

    return NextResponse.json({
      success: true,
      message: "Sertifikat resmi berhasil diterbitkan",
      certificate,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Gagal menerbitkan sertifikat" },
      { status: 500 }
    );
  }
}
