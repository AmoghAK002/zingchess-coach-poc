import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export function ChessBoard() {
  const [game, setGame] = useState(new Chess());

  function handlePieceDrop(
    sourceSquare: string,
    targetSquare: string
  ) {
    const gameCopy = new Chess(game.fen());

    try {
      gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
    } catch {
      return false;
    }

    setGame(gameCopy);

    return true;
  }

  return (
    <div className="chess-board">
      <Chessboard
        options={{
          position: game.fen(),
          onPieceDrop: ({
            sourceSquare,
            targetSquare,
          }) => {
            if (!targetSquare) {
              return false;
            }

            return handlePieceDrop(
              sourceSquare,
              targetSquare
            );
          },
        }}
      />
    </div>
  );
}