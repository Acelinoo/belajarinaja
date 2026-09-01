export type SandboxType =
  | "javascript"
  | "html-css"
  | "dom-interactive"
  | "box-model"
  | "flexbox"
  | "grid";

export interface SandboxExercise {
  id: string;
  lessonId: string;
  lessonSlug: string;
  title: string;
  titleEn: string;
  type: SandboxType;
  instructions: string;
  instructionsEn: string;
  taskGoal: string;
  taskGoalEn: string;
  hints: string[];
  hintsEn: string[];
  starterCode: string;
  solutionCode: string;
  expectedOutput?: string;
  validationRegex?: RegExp | string;
  // For HTML/CSS / DOM visualizer
  initialHtml?: string;
  targetProperty?: string;
  targetValue?: string;
}

export interface SandboxExecutionResult {
  success: boolean;
  logs: string[];
  renderedHtml?: string;
  error?: string;
  feedback: string;
  feedbackEn: string;
  expected?: string;
  received?: string;
}
