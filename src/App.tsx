import { useEffect, useState } from "react";
import { CoachSidebar } from "./components/CoachSidebar";
import { CoachMessage } from "./components/CoachMessage";
import { ChessBoard, type PlayerFeedback } from "./components/ChessBoard";
import { coach1Course } from "./data/coach1";

/*
 * Describes what the learner is currently expected to do.
 *
 * explanation → read/listen to the Coach
 * watching    → watch the Coach demonstrate a move
 * your_turn   → interact with the chessboard
 * completed   → current step is finished
 */
type CoachInteractionState =
  | "explanation"
  | "watching"
  | "your_turn"
  | "completed";

function App() {
  // Stores which lesson is currently selected.
  const [activeLessonId, setActiveLessonId] = useState(
    coach1Course.lessons[0].id,
  );
  /*
   * Stores feedback about the player's latest move.
   *
   * "none" means there is currently no feedback to show.
   */
  const [playerFeedback, setPlayerFeedback] = useState<PlayerFeedback>("none");
  // Stores which step inside the lesson is currently active.
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  /*
   * Tracks whether the current step has been completed.
   *
   * false → Continue is locked
   * true  → Continue is available
   *
   * Coach steps:
   *   Wait for speech + animation.
   *
   * Player steps:
   *   Wait for the correct player move.
   */
  const [isStepComplete, setIsStepComplete] = useState(false);

  /*
   * Tracks the current interaction mode of the lesson.
   *
   * This is separate from isStepComplete because:
   *
   * isStepComplete answers:
   * "Can I continue?"
   *
   * interactionState answers:
   * "What am I supposed to be doing right now?"
   */
  const [interactionState, setInteractionState] =
    useState<CoachInteractionState>("explanation");

  /*
   * Find the currently selected lesson from the course data.
   */
  const activeLesson = coach1Course.lessons.find(
    (lesson) => lesson.id === activeLessonId,
  );

  /*
   * Find the current step inside the active lesson.
   *
   * This MUST be declared before the useEffect below,
   * because the effect uses currentStep.
   */
  const currentStep = activeLesson?.steps[currentStepIndex];

  /*
   * Decide whether the newly displayed step is already
   * complete.
   *
   * Explanation:
   *   Nothing needs to be completed by the user,
   *   so Continue is immediately available.
   *
   * Coach move:
   *   Wait for speech + animation.
   *
   * Player move:
   *   Wait for the correct player move.
   */
  useEffect(() => {
    if (!currentStep) {
      return;
    }

    /*
     * Every time the lesson step changes,
     * reset completion first.
     */
    setIsStepComplete(false);

    /*
     * Decide what the learner should currently do.
     */
    if (currentStep.type === "explanation") {
      /*
       * Explanation steps don't require an interaction.
       * The learner can immediately continue.
       */
      setInteractionState("explanation");
      setIsStepComplete(true);
    } else if (currentStep.type === "coach_move") {
      /*
       * The Coach controls the board.
       *
       * ChessBoard will later tell us when
       * speech + animation are finished.
       */
      setInteractionState("watching");
    } else if (currentStep.type === "player_move") {
      /*
       * The learner is expected to interact
       * with the chessboard.
       */
      setInteractionState("your_turn");
    }
  }, [currentStep]);

  /*
   * Called when the user selects another lesson
   * from the sidebar.
   */
  function handleLessonChange(lessonId: string) {
    setActiveLessonId(lessonId);

    // Always start the selected lesson from step 1.
    setCurrentStepIndex(0);

    // New lesson starts incomplete.
    setIsStepComplete(false);
  }

  /*
   * Called by ChessBoard when the Coach's speech AND
   * board animation have both finished.
   *
   * This is what actually unlocks the Continue button
   * after a coach_move step.
   */
  function handleCoachMoveComplete() {
    console.log("✅ App received Coach completion");

    /*
     * The Coach has finished speaking and demonstrating
     * the move, so this step is now complete.
     */
    setInteractionState("completed");
    setIsStepComplete(true);
  }

  /*
   * Called by ChessBoard when the player makes
   * the expected move during a player_move step.
   */
  function handlePlayerMoveComplete() {
    console.log("✅ App received Player move completion");

    /*
     * The learner successfully performed
     * the expected move.
     */
    setInteractionState("completed");
    setIsStepComplete(true);
  }

  /*
   * Move to the next step.
   */
  function handleNextStep() {
    if (!activeLesson) {
      return;
    }

    /*
     * Don't allow the user to move forward until
     * the current step has actually been completed.
     */
    if (!isStepComplete) {
      return;
    }

    /*
     * Make sure we are not already on the final step.
     */
    if (currentStepIndex < activeLesson.steps.length - 1) {
      // Move to the next lesson step.
      setCurrentStepIndex((index) => index + 1);

      // The next step starts incomplete.
      // The useEffect above will determine the
      // correct interaction state for the new step.
      setIsStepComplete(false);
      setInteractionState("explanation");
    }
  }

  return (
    <main className="app-shell">
      <CoachSidebar
        lessons={coach1Course.lessons}
        activeLessonId={activeLessonId}
        onSelectLesson={handleLessonChange}
      />

      <section className="coach-main">
        <header className="topbar">
          <div>
            <span className="eyebrow">COACH 1 · THE BASICS</span>

            <h1>{activeLesson?.title}</h1>
          </div>
        </header>

        <p className="lesson-description">{activeLesson?.description}</p>

        {/*
         * Shows the learner what they should currently be doing.
         *
         * This is driven by interactionState rather than
         * hard-coding the message for each lesson.
         */}
        {/*
         * Shows the learner what is happening right now.
         *
         * The message changes automatically depending on
         * the current lesson interaction state.
         */}
        <div className={`interaction-state ${interactionState}`}>
          {interactionState === "explanation" && (
            <>
              <span className="interaction-icon">📖</span>
              <div>
                <strong>Learn</strong>
                <span>Listen to the Coach</span>
              </div>
            </>
          )}

          {interactionState === "watching" && (
            <>
              <span className="interaction-icon">👀</span>
              <div>
                <strong>Watch the Coach</strong>
                <span>The Coach is demonstrating the move</span>
              </div>
            </>
          )}

          {interactionState === "your_turn" && (
            <>
              <span className="interaction-icon">🎯</span>
              <div>
                <strong>Your Turn</strong>
                <span>Make the move shown by the Coach</span>
              </div>
            </>
          )}

          {interactionState === "completed" && (
            <>
              <span className="interaction-icon">✓</span>
              <div>
                <strong>Completed</strong>
                <span>Great job! Continue when you're ready.</span>
              </div>
            </>
          )}
        </div>

        {/*
         * The board receives the current lesson step.
         *
         * This allows the board to know whether
         * the Coach or the player should control it.
         */}
        <ChessBoard
          key={activeLessonId}
          step={currentStep}
          onCoachMoveComplete={handleCoachMoveComplete}
          onPlayerMoveComplete={handlePlayerMoveComplete}
          onPlayerFeedback={(feedback: PlayerFeedback) => {
            setPlayerFeedback(feedback);
          }}
        />

        {currentStep && (
          <div className="coach-step">
            <CoachMessage title={currentStep.title} text={currentStep.text} />
            {playerFeedback === "correct" && (
              <div className="player-feedback correct">
                <strong>✓ Excellent!</strong>
                <span>That's the move the Coach asked for.</span>
              </div>
            )}

            {playerFeedback === "wrong" && (
              <div className="player-feedback wrong">
                <strong>Not quite.</strong>
                <span>
                  That's a legal move, but try the highlighted square.
                </span>
              </div>
            )}

            {playerFeedback === "illegal" && (
              <div className="player-feedback illegal">
                <strong>That move isn't legal.</strong>
                <span>Follow the movement rules and try again.</span>
              </div>
            )}
            <div className="step-controls">
              <span className="step-progress">
                Step {currentStepIndex + 1} of {activeLesson?.steps.length}
              </span>

              <button
                className="continue-button"
                onClick={handleNextStep}
                disabled={
                  !isStepComplete ||
                  currentStepIndex === (activeLesson?.steps.length ?? 1) - 1
                }
              >
                Continue →
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
