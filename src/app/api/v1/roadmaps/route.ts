import { NextResponse } from "next/server";
import { CURRICULUM_STAGES } from "@/data/curriculum";

export async function GET() {
  try {
    return NextResponse.json({
      status: "success",
      data: CURRICULUM_STAGES,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch roadmap stages" },
      { status: 500 }
    );
  }
}
