import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Demo Account",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        name: { label: "Name", type: "text", placeholder: "Nama Pengguna" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        return {
          id: `demo_${Date.now()}`,
          name: credentials.name || "Pelajar BelajarinAja",
          email: credentials.email,
          image: `https://api.dicebear.com/7.x/bottts/svg?seed=${credentials.email}`,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      // Sinkronisasi data user ke Prisma database secara aman (dengan fallback jika DB offline)
      try {
        if (process.env.DATABASE_URL) {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          const provider = account?.provider || "credentials";
          const providerId = account?.providerAccountId || null;
          const cleanUsername = user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");

          if (existingUser) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name || existingUser.name,
                avatarUrl: user.image || existingUser.avatarUrl,
                provider: existingUser.provider || provider,
                providerId: existingUser.providerId || providerId,
              },
            });
          } else {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || cleanUsername || "Pelajar",
                username: `${cleanUsername}_${Math.floor(1000 + Math.random() * 9000)}`,
                avatarUrl: user.image,
                provider,
                providerId,
                role: "STUDENT",
              },
            });
          }
        }
      } catch (err) {
        console.warn("[Auth] DB sync skipped or database unavailable:", err);
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.provider = account?.provider || "credentials";
        token.role = "STUDENT";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).provider = token.provider;
        (session.user as any).role = token.role || "STUDENT";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "belajarinaja-super-secret-key-32-chars-long",
};
