import { useState } from "react";
import { CoachSidebar } from "./components/CoachSidebar";
import { CoachMessage } from "./components/CoachMessage";
import { ChessBoard } from "./components/ChessBoard";
import { coach1Course } from "./data/coach1";

function App() {
  const [activeLessonId, setActiveLessonId] = useState(
    coach1Course.lessons[0].id
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const activeLesson = coach1Course.lessons.find(
    (lesson) => lesson.id === activeLessonId
  );

  const currentStep = activeLesson?.steps[currentStepIndex];

  function handleLessonChange(lessonId: string) {
    setActiveLessonId(lessonId);
    setCurrentStepIndex(0);
  }

  function handleNextStep() {
    if (!activeLesson) {
      return;
    }

    if (currentStepIndex < activeLesson.steps.length - 1) {
      setCurrentStepIndex((index) => index + 1);
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

        <ChessBoard />

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