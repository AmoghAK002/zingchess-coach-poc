interface CoachMessageProps {
  title?: string;
  text: string;
}

export function CoachMessage({
  title = "Coach",
  text,
}: CoachMessageProps) {
  return (
    <div className="coach-message">
      <div className="coach-avatar">
        ♞
      </div>

      <div>
        <div className="message-label">
          {title}
        </div>

        <p>{text}</p>
      </div>
    </div>
  );
}