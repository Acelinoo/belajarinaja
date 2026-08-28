import { CURRICULUM_STAGES } from "../src/data/curriculum";

interface AuditResult {
  totalStages: number;
  totalLessons: number;
  totalQuizzes: number;
  totalQuestions: number;
  minQuestionsPerQuiz: number;
  maxQuestionsPerQuiz: number;
  lessonsWithoutQuiz: number;
  quizzesBelow3Questions: number;
  invalidQuizQuestions: number;
  missingExplanations: number;
  brokenPrerequisites: number;
  stageBreakdown: Array<{
    stageOrder: number;
    stageTitle: string;
    lessonCount: number;
    questionCount: number;
  }>;
}

export function validateCurriculum(): AuditResult {
  const allSlugs = new Set<string>();
  const allLessonIds = new Set<string>();

  let totalLessons = 0;
  let totalQuizzes = 0;
  let totalQuestions = 0;
  let minQuestionsPerQuiz = Infinity;
  let maxQuestionsPerQuiz = 0;
  let lessonsWithoutQuiz = 0;
  let quizzesBelow3Questions = 0;
  let invalidQuizQuestions = 0;
  let missingExplanations = 0;
  let brokenPrerequisites = 0;

  // First pass: collect all slugs and IDs
  CURRICULUM_STAGES.forEach((stage) => {
    stage.lessons.forEach((lesson) => {
      allSlugs.add(lesson.slug);
      allLessonIds.add(lesson.id);
    });
  });

  const stageBreakdown: AuditResult["stageBreakdown"] = [];

  // Second pass: audit every stage and lesson
  CURRICULUM_STAGES.forEach((stage) => {
    let stageQuestionCount = 0;

    stage.lessons.forEach((lesson) => {
      totalLessons++;

      // Check quizzes array existence
      if (!lesson.quizzes || lesson.quizzes.length === 0) {
        lessonsWithoutQuiz++;
      } else {
        totalQuizzes++;
        const qCount = lesson.quizzes.length;
        totalQuestions += qCount;
        stageQuestionCount += qCount;

        if (qCount < 3) {
          quizzesBelow3Questions++;
        }

        minQuestionsPerQuiz = Math.min(minQuestionsPerQuiz, qCount);
        maxQuestionsPerQuiz = Math.max(maxQuestionsPerQuiz, qCount);

        // Check each question validity
        lesson.quizzes.forEach((quiz, qIdx) => {
          // Question text
          if (!quiz.question || typeof quiz.question !== "string" || quiz.question.trim().length === 0) {
            invalidQuizQuestions++;
          }

          // Options check
          if (!Array.isArray(quiz.options) || quiz.options.length < 2) {
            invalidQuizQuestions++;
          }

          // Correct index validity
          if (
            typeof quiz.correctIndex !== "number" ||
            quiz.correctIndex < 0 ||
            quiz.correctIndex >= quiz.options.length
          ) {
            invalidQuizQuestions++;
          }

          // Explanation check
          if (!quiz.explanation || typeof quiz.explanation !== "string" || quiz.explanation.trim().length === 0) {
            missingExplanations++;
          }
        });
      }

      // Check prerequisites integrity
      if (lesson.prerequisites && lesson.prerequisites.length > 0) {
        lesson.prerequisites.forEach((prereqSlug) => {
          if (!allSlugs.has(prereqSlug)) {
            console.error(`Broken prerequisite slug "${prereqSlug}" in lesson "${lesson.slug}"`);
            brokenPrerequisites++;
          }
        });
      }
    });

    stageBreakdown.push({
      stageOrder: stage.orderIndex,
      stageTitle: stage.titleId,
      lessonCount: stage.lessons.length,
      questionCount: stageQuestionCount,
    });
  });

  return {
    totalStages: CURRICULUM_STAGES.length,
    totalLessons,
    totalQuizzes,
    totalQuestions,
    minQuestionsPerQuiz: minQuestionsPerQuiz === Infinity ? 0 : minQuestionsPerQuiz,
    maxQuestionsPerQuiz,
    lessonsWithoutQuiz,
    quizzesBelow3Questions,
    invalidQuizQuestions,
    missingExplanations,
    brokenPrerequisites,
    stageBreakdown,
  };
}

// Run CLI report if executed directly
const result = validateCurriculum();

console.log("\n=======================================================");
console.log("             BELAJARINAJA QUIZ GATE AUDIT             ");
console.log("=======================================================\n");

console.log(`Total Stages: ${result.totalStages}`);
console.log(`Total Lessons: ${result.totalLessons}`);
console.log(`Total Quizzes: ${result.totalQuizzes}`);
console.log(`Total Questions: ${result.totalQuestions}`);
console.log(`Minimum Questions per Quiz: ${result.minQuestionsPerQuiz}`);
console.log(`Maximum Questions per Quiz: ${result.maxQuestionsPerQuiz}`);

console.log("\n--- INTEGRITY CHECKS ---");
console.log(`Lessons Without Quiz: ${result.lessonsWithoutQuiz}`);
console.log(`Quizzes Below 3 Questions: ${result.quizzesBelow3Questions}`);
console.log(`Invalid Quiz Questions: ${result.invalidQuizQuestions}`);
console.log(`Missing Explanations: ${result.missingExplanations}`);
console.log(`Broken Prerequisites: ${result.brokenPrerequisites}`);

console.log("\n--- STAGE BREAKDOWN ---");
result.stageBreakdown.forEach((sb) => {
  console.log(
    `Stage ${String(sb.stageOrder).padStart(2, "0")}: ${sb.stageTitle} → ${sb.lessonCount} lessons / ${sb.lessonCount} quizzes / ${sb.questionCount} questions`
  );
});

console.log("\n=======================================================");
if (
  result.lessonsWithoutQuiz === 0 &&
  result.quizzesBelow3Questions === 0 &&
  result.invalidQuizQuestions === 0 &&
  result.missingExplanations === 0 &&
  result.brokenPrerequisites === 0 &&
  result.totalQuestions >= 345
) {
  console.log("✅ AUDIT PASSED: All 115 lessons have >= 3 valid quizzes with 100% integrity!");
} else {
  console.error("❌ AUDIT FAILED: Integrity errors detected!");
  process.exit(1);
}
console.log("=======================================================\n");
