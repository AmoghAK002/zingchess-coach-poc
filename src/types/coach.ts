export type LessonStepType =
  | "explanation"
  | "coach_move"
  | "player_move";

/**
 * Controls when the board action fires during Coach narration.
 *
 * mode: 'word'    → fire at the Nth word spoken (uses onboundary)
 * mode: 'elapsed' → fire N ms after speech starts (fallback)
 *
 * Always provide an elapsedMs fallback for browsers that
 * do not fire onboundary (e.g. Firefox).
 */
export interface ActionTrigger {
  mode: "word" | "elapsed";
  /** 0-based word index at which to trigger (mode: 'word') */
  wordIndex?: number;
  /** ms after speech start to trigger (mode: 'elapsed' or fallback) */
  elapsedMs: number;
}

/**
 * Visual teaching emphasis on the board.
 *
 * Used to show movement paths, destinations, or capture targets
 * independently of the active move.
 */
export interface VisualEmphasis {
  /** Squares to emphasize */
  squares: string[];
  /** Visual style */
  style: "path" | "destinations" | "capture-target";
}

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

  /**
   * Controls when the board action fires during narration.
   * Replaces the old actionDelay field.
   */
  actionTrigger?: ActionTrigger;

  /**
   * Visual teaching overlays on the board.
   */
  visualEmphasis?: VisualEmphasis[];

  /**
   * Custom feedback messages for this step.
   * If not provided, generic feedback is used.
   */
  feedbackCorrect?: string;
  feedbackWrong?: string;
  feedbackIllegal?: string;
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