export type LessonStepType =
  | "explanation"
  | "coach_move"
  | "player_move";

export interface LessonStep {
  id: string;

  type: LessonStepType;

  title?: string;

  /**
   * Text displayed to the learner
   * and spoken by the Coach.
   */
  text: string;

  /**
   * Chess move demonstrated by the Coach.
   *
   * Example:
   * "a1-h1"
   */
  move?: string;

  /**
   * Expected move when the learner
   * is practicing.
   *
   * Example:
   * "h5-h8"
   */
  expectedMove?: string;

  /**
   * Hint shown when the learner
   * needs help.
   */
  hint?: string;

  /**
   * Optional starting chess position.
   */
  setupFen?: string;

  /**
   * Optional delay before the Coach
   * performs a demonstration move.
   */
  delay?: number;

  /**
   * Squares that should be visually highlighted
   * while this lesson step is being explained.
   *
   * Example:
   *
   * ["a1", "b1", "c1", "d1"]
   *
   * This allows the Coach to visually point
   * at important parts of the chessboard.
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