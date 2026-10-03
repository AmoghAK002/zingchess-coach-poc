import { useEffect, useState } from "react";
import { CoachSidebar } from "./components/CoachSidebar";
import { CoachMessage } from "./components/CoachMessage";
import { ChessBoard } from "./components/ChessBoard";
import { coach1Course } from "./data/coach1";

function App() {
  // Stores which lesson is currently selected.
  const [activeLessonId, setActiveLessonId] = useState(
    coach1Course.lessons[0].id,
  );

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
  const currentStep =
    activeLesson?.steps[currentStepIndex];

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

    if (currentStep.type === "explanation") {
      // Explanation steps are immediately complete.
      setIsStepComplete(true);
    } else {
      // Coach and player steps have their own
      // completion callbacks.
      setIsStepComplete(false);
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
    setIsStepComplete(true);
  }

  /*
   * Called by ChessBoard when the player makes
   * the expected move during a player_move step.
   */
  function handlePlayerMoveComplete() {
    console.log("✅ App received Player move completion");
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
      setIsStepComplete(false);
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
            <span className="eyebrow">
              COACH 1 · THE BASICS
            </span>

            <h1>{activeLesson?.title}</h1>
          </div>
        </header>

        <p className="lesson-description">
          {activeLesson?.description}
        </p>

        {/*
         * The board receives the current lesson step.
         *
         * This allows the board to know whether
         * the Coach or the player should control it.
         */}
        <ChessBoard
          /*
           * Changing the lesson changes the React key.
           *
           * React will create a fresh ChessBoard component,
           * which gives it a fresh chess.js game.
           *
           * Changing steps inside the same lesson does NOT
           * change this key, so the board position is preserved.
           */
          key={activeLessonId}
          step={currentStep}
          /*
           * These two callbacks are what unlock the Continue
           * button after a coach_move or player_move step.
           *
           * Without them, ChessBoard fires into a void.
           */
          onCoachMoveComplete={handleCoachMoveComplete}
          onPlayerMoveComplete={handlePlayerMoveComplete}
        />

        {currentStep && (
          <div className="coach-step">
            <CoachMessage
              title={currentStep.title}
              text={currentStep.text}
            />

            <div className="step-controls">
              <span className="step-progress">
                Step {currentStepIndex + 1} of{" "}
                {activeLesson?.steps.length}
              </span>

              <button
                className="continue-button"
                onClick={handleNextStep}
                disabled={
                  !isStepComplete ||
                  currentStepIndex ===
                    (activeLesson?.steps.length ?? 1) - 1
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
