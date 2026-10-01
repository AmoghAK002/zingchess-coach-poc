export type LessonStepType =
  | "explanation"
  | "coach_move"
  | "player_move";

export interface LessonStep {
  id: string;
  type: LessonStepType;
  title?: string;
  text: string;
  move?: string;
  expectedMove?: string;
  hint?: string;
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