export type LessonStepType =
  | "explanation"
  | "coach_move"
  | "player_move";

export interface LessonStep {
  id: string;
  type: LessonStepType;
  title?: string;
  text: string;
  focusLabel?: string;
  move?: string;
  expectedMove?: string;
  hint?: string;
  setupFen?: string;
  delay?: number;
  highlightSquares?: string[];

  // Controls when the visual Coach action begins during narration.
  actionDelay?: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  steps: LessonStep[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}