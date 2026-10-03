import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Chess, type Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { LessonStep } from "../types/coach";

interface ChessBoardProps {
  /**
   * The lesson step currently being displayed.
   *
   * The step determines whether:
   * - the Coach controls the board
   * - or the player controls the board
   */
  step?: LessonStep;

  /**
   * Called when a Coach demonstration has finished.
   *
   * App uses this to unlock the Continue button.
   */
  onCoachMoveComplete?: () => void;

  /**
   * Called when the player makes the expected move.
   *
   * App uses this to mark the practice step as complete.
   */
  onPlayerMoveComplete?: () => void;
}

export function ChessBoard({
  step,
  onCoachMoveComplete,
  onPlayerMoveComplete,
}: ChessBoardProps) {
  /*
   * How long the Coach's chess movement takes.
   *
   * This value must match animationDurationInMs
   * used by react-chessboard below.
   */
  const COACH_ANIMATION_DURATION = 1800;

  // Stores the current chess position.
  // chess.js is responsible for validating chess rules.
  const [game, setGame] = useState(() => new Chess());

  // Stable refs so callbacks inside useEffect always
  // have the latest version of the props.
  const onCoachMoveCompleteRef = useRef(onCoachMoveComplete);
  const onPlayerMoveCompleteRef = useRef(onPlayerMoveComplete);
  useEffect(() => {
    onCoachMoveCompleteRef.current = onCoachMoveComplete;
  }, [onCoachMoveComplete]);
  useEffect(() => {
    onPlayerMoveCompleteRef.current = onPlayerMoveComplete;
  }, [onPlayerMoveComplete]);

  /**
   * Runs whenever the current lesson step changes.
   *
   * This is the main bridge between:
   *
   * Lesson data
   *      |
   * Coach behavior
   *      |
   * Chessboard
   */
  useEffect(() => {
    if (!step) {
      return;
    }

    // Stop any speech left over from the previous step.
    window.speechSynthesis.cancel();

    /*
     * If the lesson provides a starting position,
     * load that position before doing anything else.
     */
    if (step.setupFen) {
      setGame(new Chess(step.setupFen));
    }

    // Only coach_move steps should automatically
    // move a chess piece.
    if (step.type !== "coach_move" || !step.move) {
      return;
    }

    // Convert "a1-h1" into from="a1", to="h1"
    const [from, to] = step.move.split("-") as [Square, Square];

    /**
     * Browser speech object.
     *
     * The same text shown in the Coach message
     * is spoken aloud.
     */
    const utterance = new SpeechSynthesisUtterance(step.text);
    utterance.lang = "en-US";
    // Slower speech is easier for a beginner to follow.
    utterance.rate = 0.9;

    // Keep track of timers so React can cancel them on cleanup.
    let moveTimer: number | undefined;

    // Tracks whether the Coach's speech has finished.
    let speechFinished = false;

    // Tracks whether the chessboard animation has finished.
    let animationFinished = false;

    // Prevents the completion callback from firing twice.
    let stepCompleted = false;

    // Prevents the move from being triggered twice
    // (once by onstart, once by the fallback timer).
    let moveFired = false;

    /**
     * A Coach step is complete only when:
     * 1. The Coach finished speaking
     * 2. The board finished animating
     *
     * Once both are true, notify App exactly once.
     */
    function checkCoachMoveComplete() {
      if (speechFinished && animationFinished && !stepCompleted) {
        stepCompleted = true;
        console.log("✅ Coach step completed");
        onCoachMoveCompleteRef.current?.();
      }
    }

    /**
     * Triggers the actual chess piece movement.
     * Called either by onstart or the fallback timer.
     */
    function triggerMove() {
      if (moveFired) return;
      moveFired = true;

      moveTimer = window.setTimeout(() => {
        setGame((previousGame) => {
          const gameCopy = new Chess(previousGame.fen());
          try {
            const piece = gameCopy.get(from);
            if (!piece) {
              console.error(`Coach could not find a piece on ${from}.`);
              return previousGame;
            }
            gameCopy.setTurn(piece.color);
            gameCopy.move({ from, to, promotion: "q" });
            gameCopy.setTurn(piece.color);
            return gameCopy;
          } catch (error) {
            console.error(
              `Coach attempted an illegal move: ${from}-${to}`,
              error,
            );
            return previousGame;
          }
        });

        /*
         * react-chessboard needs time to visually
         * animate the piece to its destination.
         */
        window.setTimeout(() => {
          animationFinished = true;
          console.log("♟️ Coach animation completed");
          checkCoachMoveComplete();
        }, COACH_ANIMATION_DURATION);
      }, step?.delay ?? 0);
    }

    /**
     * Speech has started.
     * Trigger the move so the user sees it while hearing the explanation.
     */
    utterance.onstart = () => {
      console.log("🎙️ Coach started speaking");
      triggerMove();
    };

    /**
     * Fallback: Chrome/Edge sometimes never fires onstart.
     * After 1200ms, trigger the move ourselves.
     */
    const startFallback = window.setTimeout(() => {
      console.warn("⚠️ Speech onstart fallback triggered");
      triggerMove();
    }, 1200);

    /**
     * Fires when the browser finishes speaking.
     */
    utterance.onend = () => {
      speechFinished = true;
      console.log("🔊 Coach speech completed");
      checkCoachMoveComplete();
    };

    /**
     * Fallback: if speech never fires onend, mark it complete
     * after 12 seconds so the lesson doesn't get stuck.
     */
    const endFallback = window.setTimeout(() => {
      if (!speechFinished) {
        console.warn("⚠️ Speech onend fallback triggered");
        speechFinished = true;
        checkCoachMoveComplete();
      }
    }, 12000);

    // Start speaking.
    window.speechSynthesis.speak(utterance);

    /**
     * React cleanup.
     * Cancel speech and all pending timers if step changes.
     */
    return () => {
      window.speechSynthesis.cancel();
      if (moveTimer !== undefined) window.clearTimeout(moveTimer);
      window.clearTimeout(startFallback);
      window.clearTimeout(endFallback);
    };
  }, [step]);

  /**
   * Handles a move made by the PLAYER.
   *
   * This function is only allowed during
   * a player_move lesson step.
   */
  function handlePieceDrop(sourceSquare: Square, targetSquare: Square) {
    // During explanation and coach_move steps,
    // the user must not control the board.
    if (step?.type !== "player_move") {
      return false;
    }

    // Create a copy of the current position.
    const gameCopy = new Chess(game.fen());

    try {
      /*
       * chess.js checks whether the player's move
       * follows the actual rules of chess.
       */
      gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
    } catch {
      // Illegal move -> reject it.
      return false;
    }

    // Save the new player position.
    setGame(gameCopy);

    /*
     * If this lesson expects a specific move,
     * compare the player's move with that expectation.
     */
    if (step.expectedMove) {
      const actualMove = `${sourceSquare}-${targetSquare}`;

      if (actualMove === step.expectedMove) {
        console.log("✅ Player move completed");
        onPlayerMoveCompleteRef.current?.();
      }
    }

    // Tell react-chessboard that the drop succeeded.
    return true;
  }
  /*
   * Determine which squares should be highlighted.
   *
   * For a Coach demonstration:
   *   highlight the starting and destination squares.
   *
   * For a player exercise:
   *   highlight the expected destination square.
   *
   * This gives the learner a visual clue about
   * what the Coach is demonstrating or asking them to do.
   */
  const highlightedSquares: Record<string, CSSProperties> = {};

  if (step?.type === "coach_move" && step.move) {
    const [from, to] = step.move.split("-");

    highlightedSquares[from] = {
      background:
        "radial-gradient(circle, rgba(255, 193, 7, 0.55) 35%, transparent 36%)",
    };

    highlightedSquares[to] = {
      background:
        "radial-gradient(circle, rgba(255, 193, 7, 0.55) 35%, transparent 36%)",
    };
  }

  if (step?.type === "player_move" && step.expectedMove) {
    const [, to] = step.expectedMove.split("-");

    highlightedSquares[to] = {
      background:
        "radial-gradient(circle, rgba(76, 175, 80, 0.55) 35%, transparent 36%)",
    };
  }
  return (
    <div className={`chess-board ${step?.type ?? ""}`}>
      <Chessboard
        options={{
          // The FEN determines exactly what pieces
          // are displayed and where they are located.
          position: game.fen(),

          squareStyles: highlightedSquares,

          // Explicitly enable programmatic piece animations.
          showAnimations: true,

          /*
           * The Coach's piece takes 1800ms to travel
           * to its destination.
           */
          animationDurationInMs: COACH_ANIMATION_DURATION,

          /*
           * The player can drag pieces ONLY during
           * a player_move step.
           *
           * explanation -> locked
           * coach_move  -> locked
           * player_move  -> unlocked
           */
          allowDragging: step?.type === "player_move",

          /**
           * Called when the player releases a piece.
           */
          onPieceDrop: ({ sourceSquare, targetSquare }) => {
            // react-chessboard can provide no target square
            // if the piece wasn't dropped on a valid square.
            if (!targetSquare) {
              return false;
            }

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
