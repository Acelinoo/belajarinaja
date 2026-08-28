import { NextRequest, NextResponse } from "next/server";
import { CURRICULUM_STAGES } from "@/data/curriculum";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = (searchParams.get("q") || "").toLowerCase();
    const level = searchParams.get("level");
    const category = searchParams.get("category");

    const results: Array<{
      id: string;
      title: string;
      slug: string;
      level: string;
      stageTitle: string;
      category: string;
    }> = [];

    for (const stage of CURRICULUM_STAGES) {
      if (category && category !== "ALL" && stage.category !== category) {
        continue;
      }

      for (const lesson of stage.lessons) {
        if (level && level !== "ALL" && lesson.level !== level) {
          continue;
        }

        const matchTitle = lesson.title.toLowerCase().includes(query);
        const matchDesc = lesson.description.toLowerCase().includes(query);
        const matchContent = lesson.contentMd.toLowerCase().includes(query);

        if (!query || matchTitle || matchDesc || matchContent) {
          results.push({
            id: lesson.id,
            title: lesson.title,
            slug: lesson.slug,
            level: lesson.level,
            stageTitle: stage.titleId,
            category: stage.category,
          });
        }
      }
    }

    return NextResponse.json({
      status: "success",
      total: results.length,
      data: results,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Search failed" },
      { status: 500 }
    );
  }
}
