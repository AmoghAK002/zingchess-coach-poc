import type { Lesson } from "../types/coach";

interface CoachSidebarProps {
  lessons: Lesson[];
  activeLessonId: string;
  completedStepIds: Set<string>;
  onSelectLesson: (lessonId: string) => void;
}

export function CoachSidebar({
  lessons,
  activeLessonId,
  completedStepIds,
  onSelectLesson,
}: CoachSidebarProps) {
  // Calculate total course completion percentage
  const totalCourseSteps = lessons.reduce((acc, l) => acc + l.steps.length, 0);
  const totalCompletedSteps = completedStepIds.size;
  const coursePercent = totalCourseSteps > 0
    ? Math.round((totalCompletedSteps / totalCourseSteps) * 100)
    : 0;

  return (
    <aside className="coach-sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">♞</div>
        <div className="brand-text">
          <span className="brand-name">ZingChess</span>
          <span className="brand-subtitle">COACH STUDIO</span>
        </div>
      </div>

      <div className="course-progress-card">
        <div className="progress-info">
          <span className="progress-title">The Basics</span>
          <span className="progress-percent">{coursePercent}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${coursePercent}%` }}
          />
        </div>
      </div>

      <h3 className="sidebar-section-title">CURRICULUM</h3>

      <div className="lesson-list">
        {lessons.map((lesson, index) => {
          const isActive = lesson.id === activeLessonId;
          const completedCount = lesson.steps.filter((s) =>
            completedStepIds.has(s.id),
          ).length;
          const isFinished = completedCount === lesson.steps.length;

          return (
            <button
              key={lesson.id}
              className={`lesson-item ${isActive ? "active" : ""} ${
                isFinished ? "finished" : ""
              }`}
              onClick={() => onSelectLesson(lesson.id)}
            >
              <div className="lesson-item-left">
                <span className="lesson-number">
                  {isFinished ? "✓" : index + 1}
                </span>
                <div className="lesson-meta">
                  <span className="lesson-title">{lesson.title}</span>
                  <span className="lesson-duration">{lesson.duration}</span>
                </div>
              </div>

              {isActive && <div className="active-dot" />}
            </button>
          );
        })}
      </div>
    </aside>
  );
}