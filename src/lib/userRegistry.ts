import fs from "fs";
import path from "path";

const REGISTRY_FILE = path.join(process.cwd(), "src", "data", "user_registry.json");

interface RegistryUser {
  email: string;
  username: string;
  name: string;
  registeredAt: string;
}

function loadRegistry(): Record<string, RegistryUser> {
  try {
    if (fs.existsSync(REGISTRY_FILE)) {
      const raw = fs.readFileSync(REGISTRY_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[UserRegistry] Error loading registry file:", err);
  }
  return {
    "marchelino@belajarinaja.com": {
      email: "marchelino@belajarinaja.com",
      username: "acelino",
      name: "Marchelino Kurniawan",
      registeredAt: "2025-01-01T00:00:00.000Z",
    },
  };
}

function saveRegistry(registry: Record<string, RegistryUser>) {
  try {
    const dir = path.dirname(REGISTRY_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2), "utf-8");
  } catch (err) {
    console.warn("[UserRegistry] Error saving registry file:", err);
  }
}

/**
 * Sanitasi & Validasi Format Username
 */
export function cleanAndValidateUsername(rawUsername: string): {
  isValid: boolean;
  username: string;
  error?: string;
} {
  const sanitized = (rawUsername || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, "");

  if (!sanitized || sanitized.length < 3) {
    return {
      isValid: false,
      username: sanitized,
      error: "Username minimal 3 karakter (hanya huruf kecil, angka, dan garis bawah)",
    };
  }

  if (sanitized.length > 25) {
    return {
      isValid: false,
      username: sanitized,
      error: "Username maksimal 25 karakter",
    };
  }

  return { isValid: true, username: sanitized };
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
 * Periksa ketersediaan username (apakah sudah diklaim pengguna lain)
 */
export async function isUsernameAvailable(
  targetUsername: string,
  excludeEmail?: string
): Promise<boolean> {
  const { isValid, username } = cleanAndValidateUsername(targetUsername);
  if (!isValid) return false;

  // 1. Periksa basis data Prisma jika aktif dan terkonfigurasi
  try {
    const db = await getPrisma();
    if (db) {
      const existingUser = await db.user.findFirst({
        where: {
          username,
          NOT: excludeEmail ? { email: excludeEmail } : undefined,
        },
      });
      if (existingUser) return false;
    }
  } catch (dbErr) {
    console.warn("[UserRegistry] Prisma check fallback:", dbErr);
  }

  // 2. Periksa file registry persisten
  const registry = loadRegistry();
  const normalizedExclude = (excludeEmail || "").toLowerCase().trim();

  for (const [email, entry] of Object.entries(registry)) {
    if (entry.username.toLowerCase() === username.toLowerCase()) {
      if (email.toLowerCase() !== normalizedExclude) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Klaim username untuk email tertentu
 */
export async function claimUsername(
  username: string,
  email: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  const { isValid, username: cleanUsername, error } = cleanAndValidateUsername(username);
  if (!isValid) {
    return { success: false, error };
  }

  const cleanEmail = email.toLowerCase().trim();
  const available = await isUsernameAvailable(cleanUsername, cleanEmail);

  if (!available) {
    return {
      success: false,
      error: `Username '@${cleanUsername}' sudah digunakan oleh akun lain. Silakan pilih username yang berbeda.`,
    };
  }

  // Simpan ke file registry
  const registry = loadRegistry();
  registry[cleanEmail] = {
    email: cleanEmail,
    username: cleanUsername,
    name: name.trim(),
    registeredAt: registry[cleanEmail]?.registeredAt || new Date().toISOString(),
  };
  saveRegistry(registry);

  // Sinkronkan ke Prisma jika aktif
  try {
    const db = await getPrisma();
    if (db) {
      await db.user.updateMany({
        where: { email: cleanEmail },
        data: { username: cleanUsername, name: name.trim() },
      });
    }
  } catch (err) {
    console.warn("[UserRegistry] Prisma claim sync warning:", err);
  }

  return { success: true };
}

/**
 * Hasilkan username unik jika terjadi bentrokan saat registrasi / OAuth
 */
export async function generateUniqueUsername(
  baseName: string,
  email?: string
): Promise<string> {
  let cleanBase = baseName
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .substring(0, 15);

  if (cleanBase.length < 3) {
    cleanBase = "dev_" + Math.random().toString(36).substring(2, 6);
  }

  if (await isUsernameAvailable(cleanBase, email)) {
    return cleanBase;
  }

  // Tambahkan angka acak hingga unik
  let attempt = 1;
  while (attempt <= 20) {
    const candidate = `${cleanBase}_${Math.floor(100 + Math.random() * 900)}`;
    if (await isUsernameAvailable(candidate, email)) {
      return candidate;
    }
    attempt++;
  }

  return `${cleanBase}_${Date.now().toString().slice(-4)}`;
}
