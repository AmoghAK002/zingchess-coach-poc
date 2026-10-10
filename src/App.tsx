import { useEffect, useState } from "react";

import { CoachSidebar } from "./components/CoachSidebar";
import { CoachMessage } from "./components/CoachMessage";
import { ChessBoard, type PlayerFeedback } from "./components/ChessBoard";

import { coach1Course } from "./data/coach1";

type CoachInteractionState =
  | "explanation"
  | "watching"
  | "your_turn"
  | "completed";

function App() {
  const [activeLessonId, setActiveLessonId] = useState(
    coach1Course.lessons[0].id,
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [interactionState, setInteractionState] =
    useState<CoachInteractionState>("explanation");
  const [playerFeedback, setPlayerFeedback] = useState<PlayerFeedback>("none");
  const [completedStepIds, setCompletedStepIds] = useState<Set<string>>(
    new Set(),
  );

  // Whether the learner has explicitly started the selected lesson.
  const [hasStartedLesson, setHasStartedLesson] = useState(false);
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [replayTrigger, setReplayTrigger] = useState(0);

  const activeLesson = coach1Course.lessons.find(
    (lesson) => lesson.id === activeLessonId,
  );

  const currentStep = activeLesson?.steps[currentStepIndex];

  function markStepCompleted(stepId: string) {
    setCompletedStepIds((prev) => {
      const next = new Set(prev);
      next.add(stepId);
      return next;
    });
  }

  useEffect(() => {
    // Don't process lesson steps until the learner starts.
    if (!currentStep || !hasStartedLesson) return;

    setPlayerFeedback("none");
    setIsStepComplete(false);
    setIsSpeaking(false);

    if (currentStep.type === "explanation") {
      setInteractionState("explanation");
      setIsStepComplete(true);
      markStepCompleted(currentStep.id);
    } else if (currentStep.type === "coach_move") {
      setInteractionState("watching");
    } else if (currentStep.type === "player_move") {
      setInteractionState("your_turn");
    }
  }, [currentStep, currentStepIndex, activeLesson, hasStartedLesson]);

  function handleLessonChange(lessonId: string) {
    // Select the lesson, but don't start it yet.
    setActiveLessonId(lessonId);
    setHasStartedLesson(false);

    // Reset the lesson to its first step.
    setCurrentStepIndex(0);
    setIsStepComplete(false);
    setPlayerFeedback("none");

    // Reset progress and completion for the selected lesson.
    setCompletedStepIds(new Set());
    setIsLessonComplete(false);

    // Stop any speech from the previous lesson.
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  function handleCoachMoveComplete() {
    setInteractionState("completed");
    setIsStepComplete(true);

    if (currentStep) {
      markStepCompleted(currentStep.id);
    }
  }

  function handlePlayerMoveComplete() {
    setInteractionState("completed");
    setIsStepComplete(true);

    if (currentStep) {
      markStepCompleted(currentStep.id);
    }
  }

  function handlePreviousStep() {
    if (currentStepIndex === 0) return;
    setCurrentStepIndex((i) => i - 1);
    setIsStepComplete(false);
    setPlayerFeedback("none");
    setIsSpeaking(false);
  }

  function handleNextStep() {
    if (!activeLesson || !isStepComplete) return;
    if (currentStepIndex < activeLesson.steps.length - 1) {
      setCurrentStepIndex((i) => i + 1);
      setIsStepComplete(false);
      setIsSpeaking(false);
    }
  }

  function handleReplaySpeech() {
    setReplayTrigger((prev) => prev + 1);
  }

  function getFeedbackContent(
    feedback: PlayerFeedback,
  ): { heading: string; body: string } | null {
    if (feedback === "none") return null;

    if (feedback === "correct") {
      return {
        heading: "Perfect Move!",
        body:
          currentStep?.feedbackCorrect ??
          "That's exactly the move requested. Great execution!",
      };
    }

    if (feedback === "wrong") {
      return {
        heading: "Good Attempt!",
        body:
          currentStep?.feedbackWrong ??
          (currentStep?.hint
            ? `That move is legal chess, but for this lesson: ${currentStep.hint}`
            : "That move is legal, but try the highlighted target square."),
      };
    }

    if (feedback === "illegal") {
      return {
        heading: "Illegal Move",
        body:
          currentStep?.feedbackIllegal ??
          (currentStep?.hint
            ? currentStep.hint
            : "That piece cannot move in that direction according to chess rules."),
      };
    }

    return null;
  }

  const feedbackContent = getFeedbackContent(playerFeedback);
  const totalSteps = activeLesson?.steps.length ?? 0;
  const isFinalStepComplete =
    totalSteps > 0 && currentStepIndex === totalSteps - 1 && isStepComplete;
  const isPlayerTurn = interactionState === "your_turn";

  return (
    <main className="app-shell">
      <CoachSidebar
        lessons={coach1Course.lessons}
        activeLessonId={activeLessonId}
        completedStepIds={completedStepIds}
        onSelectLesson={handleLessonChange}
      />

      <section className="coach-main">
        {/* Top Header */}
        <header className="topbar">
          <div className="topbar-left">
            <span className="eyebrow">
              <span className="live-dot" /> COACH 1 · THE BASICS
            </span>
            <h1>{activeLesson?.title}</h1>
            <p className="lesson-description">{activeLesson?.description}</p>
          </div>

          <div className="topbar-right">
            <div className="step-counter-badge">
              <span>
                Step {currentStepIndex + 1} of {totalSteps}
              </span>
            </div>
          </div>
        </header>

        {/* Step Progress Dots */}
        <div className="step-dots-bar">
          {activeLesson?.steps.map((s, i) => (
            <div
              key={s.id}
              className={`step-dot ${
                completedStepIds.has(s.id) ? "done" : ""
              } ${i === currentStepIndex ? "active" : ""}`}
              title={`Step ${i + 1}: ${s.title ?? "Step"}`}
            />
          ))}
        </div>

        {/* Learning Workspace */}
        <div className="learning-workspace">
          {/* Board Area */}
          <section className="board-section">
            <div className="board-header">
              <div className={`status-pill ${interactionState}`}>
                {interactionState === "explanation" && (
                  <>
                    <span className="status-dot explanation-dot" />
                    <span>Coach Explanation</span>
                  </>
                )}
                {interactionState === "watching" && (
                  <>
                    <span className="status-dot watching-dot" />
                    <span>Coach Demonstrating</span>
                  </>
                )}
                {interactionState === "your_turn" && (
                  <>
                    <span className="status-dot your-turn-dot" />
                    <span>Your Turn — Practice</span>
                  </>
                )}
                {interactionState === "completed" && (
                  <>
                    <span className="status-dot completed-dot" />
                    <span>Step Complete</span>
                  </>
                )}
              </div>

              <span className="board-coordinate-label">White to Move</span>
            </div>

            {/* Chessboard remounts per step to guarantee clean FEN reset */}
            <ChessBoard
              key={`${activeLessonId}-${currentStepIndex}`}
              step={currentStep}
              enabled={hasStartedLesson}
              onCoachMoveComplete={handleCoachMoveComplete}
              onPlayerMoveComplete={handlePlayerMoveComplete}
              onPlayerFeedback={(feedback: PlayerFeedback) => {
                setPlayerFeedback(feedback);
              }}
              onSpeechStart={() => setIsSpeaking(true)}
              onSpeechEnd={() => setIsSpeaking(false)}
              replayTrigger={replayTrigger}
            />
          </section>

          {/* Coach Studio Panel */}
          <aside className="coach-panel">
            {currentStep && !isLessonComplete && (
              <div className="coach-step">
                <CoachMessage
                  title={currentStep.title ?? "Coach"}
                  text={currentStep.text}
                  isSpeaking={isSpeaking}
                  isPlayerTurn={isPlayerTurn}
                  onReplaySpeech={handleReplaySpeech}
                />

                {/* Player Turn Target Banner */}
                {isPlayerTurn && (
                  <div className="player-turn-banner">
                    <div className="target-icon">🎯</div>
                    <div className="target-details">
                      <strong>Your Practice Objective</strong>
                      <span>
                        {currentStep.hint ??
                          "Drag and drop the piece to the target square shown."}
                      </span>
                    </div>
                  </div>
                )}

                {/* Feedback Banner */}
                {feedbackContent && (
                  <div className={`player-feedback ${playerFeedback}`}>
                    <div className="feedback-icon-wrap">
                      {playerFeedback === "correct" && "✓"}
                      {playerFeedback === "wrong" && "!"}
                      {playerFeedback === "illegal" && "✕"}
                    </div>
                    <div className="feedback-text-wrap">
                      <strong>{feedbackContent.heading}</strong>
                      <span>{feedbackContent.body}</span>
                    </div>
                  </div>
                )}

                {/* Navigation Controls */}
                <div className="step-controls">
                  <span className="step-progress">
                    {completedStepIds.size} of {totalSteps} steps finished
                  </span>

                  <div className="step-navigation">
                    <button
                      className="previous-button"
                      onClick={handlePreviousStep}
                      disabled={currentStepIndex === 0}
                    >
                      ← Back
                    </button>

                    <button
                      className="continue-button"
                      onClick={handleNextStep}
                      disabled={
                        !isStepComplete || currentStepIndex === totalSteps - 1
                      }
                    >
                      Continue →
                    </button>
                    {/* Show Finish Lesson only after the final step is complete. */}
                    {isFinalStepComplete && !isLessonComplete && (
                      <button
                        className="finish-lesson-btn"
                        onClick={() => {
                          // Immediately stop any narration currently playing.
                          window.speechSynthesis.cancel();

                          // Update the UI and mark the lesson as finished.
                          setIsSpeaking(false);
                          setIsLessonComplete(true);
                        }}
                      >
                        Finish Lesson ✓
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Lesson Completion Card */}
            {isLessonComplete && (
              <div className="lesson-complete">
                <div className="complete-badge">🎉 LESSON PASSED</div>
                <h2>{activeLesson?.title} Complete!</h2>
                <p>
                  You've mastered <strong>{activeLesson?.title}</strong>. Ready
                  for the next step in your chess journey?
                </p>
                <button
                  className="next-lesson-btn"
                  onClick={() => {
                    const currentIndex = coach1Course.lessons.findIndex(
                      (l) => l.id === activeLessonId,
                    );
                    if (currentIndex < coach1Course.lessons.length - 1) {
                      handleLessonChange(
                        coach1Course.lessons[currentIndex + 1].id,
                      );
                    }
                  }}
                >
                  Start Next Lesson →
                </button>
              </div>
            )}
          </aside>
        </div>
      </section>
      {/* Lesson Preview Overlay */}
      {!hasStartedLesson && !isLessonComplete && activeLesson && (
        <div className="lesson-start-overlay">
          <section
            className="lesson-start-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lesson-preview-title"
          >
            <span className="lesson-preview-eyebrow">
              ZINGCHESS COACH · COACH 1
            </span>

            <h2 id="lesson-preview-title">{activeLesson.title}</h2>

            <p className="lesson-preview-description">
              {activeLesson.description}
            </p>

            <div className="lesson-preview-details">
              <div className="lesson-preview-detail">
                <span className="detail-icon">📚</span>
                <div>
                  <strong>{activeLesson.steps.length} steps</strong>
                  <span>Interactive lesson</span>
                </div>
              </div>

              <div className="lesson-preview-detail">
                <span className="detail-icon">♟</span>
                <div>
                  <strong>Learn by doing</strong>
                  <span>Watch, practice, and improve</span>
                </div>
              </div>
            </div>

            <button
              className="start-lesson-button"
              onClick={() => {
                setCurrentStepIndex(0);
                setIsStepComplete(false);
                setPlayerFeedback("none");
                setIsLessonComplete(false);
                setIsSpeaking(false);
                setHasStartedLesson(true);
              }}
            >
              Start Lesson <span aria-hidden="true">→</span>
            </button>

            <p className="lesson-preview-footer">
              Your coach is ready when you are.
            </p>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
