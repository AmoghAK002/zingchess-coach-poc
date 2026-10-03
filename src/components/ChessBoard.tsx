import { useEffect, useRef, useState, type CSSProperties } from "react";

import { Chess, type Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { LessonStep } from "../types/coach";

/*
 * Describes what happened when the player attempted a move.
 *
 * This is separate from the lesson interaction state.
 *
 * "correct"
 *   → The player made the move requested by the lesson.
 *
 * "wrong"
 *   → The player made a legal chess move,
 *     but it wasn't the move requested by the lesson.
 *
 * "illegal"
 *   → The attempted move violates chess rules.
 *
 * "hint"
 *   → Reserved for future hint functionality.
 */
export type PlayerFeedback = "none" | "correct" | "wrong" | "illegal" | "hint";

interface ChessBoardProps {
  /**
   * The lesson step currently being displayed.
   *
   * The step determines whether:
   * - the Coach controls the board
   * - or the player controls it
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

  /**
   * Sends the result of the player's move
   * back to the App component.
   *
   * This allows the Coach UI to display:
   * - correct
   * - wrong
   * - illegal
   * feedback.
   */
  onPlayerFeedback?: (feedback: PlayerFeedback) => void;
}

export function ChessBoard({
  step,
  onCoachMoveComplete,
  onPlayerMoveComplete,
  onPlayerFeedback,
}: ChessBoardProps) {
  /*
   * How long the Coach's chess movement takes.
   *
   * This value must match animationDurationInMs
   * used by react-chessboard below.
   */
  const COACH_ANIMATION_DURATION = 1800;

  /*
   * Stores the current chess position.
   *
   * chess.js is responsible for validating
   * actual chess rules.
   */
  const [game, setGame] = useState(() => new Chess());

  /*
   * Stable refs keep the latest callbacks available
   * inside effects without forcing the chess/speech
   * effect to restart every time App re-renders.
   */
  const onCoachMoveCompleteRef = useRef(onCoachMoveComplete);

  const onPlayerMoveCompleteRef = useRef(onPlayerMoveComplete);

  const onPlayerFeedbackRef = useRef(onPlayerFeedback);

  /*
   * Keep callback refs synchronized with the latest
   * functions received from App.
   */
  useEffect(() => {
    onCoachMoveCompleteRef.current = onCoachMoveComplete;
  }, [onCoachMoveComplete]);

  useEffect(() => {
    onPlayerMoveCompleteRef.current = onPlayerMoveComplete;
  }, [onPlayerMoveComplete]);

  useEffect(() => {
    onPlayerFeedbackRef.current = onPlayerFeedback;
  }, [onPlayerFeedback]);

  /**
   * Runs whenever the current lesson step changes.
   *
   * This is the bridge between:
   *
   * Lesson data
   *      ↓
   * Coach behavior
   *      ↓
   * Chessboard
   */
  useEffect(() => {
    if (!step) {
      return;
    }

    /*
     * Stop any speech left over from the previous step.
     */
    window.speechSynthesis.cancel();

    /*
     * If the lesson provides a starting position,
     * load that position.
     */
    if (step.setupFen) {
      setGame(new Chess(step.setupFen));
    }

    /*
     * Only coach_move steps automatically
     * demonstrate a chess move.
     */
    if (step.type !== "coach_move" || !step.move) {
      return;
    }

    /*
     * Convert:
     *
     * "a1-h1"
     *
     * into:
     *
     * from = "a1"
     * to   = "h1"
     */
    const [from, to] = step.move.split("-") as [Square, Square];

    /*
     * Browser speech object.
     *
     * The same explanation shown in the UI
     * is spoken by the Coach.
     */
    const utterance = new SpeechSynthesisUtterance(step.text);

    utterance.lang = "en-US";

    /*
     * Slightly slower speech makes explanations
     * easier for beginners to follow.
     */
    utterance.rate = 0.9;

    /*
     * Timer used to trigger the Coach's movement.
     */
    let moveTimer: number | undefined;

    /*
     * Tracks whether the Coach finished speaking.
     */
    let speechFinished = false;

    /*
     * Tracks whether the board animation finished.
     */
    let animationFinished = false;

    /*
     * Prevents completion from firing more than once.
     */
    let stepCompleted = false;

    /*
     * Prevents the move from being triggered twice.
     *
     * This can happen because some browsers fire
     * speech.onstart while our fallback timer may
     * also trigger.
     */
    let moveFired = false;

    /**
     * A Coach step is complete only when:
     *
     * 1. Speech has finished
     * 2. Board animation has finished
     *
     * Then App is notified exactly once.
     */
    function checkCoachMoveComplete() {
      if (speechFinished && animationFinished && !stepCompleted) {
        stepCompleted = true;

        console.log("✅ Coach step completed");

        onCoachMoveCompleteRef.current?.();
      }
    }

    /**
     * Performs the Coach's chess demonstration.
     */
    function triggerMove() {
      /*
       * Prevent duplicate movement.
       */
      if (moveFired) {
        return;
      }

      moveFired = true;

      moveTimer = window.setTimeout(() => {
        setGame((previousGame) => {
          /*
           * Work on a copy instead of mutating
           * the existing React state.
           */
          const gameCopy = new Chess(previousGame.fen());

          try {
            /*
             * Find the piece the Coach wants to move.
             */
            const piece = gameCopy.get(from);

            if (!piece) {
              console.error(`Coach could not find a piece on ${from}.`);

              return previousGame;
            }

            /*
             * The Coach is demonstrating movement,
             * not playing a normal alternating chess game.
             *
             * Therefore make the demonstrated piece's
             * color the side to move.
             */
            gameCopy.setTurn(piece.color);

            /*
             * Let chess.js validate the movement.
             */
            gameCopy.move({
              from,
              to,
              promotion: "q",
            });

            /*
             * Keep the same side to move so another
             * Coach demonstration can use the piece.
             */
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
         * Give react-chessboard enough time to finish
         * its visual movement animation.
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
     *
     * The chess movement starts while the Coach
     * is speaking so the explanation and movement
     * feel synchronized.
     */
    utterance.onstart = () => {
      console.log("🎙️ Coach started speaking");

      triggerMove();
    };

    /*
     * Browser fallback.
     *
     * Some browsers can occasionally fail to fire
     * speechSynthesis.onstart.
     */
    const startFallback = window.setTimeout(() => {
      console.warn("⚠️ Speech onstart fallback triggered");

      triggerMove();
    }, 1200);

    /**
     * Fires when the Coach finishes speaking.
     */
    utterance.onend = () => {
      speechFinished = true;

      console.log("🔊 Coach speech completed");

      checkCoachMoveComplete();
    };

    /*
     * Browser fallback for speech completion.
     *
     * This prevents a lesson from becoming permanently
     * stuck if the browser never fires onend.
     */
    const endFallback = window.setTimeout(() => {
      if (!speechFinished) {
        console.warn("⚠️ Speech onend fallback triggered");

        speechFinished = true;

        checkCoachMoveComplete();
      }
    }, 12000);

    /*
     * Start speaking.
     */
    window.speechSynthesis.speak(utterance);

    /*
     * React cleanup.
     *
     * If the learner changes steps before the Coach
     * finishes, cancel all speech and timers.
     */
    return () => {
      window.speechSynthesis.cancel();

      if (moveTimer !== undefined) {
        window.clearTimeout(moveTimer);
      }

      window.clearTimeout(startFallback);
      window.clearTimeout(endFallback);
    };
  }, [step]);

  /**
   * Handles a move made by the PLAYER.
   *
   * This function is only active during
   * a player_move lesson step.
   */
  /**
   * Handles a move made by the PLAYER.
   *
   * There are three possible outcomes:
   *
   * 1. Illegal chess move
   *    → Reject the move.
   *
   * 2. Legal chess move, but wrong lesson answer
   *    → Show "wrong" feedback.
   *    → Keep the board unchanged so the player can retry.
   *
   * 3. Correct lesson move
   *    → Update the board.
   *    → Complete the exercise.
   */
  function handlePieceDrop(sourceSquare: Square, targetSquare: Square) {
    /*
     * The player can interact only during
     * a player_move step.
     */
    if (step?.type !== "player_move") {
      return false;
    }

    /*
     * Clear feedback from the previous attempt.
     *
     * The next move will replace it with:
     * correct / wrong / illegal.
     */
    onPlayerFeedbackRef.current?.("none");

    /*
     * Create a copy of the current chess position.
     *
     * We validate the player's move on this copy.
     *
     * The actual React state will only be updated
     * if the move is the correct lesson answer.
     */
    const gameCopy = new Chess(game.fen());

    /*
     * Find the piece the player is trying to move.
     */
    const piece = gameCopy.get(sourceSquare);

    if (!piece) {
      console.error(`No chess piece found on ${sourceSquare}.`);

      return false;
    }

    /*
     * IMPORTANT:
     *
     * These Coach lessons are isolated teaching exercises.
     *
     * We are not necessarily playing a normal
     * alternating chess game.
     *
     * Therefore, make the piece being demonstrated
     * the side to move before validating it.
     *
     * This prevents a stale turn from incorrectly
     * classifying a legal teaching move as illegal.
     */
    gameCopy.setTurn(piece.color);

    try {
      /*
       * chess.js now checks the ACTUAL chess rules.
       *
       * Example:
       *
       * h5 → h6
       *
       * is legal for a rook.
       */
      gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
    } catch {
      /*
       * The move violates an actual chess rule.
       *
       * Example:
       *
       * rook h5 → g6
       *
       * A rook cannot move diagonally.
       */
      console.log("🚫 Illegal player move");

      onPlayerFeedbackRef.current?.("illegal");

      /*
       * Reject the move.
       *
       * The board remains at the original position.
       */
      return false;
    }

    /*
     * At this point we KNOW:
     *
     * The move is legal chess.
     *
     * Now perform the second layer of validation:
     *
     * "Is this the move requested by the lesson?"
     */
    if (step.expectedMove) {
      const actualMove = `${sourceSquare}-${targetSquare}`;

      /*
       * -----------------------------------------
       * CORRECT LESSON MOVE
       * -----------------------------------------
       */
      if (actualMove === step.expectedMove) {
        console.log("✅ Correct player move");

        /*
         * Update the board because the player
         * successfully completed the exercise.
         */
        setGame(gameCopy);

        /*
         * Tell App that the answer was correct.
         */
        onPlayerFeedbackRef.current?.("correct");

        /*
         * Unlock Continue.
         */
        onPlayerMoveCompleteRef.current?.();

        /*
         * Tell react-chessboard that the drop
         * was accepted.
         */
        return true;
      }

      /*
       * -----------------------------------------
       * LEGAL BUT WRONG LESSON MOVE
       * -----------------------------------------
       *
       * Example:
       *
       * Expected:
       * h5 → h8
       *
       * Player:
       * h5 → h6
       *
       * This is legal chess, but it isn't
       * the answer requested by the lesson.
       */
      console.log("❌ Legal but wrong player move");

      onPlayerFeedbackRef.current?.("wrong");

      /*
       * IMPORTANT:
       *
       * Do NOT update React's game state.
       *
       * This keeps the rook on h5 so the player
       * can try again.
       */
      return false;
    }

    /*
     * If this particular lesson step doesn't specify
     * an expected move, accept the legal move.
     */
    setGame(gameCopy);

    return true;
  }

  /**
   * Determine which squares should be highlighted.
   *
   * Coach move:
   *   Highlight source + destination.
   *
   * Player move:
   *   Highlight expected destination.
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
          /*
           * FEN represents the current chess position.
           */
          position: game.fen(),

          /*
           * Visual guidance for the current lesson.
           */
          squareStyles: highlightedSquares,

          /*
           * Enable programmatic animations.
           */
          showAnimations: true,

          /*
           * Coach movement duration.
           */
          animationDurationInMs: COACH_ANIMATION_DURATION,

          /*
           * Player can only drag pieces during
           * player_move steps.
           */
          allowDragging: step?.type === "player_move",

          /**
           * Called when the player drops a piece.
           */
          onPieceDrop: ({ sourceSquare, targetSquare }) => {
            /*
             * No target means the piece was not
             * dropped on a valid square.
             */
            if (!targetSquare) {
              return false;
            }

            /*
             * react-chessboard gives us strings.
             *
             * Chess.js expects its stricter Square type.
             */
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
