import { useState } from "react";
import { CoachSidebar } from "./components/CoachSidebar";
import { coach1Course } from "./data/coach1";
import { CoachMessage } from "./components/CoachMessage";

function App() {
  const [activeLessonId, setActiveLessonId] = useState(
    coach1Course.lessons[0].id,
  );

  const activeLesson = coach1Course.lessons.find(
    (lesson) => lesson.id === activeLessonId,
  );

  return (
    <main className="app-shell">
      <CoachSidebar
        lessons={coach1Course.lessons}
        activeLessonId={activeLessonId}
        onSelectLesson={setActiveLessonId}
      />

      <section className="coach-main">
        <span className="eyebrow">COACH 1 · THE BASICS</span>
        <h1>{activeLesson?.title}</h1>
        <p className="lesson-description">{activeLesson?.description}</p>
        <div className="lesson-steps">
          {activeLesson?.steps.map((step) => (
            <CoachMessage key={step.id} title={step.title} text={step.text} />
          ))}
        </div>
        
      </section>
    </main>
  );
}

export default App;
