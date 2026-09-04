import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const stat = await (prisma as any).siteStat.findUnique({
      where: { key: "page_views" },
    });

    return NextResponse.json(
      {
        success: true,
        views: stat?.value || 0,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("[Stats API] GET error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal mengambil statistik views", views: 0 },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const stat = await (prisma as any).siteStat.upsert({
      where: { key: "page_views" },
      update: {
        value: { increment: 1 },
      },
      create: {
        key: "page_views",
        value: 1,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "View counter incremented",
        views: stat.value,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("[Stats API] POST error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal memperbarui views" },
      { status: 500 }
    );
  }
}
