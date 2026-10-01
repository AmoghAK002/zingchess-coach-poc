import type { Lesson } from "../types/coach";

interface CoachSidebarProps {
  lessons: Lesson[];
  activeLessonId: string;
  onSelectLesson: (lessonId: string) => void;
}

export function CoachSidebar({
  lessons,
  activeLessonId,
  onSelectLesson,
}: CoachSidebarProps) {
  return (
    <aside className="coach-sidebar">
      <h2>The Basics</h2>

      <div className="lesson-list">
        {lessons.map((lesson, index) => {
          const isActive = lesson.id === activeLessonId;

          return (
            <button
              key={lesson.id}
              className={`lesson-item ${isActive ? "active" : ""}`}
              onClick={() => onSelectLesson(lesson.id)}
            >
              <span className="lesson-number">
                {index + 1}
              </span>

              <span className="lesson-title">
                {lesson.title}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}