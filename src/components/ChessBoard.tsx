import { useEffect, useRef, useState, type CSSProperties } from "react";

import { Chess, type Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { LessonStep } from "../types/coach";

export type PlayerFeedback = "none" | "correct" | "wrong" | "illegal" | "hint";

interface ChessBoardProps {
  step?: LessonStep;
  onCoachMoveComplete?: () => void;
  onPlayerMoveComplete?: () => void;
  onPlayerFeedback?: (feedback: PlayerFeedback) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  replayTrigger?: number;
  // Controls whether the lesson's narration and automatic moves can begin.
  enabled?: boolean;
}

export function ChessBoard({
  step,
  enabled = true,
  onCoachMoveComplete,
  onPlayerMoveComplete,
  onPlayerFeedback,
  onSpeechStart,
  onSpeechEnd,
  replayTrigger = 0,
}: ChessBoardProps) {
  /*
   * Crisp, smooth animation duration (900ms) for production quality feel
   */
  const COACH_ANIMATION_DURATION = 900;

  const [captureSquare, setCaptureSquare] = useState<string | null>(null);
  const [game, setGame] = useState(() => {
    if (step?.setupFen) {
      return new Chess(step.setupFen);
    }
    return new Chess();
  });

  const onCoachMoveCompleteRef = useRef(onCoachMoveComplete);
  const onPlayerMoveCompleteRef = useRef(onPlayerMoveComplete);
  const onPlayerFeedbackRef = useRef(onPlayerFeedback);
  const onSpeechStartRef = useRef(onSpeechStart);
  const onSpeechEndRef = useRef(onSpeechEnd);

  useEffect(() => {
    onCoachMoveCompleteRef.current = onCoachMoveComplete;
  }, [onCoachMoveComplete]);

  useEffect(() => {
    onPlayerMoveCompleteRef.current = onPlayerMoveComplete;
  }, [onPlayerMoveComplete]);

  useEffect(() => {
    onPlayerFeedbackRef.current = onPlayerFeedback;
  }, [onPlayerFeedback]);

  useEffect(() => {
    onSpeechStartRef.current = onSpeechStart;
  }, [onSpeechStart]);

  useEffect(() => {
    onSpeechEndRef.current = onSpeechEnd;
  }, [onSpeechEnd]);

  /**
   * Handles step activation & narration / board action synchronization.
   */
  useEffect(() => {
    if (!step) return;

    const currentStep = step;

    // Stop any previous narration before checking lesson status.
    window.speechSynthesis.cancel();

    // Keep the board ready, but don't start narration or moves
    // until the learner explicitly starts the lesson.
    if (!enabled) return;

    // Set initial position for current step
    const initialGame = currentStep.setupFen
      ? new Chess(currentStep.setupFen)
      : new Chess();

    setGame(initialGame);
    setCaptureSquare(null);

    // Speak narration for explanation, coach_move, or player_move
    const utterance = new SpeechSynthesisUtterance(currentStep.text);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    const timers: number[] = [];
    let speechStarted = false;
    let speechFinished = false;

    function handleSpeechStart() {
      if (speechStarted) return;
      speechStarted = true;
      onSpeechStartRef.current?.();
    }

    function handleSpeechEnd() {
      if (speechFinished) return;
      speechFinished = true;
      onSpeechEndRef.current?.();
    }

    if (currentStep.type !== "coach_move" || !currentStep.move) {
      utterance.onstart = () => {
        handleSpeechStart();
      };
      utterance.onend = () => {
        handleSpeechEnd();
      };
      utterance.onerror = () => {
        handleSpeechEnd();
      };

      // Fallback in case onstart is not fired by browser
      const startFallbackTimer = window.setTimeout(() => {
        handleSpeechStart();
      }, 400);
      timers.push(startFallbackTimer);

      window.speechSynthesis.speak(utterance);
      return () => {
        window.speechSynthesis.cancel();
        timers.forEach((t) => window.clearTimeout(t));
      };
    }

    const [from, to] = currentStep.move.split("-") as [Square, Square];

    let animationFinished = false;
    let stepCompleted = false;
    let moveFired = false;
    let wordBoundaryCount = 0;
    let hasBoundaryFired = false;

    function checkCoachMoveComplete() {
      if (speechFinished && animationFinished && !stepCompleted) {
        stepCompleted = true;
        console.log("✅ Coach step completed");
        onCoachMoveCompleteRef.current?.();
      }
    }

    function executeMove() {
      if (moveFired) return;
      moveFired = true;

      setGame(() => {
        const gameCopy = new Chess(initialGame.fen());
        try {
          const piece = gameCopy.get(from);
          if (!piece) {
            console.error(`Coach could not find piece on ${from}`);
            return initialGame;
          }

          const capturedPiece = gameCopy.get(to);
          const isCapture = Boolean(
            capturedPiece && capturedPiece.color !== piece.color,
          );

          if (isCapture) setCaptureSquare(to);

          // Execute the coach's move using the current board position.
          // chess.js validates the move and updates the turn automatically.
          gameCopy.move({ from, to, promotion: "q" });

          return gameCopy;
        } catch (error) {
          console.error(`Coach attempted illegal move: ${from}-${to}`, error);
          return initialGame;
        }
      });

      const animTimer = window.setTimeout(() => {
        animationFinished = true;
        setCaptureSquare(null);
        checkCoachMoveComplete();
      }, COACH_ANIMATION_DURATION);
      timers.push(animTimer);
    }

    const actionTrigger = currentStep.actionTrigger;
    const mode = actionTrigger?.mode ?? "elapsed";
    const targetWordIndex = actionTrigger?.wordIndex ?? 0;
    const elapsedMs = actionTrigger?.elapsedMs ?? 1800;

    if (mode === "word") {
      utterance.onboundary = (event: SpeechSynthesisEvent) => {
        if (event.name && event.name !== "word") return;
        hasBoundaryFired = true;
        const currentIdx = wordBoundaryCount;
        wordBoundaryCount++;
        if (currentIdx >= targetWordIndex) {
          executeMove();
        }
      };
    }

    function onStart() {
      handleSpeechStart();
      if (mode === "word") {
        const fallbackTimer = window.setTimeout(() => {
          if (!moveFired && !hasBoundaryFired) {
            console.log(
              "⏱️ Word boundary fallback triggered (onboundary did not fire)",
            );
            executeMove();
          }
        }, elapsedMs);
        timers.push(fallbackTimer);
      } else {
        const elapsedTimer = window.setTimeout(() => {
          executeMove();
        }, elapsedMs);
        timers.push(elapsedTimer);
      }
    }

    utterance.onstart = () => {
      onStart();
    };

    // Fallback if onstart is delayed
    const startFallbackTimer = window.setTimeout(() => {
      if (!speechStarted) {
        onStart();
      }
    }, 400);
    timers.push(startFallbackTimer);

    utterance.onend = () => {
      handleSpeechEnd();
      if (!moveFired) {
        executeMove();
      }
      checkCoachMoveComplete();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error:", e);
      handleSpeechEnd();
      if (!moveFired) {
        executeMove();
      }
      checkCoachMoveComplete();
    };

    const maxTimer = window.setTimeout(() => {
      handleSpeechEnd();
      if (!moveFired) {
        executeMove();
      }
      checkCoachMoveComplete();
    }, 15000);
    timers.push(maxTimer);

    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [step, replayTrigger, enabled]);

  function handlePieceDrop(sourceSquare: Square, targetSquare: Square) {
    if (step?.type !== "player_move") return false;

    onPlayerFeedbackRef.current?.("none");

    const gameCopy = new Chess(game.fen());
    const piece = gameCopy.get(sourceSquare);

    if (!piece) return false;

    gameCopy.setTurn(piece.color);

    try {
      gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    } catch {
      onPlayerFeedbackRef.current?.("illegal");
      return false;
    }

    if (step.expectedMove) {
      const actualMove = `${sourceSquare}-${targetSquare}`;

      if (actualMove === step.expectedMove) {
        setGame(gameCopy);
        onPlayerFeedbackRef.current?.("correct");
        onPlayerMoveCompleteRef.current?.();
        return true;
      }

      onPlayerFeedbackRef.current?.("wrong");
      return false;
    }

    setGame(gameCopy);
    return true;
  }

  // Visual highlights
  const highlightedSquares: Record<string, CSSProperties> = {};

  for (const sq of step?.highlightSquares ?? []) {
    highlightedSquares[sq] = {
      background: "rgba(240, 185, 11, 0.4)",
      boxShadow: "inset 0 0 0 3px rgba(240, 185, 11, 0.9)",
    };
  }

  if (step?.visualEmphasis) {
    for (const emphasis of step.visualEmphasis) {
      for (const sq of emphasis.squares) {
        if (emphasis.style === "path") {
          highlightedSquares[sq] = {
            background: "rgba(240, 185, 11, 0.22)",
            boxShadow: "inset 0 0 0 2px rgba(240, 185, 11, 0.65)",
          };
        } else if (emphasis.style === "destinations") {
          highlightedSquares[sq] = {
            background:
              "radial-gradient(circle, rgba(69, 196, 134, 0.6) 35%, transparent 36%)",
          };
        } else if (emphasis.style === "capture-target") {
          highlightedSquares[sq] = {
            background: "rgba(239, 107, 107, 0.35)",
            boxShadow: "inset 0 0 0 3px rgba(239, 107, 107, 0.9)",
          };
        }
      }
    }
  }

  if (step?.type === "coach_move" && step.move) {
    const [from, to] = step.move.split("-");
    highlightedSquares[from] = {
      background:
        "radial-gradient(circle, rgba(255, 193, 7, 0.7) 35%, transparent 36%)",
    };
    highlightedSquares[to] = {
      background:
        "radial-gradient(circle, rgba(255, 193, 7, 0.7) 35%, transparent 36%)",
    };
  }

  if (step?.type === "player_move" && step.expectedMove) {
    const [, to] = step.expectedMove.split("-");
    highlightedSquares[to] = {
      background:
        "radial-gradient(circle, rgba(69, 196, 134, 0.7) 35%, transparent 36%)",
    };
  }

  if (captureSquare) {
    highlightedSquares[captureSquare] = {
      background: "rgba(220, 38, 38, 0.4)",
      boxShadow: "inset 0 0 0 4px rgba(220, 38, 38, 0.9)",
    };
  }

  return (
    <div className={`chess-board ${step?.type ?? ""}`}>
      <Chessboard
        key={step?.id}
        options={{
          position: game.fen(),
          squareStyles: highlightedSquares,
          showAnimations: true,
          animationDurationInMs: COACH_ANIMATION_DURATION,
          allowDragging: step?.type === "player_move",
          onPieceDrop: ({ sourceSquare, targetSquare }) => {
            if (!targetSquare) return false;
            return handlePieceDrop(
              sourceSquare as Square,
              targetSquare as Square,
            );
          },
        }}
      />
    </div>
  );
}
