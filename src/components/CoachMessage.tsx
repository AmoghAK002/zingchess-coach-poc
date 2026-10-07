interface CoachMessageProps {
  title?: string;
  text: string;
  isSpeaking?: boolean;
  isPlayerTurn?: boolean;
  onReplaySpeech?: () => void;
}

export function CoachMessage({
  title = "Coach",
  text,
  isSpeaking = false,
  isPlayerTurn = false,
  onReplaySpeech,
}: CoachMessageProps) {
  return (
    <div
      className={`coach-message ${isSpeaking ? "speaking" : ""} ${
        isPlayerTurn ? "player-turn" : ""
      }`}
    >
      <div className="coach-avatar-wrap">
        <div className="coach-avatar">♞</div>
        {isSpeaking && (
          <div className="audio-equalizer" title="Coach is speaking">
            <span className="eq-bar" />
            <span className="eq-bar" />
            <span className="eq-bar" />
            <span className="eq-bar" />
          </div>
        )}
      </div>

      <div className="coach-message-body">
        <div className="message-header">
          <div className="title-group">
            <span className="message-label">{title}</span>
            {isSpeaking && <span className="speaking-badge">Speaking...</span>}
          </div>

          {onReplaySpeech && (
            <button
              className="replay-speech-btn"
              onClick={onReplaySpeech}
              title="Listen again"
            >
              <span className="speaker-icon">🔊</span>
              <span>Listen</span>
            </button>
          )}
        </div>

        <p className="coach-text">{text}</p>
      </div>
    </div>
  );
}