export type LessonStepType = "explanation" | "coach_move" | "player_move";

export interface LessonStep {
  id: string;

  type: LessonStepType;

  title?: string;

  /**
   * Text displayed to the player and spoken by the Coach.
   */
  text: string;

  /**
   * Chess move used when the Coach demonstrates a move.
   * Example: "a1-h1"
   */
  move?: string;

  /**
   * Expected move when the player is practicing.
   * Example: "h5-h8"
   */
  expectedMove?: string;

  /**
   * Hint shown when the player needs help.
   */
  hint?: string;

  /**
   * Optional starting FEN for this step.
   *
   * This lets a lesson create a special teaching
   * position instead of always using the normal
   * starting chess position.
   */
  setupFen?: string;

  /**
   * Optional delay before the Coach performs
   * the demonstration move.
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
