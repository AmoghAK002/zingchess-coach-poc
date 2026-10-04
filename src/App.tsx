import { useEffect, useState } from "react";

import { CoachSidebar } from "./components/CoachSidebar";
import { CoachMessage } from "./components/CoachMessage";
import {
  ChessBoard,
  type PlayerFeedback,
} from "./components/ChessBoard";

import { coach1Course } from "./data/coach1";

/*
 * Describes what the learner is currently expected to do.
 *
 * explanation
 *   → Read/listen to the Coach.
 *
 * watching
 *   → Watch the Coach demonstrate a move.
 *
 * your_turn
 *   → Interact with the chessboard.
 *
 * completed
 *   → The current step has been completed.
 */
type CoachInteractionState =
  | "explanation"
  | "watching"
  | "your_turn"
  | "completed";

function App() {
  /*
   * --------------------------------------------------
   * LESSON STATE
   * --------------------------------------------------
   */

  /*
   * Stores which lesson is currently selected.
   */
  const [activeLessonId, setActiveLessonId] =
    useState(
      coach1Course.lessons[0].id,
    );

  /*
   * Stores which step inside the lesson
   * is currently active.
   */
  const [currentStepIndex, setCurrentStepIndex] =
    useState(0);

  /*
   * Tracks whether the current step has
   * actually been completed.
   *
   * false → Continue is locked
   * true  → Continue is available
   */
  const [isStepComplete, setIsStepComplete] =
    useState(false);

  /*
   * Describes what the learner should currently do.
   */
  const [interactionState, setInteractionState] =
    useState<CoachInteractionState>(
      "explanation",
    );

  /*
   * Stores feedback from the player's
   * latest chess move.
   */
  const [playerFeedback, setPlayerFeedback] =
    useState<PlayerFeedback>("none");

  /*
   * --------------------------------------------------
   * DERIVED LESSON DATA
   * --------------------------------------------------
   */

  /*
   * Find the selected lesson from the course data.
   *
   * We derive this instead of storing the entire
   * lesson separately in React state.
   */
  const activeLesson =
    coach1Course.lessons.find(
      (lesson) =>
        lesson.id === activeLessonId,
    );

  /*
   * Find the currently active step.
   *
   * currentStep is derived from:
   *
   * activeLesson + currentStepIndex
   */
  const currentStep =
    activeLesson?.steps[
      currentStepIndex
    ];

  /*
   * --------------------------------------------------
   * STEP STATE MANAGEMENT
   * --------------------------------------------------
   */

  /*
   * Runs whenever the active lesson step changes.
   *
   * This determines the initial interaction state
   * for the new step.
   */
  useEffect(() => {
    if (!currentStep) {
      return;
    }

    /*
     * Every new step starts without previous
     * player feedback.
     */
    setPlayerFeedback("none");

    /*
     * Every new step starts incomplete.
     *
     * Explanation steps are then immediately
     * marked complete below.
     */
    setIsStepComplete(false);

    /*
     * Determine what the learner should do.
     */
    if (currentStep.type === "explanation") {
      /*
       * Explanation steps require no interaction.
       */
      setInteractionState("explanation");

      /*
       * The learner can continue immediately.
       */
      setIsStepComplete(true);
    } else if (
      currentStep.type === "coach_move"
    ) {
      /*
       * The Coach controls the board.
       *
       * ChessBoard will notify App after:
       * speech + animation are complete.
       */
      setInteractionState("watching");
    } else if (
      currentStep.type === "player_move"
    ) {
      /*
       * The learner is now expected
       * to interact with the board.
       */
      setInteractionState("your_turn");
    }
  }, [currentStep]);

  /*
   * --------------------------------------------------
   * LESSON NAVIGATION
   * --------------------------------------------------
   */

  /*
   * Called when the learner selects
   * another lesson from the sidebar.
   */
  function handleLessonChange(
    lessonId: string,
  ) {
    /*
     * Change the selected lesson.
     */
    setActiveLessonId(lessonId);

    /*
     * Every lesson starts from its first step.
     */
    setCurrentStepIndex(0);

    /*
     * Reset completion state.
     */
    setIsStepComplete(false);

    /*
     * Remove feedback from the previous lesson.
     */
    setPlayerFeedback("none");

    /*
     * The useEffect above will determine
     * the correct state for the new step.
     */
  }

  /*
   * Called when the Coach has finished:
   *
   * - speaking
   * - demonstrating the move
   * - board animation
   */
  function handleCoachMoveComplete() {
    console.log(
      "✅ App received Coach completion",
    );

    /*
     * The learner has successfully watched
     * the Coach demonstration.
     */
    setInteractionState("completed");

    /*
     * Unlock Continue.
     */
    setIsStepComplete(true);
  }

  /*
   * Called when the player performs
   * the expected lesson move.
   */
  function handlePlayerMoveComplete() {
    console.log(
      "✅ App received Player move completion",
    );

    /*
     * The exercise has been successfully completed.
     */
    setInteractionState("completed");

    /*
     * Unlock Continue.
     */
    setIsStepComplete(true);
  }

  /*
   * Move to the next step.
   */
  function handleNextStep() {
    /*
     * Safety check.
     */
    if (!activeLesson) {
      return;
    }

    /*
     * Never allow the learner to skip
     * an incomplete step.
     */
    if (!isStepComplete) {
      return;
    }

    /*
     * Don't move beyond the final step.
     */
    if (
      currentStepIndex <
      activeLesson.steps.length - 1
    ) {
      /*
       * Move to the next step.
       */
      setCurrentStepIndex(
        (index) => index + 1,
      );

      /*
       * The useEffect watching currentStep
       * will reset the rest of the state.
       */
      setIsStepComplete(false);
    }
  }

  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */

  return (
    <main className="app-shell">
      {/*
       * =================================================
       * LEFT — LESSON NAVIGATION
       * =================================================
       */}

      <CoachSidebar
        lessons={coach1Course.lessons}
        activeLessonId={activeLessonId}
        onSelectLesson={handleLessonChange}
      />

      {/*
       * =================================================
       * MAIN LEARNING AREA
       * =================================================
       */}

      <section className="coach-main">
        {/*
         * -----------------------------------------------
         * PAGE HEADER
         * -----------------------------------------------
         */}

        <header className="topbar">
          <span className="eyebrow">
            COACH 1 · THE BASICS
          </span>

          <h1>
            {activeLesson?.title}
          </h1>

          <p className="lesson-description">
            {activeLesson?.description}
          </p>
        </header>

        {/*
         * -----------------------------------------------
         * LEARNING WORKSPACE
         * -----------------------------------------------
         *
         * The actual learning experience is split into
         * two clear areas:
         *
         * LEFT  → Chessboard
         * RIGHT → Coach
         *
         * This makes the product hierarchy much clearer.
         */}

        <div className="learning-workspace">
          {/*
           * =============================================
           * LEFT — CHESSBOARD
           * =============================================
           */}

          <section className="board-section">
            <div className="board-header">
              <span className="board-label">
                CHESSBOARD
              </span>

              <span className="board-step">
                Step{" "}
                {currentStepIndex + 1}{" "}
                of{" "}
                {activeLesson?.steps.length}
              </span>
            </div>

            {/*
             * The key is based on the lesson.
             *
             * Switching lessons creates a fresh
             * ChessBoard and therefore a fresh
             * chess.js game.
             *
             * Changing steps inside the same lesson
             * preserves the board state.
             */}
            <ChessBoard
              key={activeLessonId}
              step={currentStep}
              onCoachMoveComplete={
                handleCoachMoveComplete
              }
              onPlayerMoveComplete={
                handlePlayerMoveComplete
              }
              onPlayerFeedback={(
                feedback: PlayerFeedback,
              ) => {
                setPlayerFeedback(
                  feedback,
                );
              }}
            />
          </section>

          {/*
           * =============================================
           * RIGHT — COACH PANEL
           * =============================================
           */}

          <aside className="coach-panel">
            {/*
             * -------------------------------------------
             * CURRENT INTERACTION STATE
             * -------------------------------------------
             */}

            <div
              className={`interaction-state ${interactionState}`}
            >
              {interactionState ===
                "explanation" && (
                <>
                  <span className="interaction-icon">
                    📖
                  </span>

                  <div>
                    <strong>
                      Learn
                    </strong>

                    <span>
                      Listen to the Coach
                    </span>
                  </div>
                </>
              )}

              {interactionState ===
                "watching" && (
                <>
                  <span className="interaction-icon">
                    👀
                  </span>

                  <div>
                    <strong>
                      Watch the Coach
                    </strong>

                    <span>
                      The Coach is
                      demonstrating the
                      move
                    </span>
                  </div>
                </>
              )}

              {interactionState ===
                "your_turn" && (
                <>
                  <span className="interaction-icon">
                    🎯
                  </span>

                  <div>
                    <strong>
                      Your Turn
                    </strong>

                    <span>
                      Make the move shown
                      by the Coach
                    </span>
                  </div>
                </>
              )}

              {interactionState ===
                "completed" && (
                <>
                  <span className="interaction-icon">
                    ✓
                  </span>

                  <div>
                    <strong>
                      Completed
                    </strong>

                    <span>
                      Great job! Continue
                      when you're ready.
                    </span>
                  </div>
                </>
              )}
            </div>

            {/*
             * -------------------------------------------
             * CURRENT COACH STEP
             * -------------------------------------------
             */}

            {currentStep && (
              <div className="coach-step">
                <CoachMessage
                  title={currentStep.title}
                  text={currentStep.text}
                />

                {/*
                 * -----------------------------------------
                 * PLAYER FEEDBACK
                 * -----------------------------------------
                 */}

                {playerFeedback ===
                  "correct" && (
                  <div className="player-feedback correct">
                    <strong>
                      ✓ Excellent!
                    </strong>

                    <span>
                      That's the move
                      the Coach asked
                      for.
                    </span>
                  </div>
                )}

                {playerFeedback ===
                  "wrong" && (
                  <div className="player-feedback wrong">
                    <strong>
                      Not quite.
                    </strong>

                    <span>
                      That's a legal
                      move, but try
                      the highlighted
                      square.
                    </span>
                  </div>
                )}

                {playerFeedback ===
                  "illegal" && (
                  <div className="player-feedback illegal">
                    <strong>
                      That move isn't
                      legal.
                    </strong>

                    <span>
                      Follow the
                      movement rules
                      and try again.
                    </span>
                  </div>
                )}

                {/*
                 * -----------------------------------------
                 * STEP NAVIGATION
                 * -----------------------------------------
                 */}

                <div className="step-controls">
                  <span className="step-progress">
                    Step{" "}
                    {currentStepIndex +
                      1}{" "}
                    of{" "}
                    {activeLesson?.steps.length}
                  </span>

                  <button
                    className="continue-button"
                    onClick={
                      handleNextStep
                    }
                    disabled={
                      !isStepComplete ||
                      currentStepIndex ===
                        (activeLesson?.steps
                          .length ??
                          1) -
                          1
                    }
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

export default App;