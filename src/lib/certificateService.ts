import fs from "fs";
import path from "path";

export interface IssuedCertificate {
  certificateCode: string;
  userId: string;
  studentName: string;
  studentUsername: string;
  studentEmail?: string;
  issueDate: string;
  curriculumName: string;
  totalStages: number;
  totalLessons: number;
  passingGrade: string;
  status: "VERIFIED" | "REVOKED";
}

const CERT_REGISTRY_FILE = path.join(process.cwd(), "src", "data", "certificates_registry.json");

function loadCertRegistry(): Record<string, IssuedCertificate> {
  try {
    if (fs.existsSync(CERT_REGISTRY_FILE)) {
      const raw = fs.readFileSync(CERT_REGISTRY_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[CertificateService] Error loading registry file:", err);
  }

  // Pre-seed official Founding Credential for Marchelino Kurniawan
  const defaultRegistry: Record<string, IssuedCertificate> = {
    "CERT-BA-2026-W892K": {
      certificateCode: "CERT-BA-2026-W892K",
      userId: "usr_founder_acelino",
      studentName: "Marchelino Kurniawan",
      studentUsername: "acelino",
      studentEmail: "marchelino@belajarinaja.com",
      issueDate: "17 Desember 2025",
      curriculumName: "Modern Fullstack Web Development & Software Engineering",
      totalStages: 20,
      totalLessons: 116,
      passingGrade: "≥ 80% Passing Grade (Honors)",
      status: "VERIFIED",
    },
  };

  saveCertRegistry(defaultRegistry);
  return defaultRegistry;
}

function saveCertRegistry(registry: Record<string, IssuedCertificate>) {
  try {
    const dir = path.dirname(CERT_REGISTRY_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CERT_REGISTRY_FILE, JSON.stringify(registry, null, 2), "utf-8");
  } catch (err) {
    console.warn("[CertificateService] Error saving certificate registry:", err);
  }
}

const isDbActive = !!(
  process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes("[YOUR-PASSWORD]") &&
  !process.env.DATABASE_URL.includes("example")
);

async function getPrisma() {
  if (!isDbActive) return null;
  try {
    const mod = await import("@/lib/prisma");
    return mod.prisma;
  } catch (e) {
    return null;
  }
}

/**
 * Verifikasi sertifikat berdasarkan kode unik
 */
export async function verifyCertificate(code: string): Promise<IssuedCertificate | null> {
  if (!code || typeof code !== "string") return null;
  const normalizedCode = code.trim().toUpperCase();

  // 1. Coba periksa di Prisma Database jika tersedia
  try {
    const db = await getPrisma();
    if (db) {
      const dbCert = await db.certificate.findUnique({
        where: { certificateCode: normalizedCode },
        include: { user: true },
      });

      if (dbCert && dbCert.user) {
        return {
          certificateCode: dbCert.certificateCode,
          userId: dbCert.userId,
          studentName: dbCert.user.name,
          studentUsername: dbCert.user.username || "student",
          studentEmail: dbCert.user.email,
          issueDate: new Date(dbCert.issuedAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          curriculumName: "Modern Fullstack Web Development & Software Engineering",
          totalStages: 20,
          totalLessons: 116,
          passingGrade: "≥ 80% Passing Grade",
          status: "VERIFIED",
        };
      }
    }
  } catch (dbErr) {
    console.warn("[CertificateService] Prisma verify fallback:", dbErr);
  }

  // 2. Periksa di Registry Persisten
  const registry = loadCertRegistry();
  return registry[normalizedCode] || null;
}

/**
 * Dapatkan sertifikat pengguna yang sudah diterbitkan
 */
export async function getUserIssuedCertificate(userIdOrEmail: string): Promise<IssuedCertificate | null> {
  if (!userIdOrEmail) return null;
  const target = userIdOrEmail.toLowerCase().trim();

  const registry = loadCertRegistry();
  for (const cert of Object.values(registry)) {
    if (
      cert.userId.toLowerCase() === target ||
      (cert.studentEmail && cert.studentEmail.toLowerCase() === target)
    ) {
      return cert;
    }
  }

  // Periksa Prisma
  try {
    const db = await getPrisma();
    if (db) {
      const dbCert = await db.certificate.findFirst({
        where: {
          OR: [{ userId: target }, { user: { email: target } }],
        },
        include: { user: true },
      });

      if (dbCert && dbCert.user) {
        return {
          certificateCode: dbCert.certificateCode,
          userId: dbCert.userId,
          studentName: dbCert.user.name,
          studentUsername: dbCert.user.username || "student",
          studentEmail: dbCert.user.email,
          issueDate: new Date(dbCert.issuedAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          curriculumName: "Modern Fullstack Web Development & Software Engineering",
          totalStages: 20,
          totalLessons: 116,
          passingGrade: "≥ 80% Passing Grade",
          status: "VERIFIED",
        };
      }
    }
  } catch (dbErr) {
    console.warn("[CertificateService] Prisma getUserCertificate fallback:", dbErr);
  }

  return null;
}

/**
 * Terbitkan sertifikat baru yang unik untuk siswa yang telah menyelesaikan 116 materi
 */
export async function issueCertificateForStudent({
  userId,
  studentName,
  studentUsername,
  studentEmail,
  completedLessonsCount,
}: {
  userId: string;
  studentName: string;
  studentUsername: string;
  studentEmail?: string;
  completedLessonsCount: number;
}): Promise<IssuedCertificate> {
  // Validasi syarat kelulusan
  if (completedLessonsCount < 116) {
    throw new Error(
      `Kelulusan belum terpenuhi (${completedLessonsCount}/116 materi selesai). Selesaikan seluruh 116 materi untuk mengklaim sertifikat.`
    );
  }

  // Cek apakah sudah ada sertifikat sebelumnya
  const existing = await getUserIssuedCertificate(studentEmail || userId);
  if (existing) {
    return existing;
  }

  // Hasilkan kode sertifikat unik
  const blockA = Math.random().toString(36).substring(2, 6).toUpperCase();
  const blockB = Math.random().toString(36).substring(2, 6).toUpperCase();
  const certificateCode = `BA-2026-${blockA}-${blockB}`;

  const issueDateStr = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const newCertificate: IssuedCertificate = {
    certificateCode,
    userId,
    studentName: studentName.trim(),
    studentUsername: studentUsername.trim(),
    studentEmail: studentEmail?.trim(),
    issueDate: issueDateStr,
    curriculumName: "Modern Fullstack Web Development & Software Engineering",
    totalStages: 20,
    totalLessons: 116,
    passingGrade: "≥ 80% Passing Grade",
    status: "VERIFIED",
  };

  // Simpan ke Registry
  const registry = loadCertRegistry();
  registry[certificateCode] = newCertificate;
  saveCertRegistry(registry);

  // Simpan ke Prisma jika database aktif
  try {
    const db = await getPrisma();
    if (db) {
      await db.certificate.create({
        data: {
          certificateCode,
          userId,
          pathId: "fullstack-modern-2026",
          issuedAt: new Date(),
        },
      });
    }
  } catch (dbErr) {
    console.warn("[CertificateService] Prisma certificate create fallback:", dbErr);
  }

  return newCertificate;
}
