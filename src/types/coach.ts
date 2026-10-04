export type LessonStepType =
  | "explanation"
  | "coach_move"
  | "player_move";

export interface LessonStep {
  id: string;
  type: LessonStepType;
  title?: string;

  /**
   * Text displayed to the player and spoken by the Coach.
   */
  text: string;

  /**
   * Optional label describing what the Coach is
   * currently focusing on visually.
   */
  focusLabel?: string;

  /**
   * Chess move used when the Coach demonstrates a move.
   */
  move?: string;

  /**
   * Expected move when the player is practicing.
   */
  expectedMove?: string;

  /**
   * Hint shown when the player needs help.
   */
  hint?: string;

  /**
   * Optional starting FEN for this step.
   */
  setupFen?: string;

  /**
   * Optional delay before the Coach performs
   * the demonstration move.
   */
  delay?: number;

  /**
   * Squares that should be visually highlighted
   * during this lesson step.
   */
  highlightSquares?: string[];
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