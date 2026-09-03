import { PrismaClient } from "@prisma/client";
import { CURRICULUM_STAGES } from "../src/data/curriculum";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai proses seeding database BelajarinAja...");

  for (const stageData of CURRICULUM_STAGES) {
    console.log(`📦 Seeding Stage ${stageData.orderIndex}: ${stageData.titleId}`);

    const stage = await prisma.stage.upsert({
      where: { orderIndex: stageData.orderIndex },
      update: {
        titleId: stageData.titleId,
        titleEn: stageData.titleEn,
        description: stageData.description,
      },
      create: {
        id: stageData.id,
        orderIndex: stageData.orderIndex,
        titleId: stageData.titleId,
        titleEn: stageData.titleEn,
        description: stageData.description,
      },
    });

    for (const lessonData of stageData.lessons) {
      const lesson = await prisma.lesson.upsert({
        where: { slug: lessonData.slug },
        update: {
          title: lessonData.title,
          contentMd: lessonData.contentMd,
          level: lessonData.level,
          prerequisiteIds: lessonData.prerequisites || [],
          estimatedMinutes: lessonData.estimatedMinutes || 15,
          stageId: stage.id,
        },
        create: {
          id: lessonData.id,
          stageId: stage.id,
          slug: lessonData.slug,
          title: lessonData.title,
          contentMd: lessonData.contentMd,
          level: lessonData.level,
          prerequisiteIds: lessonData.prerequisites || [],
          estimatedMinutes: lessonData.estimatedMinutes || 15,
        },
      });

      // Seeding quizzes
      if (lessonData.quizzes && lessonData.quizzes.length > 0) {
        // Hapus kuis lama untuk replace yang terbaru
        await prisma.quiz.deleteMany({
          where: { lessonId: lesson.id },
        });

        for (const quizData of lessonData.quizzes) {
          await prisma.quiz.create({
            data: {
              lessonId: lesson.id,
              question: quizData.question,
              options: quizData.options,
              correctIndex: quizData.correctIndex,
              explanation: quizData.explanation,
            },
          });
        }
      }

      // Seeding exercise
      if (lessonData.exercise) {
        await prisma.exercise.deleteMany({
          where: { lessonId: lesson.id },
        });

        await prisma.exercise.create({
          data: {
            lessonId: lesson.id,
            prompt: lessonData.exercise.prompt,
            starterCode: lessonData.exercise.starterCode,
            solutionCode: lessonData.exercise.solutionCode,
            expectedOutput: lessonData.exercise.expectedOutput,
          },
        });
      }
    }
  }

  console.log("✅ Seeding selesai! Seluruh 20 stage, modul materi, kuis, dan exercise berhasil dimasukkan ke database.");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
