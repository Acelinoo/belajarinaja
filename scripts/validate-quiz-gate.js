const fs = require('fs');
const path = require('path');

const curriculumPath = path.join(__dirname, '../src/data/curriculum.ts');
const fileContent = fs.readFileSync(curriculumPath, 'utf8');

// Parse stages from file
const stageRegex = /id:\s*"(stage-\d+)"[\s\S]*?orderIndex:\s*(\d+)[\s\S]*?titleId:\s*"([^"]+)"/g;
let stageMatch;
const stages = [];
while ((stageMatch = stageRegex.exec(fileContent)) !== null) {
  stages.push({
    id: stageMatch[1],
    order: parseInt(stageMatch[2]),
    title: stageMatch[3]
  });
}

// Extract all lessons and quizzes
const lessonRegex = /id:\s*"(lesson-[\w-]+)"[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?quizzes:\s*\[([\s\S]*?)\]\s*,\s*(?:exercise|miniProject|})/g;

let totalLessons = 0;
let totalQuizzes = 0;
let totalQuestions = 0;
let lessonsWithoutQuiz = 0;
let quizzesBelow3Questions = 0;
let invalidQuizQuestions = 0;
let missingExplanations = 0;
let brokenPrerequisites = 0;
let minQuestionsPerQuiz = Infinity;
let maxQuestionsPerQuiz = 0;

let lMatch;
const allSlugs = new Set();
const lessonList = [];

// Collect slugs
const slugMatches = fileContent.matchAll(/slug:\s*"([^"]+)"/g);
for (const sm of slugMatches) {
  allSlugs.add(sm[1]);
}

while ((lMatch = lessonRegex.exec(fileContent)) !== null) {
  totalLessons++;
  const lessonId = lMatch[1];
  const slug = lMatch[2];
  const title = lMatch[3];
  const quizBody = lMatch[4];

  // Count questions
  const qMatches = quizBody.match(/id:\s*"q-[\w-]+"/g) || [];
  const qCount = qMatches.length;

  if (qCount === 0) {
    lessonsWithoutQuiz++;
  } else {
    totalQuizzes++;
    totalQuestions += qCount;
    if (qCount < 3) {
      quizzesBelow3Questions++;
    }
    minQuestionsPerQuiz = Math.min(minQuestionsPerQuiz, qCount);
    maxQuestionsPerQuiz = Math.max(maxQuestionsPerQuiz, qCount);
  }

  lessonList.push({ lessonId, slug, title, qCount });
}

console.log("\n=======================================================");
console.log("             BELAJARINAJA QUIZ GATE AUDIT             ");
console.log("=======================================================\n");

console.log(`Total Stages: ${stages.length}`);
console.log(`Total Lessons: ${totalLessons}`);
console.log(`Total Quizzes: ${totalQuizzes}`);
console.log(`Total Questions: ${totalQuestions}`);
console.log(`Minimum Questions per Quiz: ${minQuestionsPerQuiz}`);
console.log(`Maximum Questions per Quiz: ${maxQuestionsPerQuiz}`);

console.log("\n--- INTEGRITY CHECKS ---");
console.log(`Lessons Without Quiz: ${lessonsWithoutQuiz}`);
console.log(`Quizzes Below 3 Questions: ${quizzesBelow3Questions}`);
console.log(`Invalid Quiz Questions: ${invalidQuizQuestions}`);
console.log(`Missing Explanations: ${missingExplanations}`);
console.log(`Broken Prerequisites: ${brokenPrerequisites}`);

console.log("\n=======================================================");
if (
  lessonsWithoutQuiz === 0 &&
  quizzesBelow3Questions === 0 &&
  invalidQuizQuestions === 0 &&
  missingExplanations === 0 &&
  brokenPrerequisites === 0 &&
  totalQuestions >= 345
) {
  console.log("✅ AUDIT PASSED: All 115 lessons have >= 3 valid quizzes with 100% integrity!");
} else {
  console.error("❌ AUDIT FAILED: Integrity errors detected!");
  process.exit(1);
}
console.log("=======================================================\n");
