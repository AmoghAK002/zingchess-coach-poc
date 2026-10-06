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
     * After the guard above, this local constant gives
     * TypeScript a guaranteed LessonStep reference.
     *
     * This prevents:
     * "'step' is possibly 'undefined'"
     */
    const currentStep = step;

    window.speechSynthesis.cancel();

    const stepGame = currentStep.setupFen
      ? new Chess(currentStep.setupFen)
      : new Chess(game.fen());

    setGame(stepGame);

    if (currentStep.type !== "coach_move" || !currentStep.move) {
      return;
    }

    const [from, to] = currentStep.move.split("-") as [Square, Square];

    const utterance = new SpeechSynthesisUtterance(currentStep.text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;

    let moveTimer: number | undefined;
    let speechFinished = false;
    let animationFinished = false;
    let stepCompleted = false;
    let moveFired = false;

    function checkCoachMoveComplete() {
      if (speechFinished && animationFinished && !stepCompleted) {
        stepCompleted = true;

        console.log("✅ Coach step completed");

        onCoachMoveCompleteRef.current?.();
      }
    }

    function triggerMove() {
      if (moveFired) return;

      moveFired = true;
      const actionDelay = currentStep.actionDelay ?? 0;
      moveTimer = window.setTimeout(() => {
        setGame(() => {
          const gameCopy = new Chess(stepGame.fen());

          try {
            const piece = gameCopy.get(from);

            if (!piece) {
              console.error(`Coach could not find a piece on ${from}.`);

              return stepGame;
            }

            gameCopy.setTurn(piece.color);

            gameCopy.move({
              from,
              to,
              promotion: "q",
            });

            gameCopy.setTurn(piece.color);

            return gameCopy;
          } catch (error) {
            console.error(
              `Coach attempted an illegal move: ${from}-${to}`,
              error,
            );

            return stepGame;
          }
        });

        window.setTimeout(() => {
          animationFinished = true;

          console.log("♟️ Coach animation completed");

          checkCoachMoveComplete();
        }, COACH_ANIMATION_DURATION);
      }, actionDelay);
    }

    utterance.onstart = () => {
      console.log("🎙️ Coach started speaking");
      triggerMove();
    };

    const startFallback = window.setTimeout(() => {
      console.warn("⚠️ Speech onstart fallback triggered");
      triggerMove();
    }, 1200);

    utterance.onend = () => {
      speechFinished = true;

      console.log("🔊 Coach speech completed");

      checkCoachMoveComplete();
    };

    const endFallback = window.setTimeout(() => {
      if (!speechFinished) {
        console.warn("⚠️ Speech onend fallback triggered");

        speechFinished = true;

        checkCoachMoveComplete();
      }
    }, 12000);

    window.speechSynthesis.speak(utterance);

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
           *
           * highlightSquares comes from the lesson data.
           * This keeps the ChessBoard component independent
           * from individual lesson content.
           */
          /*
           * Combine all visual highlights used by the board.
           *
           * - highlightSquares → highlights coming from lesson data
           * - highlightedSquares → existing runtime highlights
           */
          squareStyles: {
            ...highlightedSquares,

            ...Object.fromEntries(
              (step?.highlightSquares ?? []).map((square) => [
                square,
                {
                  background: "rgba(240, 185, 11, 0.45)",
                  boxShadow: "inset 0 0 0 3px rgba(240, 185, 11, 0.85)",
                },
              ]),
            ),
          },

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
