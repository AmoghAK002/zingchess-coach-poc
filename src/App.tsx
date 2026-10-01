import { useState } from "react";
import { CoachSidebar } from "./components/CoachSidebar";
import { coach1Course } from "./data/coach1";

function App() {
  const [activeLessonId, setActiveLessonId] = useState(
    coach1Course.lessons[0].id
  );

  const activeLesson = coach1Course.lessons.find(
    (lesson) => lesson.id === activeLessonId
  );

  return (
    <main>
      <CoachSidebar
        lessons={coach1Course.lessons}
        activeLessonId={activeLessonId}
        onSelectLesson={setActiveLessonId}
      />

      <section>
        <h1>{activeLesson?.title}</h1>

        <p>{activeLesson?.description}</p>
      </section>
    </main>
  );
}

export default App;