export type LessonStepType =
  | "explanation"
  | "coach_move"
  | "player_move";

export interface LessonStep {
  id: string;

  type: LessonStepType;

  title?: string;

  /**
   * Text shown/spoken by the coach.
   */
  text: string;

  /**
   * Used when the coach demonstrates a move.
   * Example: "e2-e4"
   */
  move?: string;

  /**
   * Used when the player is expected
   * to make a specific move.
   * Example: "e2-e4"
   */
  expectedMove?: string;

  /**
   * Optional hint shown during player practice.
   */
  hint?: string;

  /**
   * Optional delay before a coach demonstration.
   * We will use this for animation timing later.
   */
  delay?: number;
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