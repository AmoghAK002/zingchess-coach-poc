import type { Course } from "../types/coach";

export const coach1Course: Course = {
  id: "coach-1-basics",
  title: "The Basics",
  description: "Learn chess from the ground up.",

  lessons: [
    {
      id: "what-is-chess",
      title: "What is Chess?",
      description: "Understand the chessboard and the goal of the game.",
      duration: "3 min",

      steps: [
        {
          id: "welcome",
          type: "explanation",
          title: "Welcome to Chess",
          text: "Chess is a two-player strategy game. The goal is to checkmate your opponent's king.",
        },

        {
          id: "board-intro",
          type: "explanation",
          title: "The Chessboard",
          text: "This is the chessboard. It has 64 squares arranged in 8 ranks and 8 files.",

          /*
           * Highlight the entire board.
           *
           * The Coach is introducing the board
           * as a whole.
           */
          highlightSquares: [
            "a1",
            "b1",
            "c1",
            "d1",
            "e1",
            "f1",
            "g1",
            "h1",

            "a2",
            "b2",
            "c2",
            "d2",
            "e2",
            "f2",
            "g2",
            "h2",

            "a3",
            "b3",
            "c3",
            "d3",
            "e3",
            "f3",
            "g3",
            "h3",

            "a4",
            "b4",
            "c4",
            "d4",
            "e4",
            "f4",
            "g4",
            "h4",

            "a5",
            "b5",
            "c5",
            "d5",
            "e5",
            "f5",
            "g5",
            "h5",

            "a6",
            "b6",
            "c6",
            "d6",
            "e6",
            "f6",
            "g6",
            "h6",

            "a7",
            "b7",
            "c7",
            "d7",
            "e7",
            "f7",
            "g7",
            "h7",

            "a8",
            "b8",
            "c8",
            "d8",
            "e8",
            "f8",
            "g8",
            "h8",
          ],
        },

        {
          id: "pieces-intro",
          type: "explanation",
          title: "The Pieces",
          text: "Each player starts with six different types of chess pieces.",
        },

        {
          id: "piece-king",
          type: "explanation",
          title: "The King",
          text: "Each player has one king. The king is the most important piece because losing it means losing the game.",
          highlightSquares: ["e1", "e8"],
        },

        {
          id: "piece-queen",
          type: "explanation",
          title: "The Queen",
          text: "Each player has one queen. The queen is the most powerful piece on the board.",
          highlightSquares: ["d1", "d8"],
        },

        {
          id: "piece-rooks",
          type: "explanation",
          title: "The Rooks",
          text: "Each player starts with two rooks. Rooks begin in the corners of the board.",
          highlightSquares: ["a1", "h1", "a8", "h8"],
        },

        {
          id: "piece-bishops",
          type: "explanation",
          title: "The Bishops",
          text: "Each player starts with two bishops. Bishops move along diagonals.",
          highlightSquares: ["c1", "f1", "c8", "f8"],
        },

        {
          id: "piece-knights",
          type: "explanation",
          title: "The Knights",
          text: "Each player starts with two knights. Knights are the only pieces that can jump over other pieces.",
          highlightSquares: ["b1", "g1", "b8", "g8"],
        },

        {
          id: "piece-pawns",
          type: "explanation",
          title: "The Pawns",
          text: "Each player starts with eight pawns. Pawns form the front line of the army.",
          highlightSquares: [
            "a2",
            "b2",
            "c2",
            "d2",
            "e2",
            "f2",
            "g2",
            "h2",
            "a7",
            "b7",
            "c7",
            "d7",
            "e7",
            "f7",
            "g7",
            "h7",
          ],
        },
      ],
    },

    {
      id: "rook",
      title: "The Rook",
      description: "Learn what the rook is and how it moves.",
      duration: "5 min",

      steps: [
        {
          id: "rook-intro",
          type: "explanation",
          title: "Meet the Rook",
          text: "This is a rook. Each player starts with two rooks.",
        },

        {
          id: "rook-horizontal",
          type: "coach_move",
          title: "Horizontal Movement",

          // The Coach explains what is happening.
          // This text will also be spoken aloud.
          text: "Watch the rook. It can move horizontally across the board.",

          // Special teaching position:
          // White rook is on a1.
          // White king is safely on a2.
          // Black king is on e8.
          // The entire first rank is clear,
          // allowing the rook to demonstrate horizontal movement.
          setupFen: "4k3/8/8/8/8/8/K7/R7 w - - 0 1",

          // Coach demonstrates the rook moving
          // from a1 to h1.
          move: "a1-h1",

          // Small pause before the demonstration begins.
          delay: 500,
        },

        {
          id: "rook-vertical",
          type: "coach_move",
          title: "Vertical Movement",

          // The Coach explains the second direction
          // while demonstrating it on the board.
          text: "The rook can also move vertically along a file.",

          // Move the rook from its current position
          // on h1 upward to h5.
          move: "h1-h5",

          // Give the player enough time to hear
          // the beginning of the explanation.
          delay: 900,
        },

        {
          id: "rook-practice",
          type: "player_move",
          title: "Your Turn",

          text: "Now you try. Move the rook from h5 to h8.",

          expectedMove: "h5-h8",

          hint: "The rook can move vertically.",
        },
      ],
    },
  ],
};
