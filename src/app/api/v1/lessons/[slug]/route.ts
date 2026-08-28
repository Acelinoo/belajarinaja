import { NextRequest, NextResponse } from "next/server";
import { CURRICULUM_STAGES } from "@/data/curriculum";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    let foundLesson = null;

    for (const stage of CURRICULUM_STAGES) {
      const match = stage.lessons.find((l) => l.slug === slug);
      if (match) {
        foundLesson = match;
        break;
      }
    }

    if (!foundLesson) {
      return NextResponse.json(
        { status: "error", message: "Lesson not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: foundLesson,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
