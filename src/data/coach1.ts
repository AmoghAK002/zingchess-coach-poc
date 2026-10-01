import type { Course } from "../types/coach";

export const coach1Course: Course = {
  id: "coach-1-basics",
  title: "The Basics",
  description: "Learn chess from the ground up.",

  lessons: [
    {
      id: "what-is-chess",
      title: "What is Chess?",
      description: "Understand the goal of chess.",
      duration: "3 min",

      steps: [
        {
          id: "intro",
          type: "explanation",
          title: "Welcome to Chess",
          text: "Chess is a two-player strategy game. The goal is to checkmate the opponent's king.",
        },

        {
          id: "board-intro",
          type: "explanation",
          title: "The Board",
          text: "A chessboard has 64 squares arranged in 8 ranks and 8 files.",
        },
      ],
    },

    {
      id: "pawns",
      title: "How Pawns Move",
      description: "Learn the basic movement of the pawn.",
      duration: "5 min",

      steps: [
        {
          id: "pawn-explain",
          type: "explanation",
          title: "Meet the Pawn",
          text: "Pawns normally move one square forward. From their starting square, they may move two squares.",
        },

        {
          id: "pawn-practice",
          type: "player_move",
          title: "Your Turn",
          text: "Try moving the pawn from e2 to e4.",
          expectedMove: "e2-e4",
          hint: "This pawn is on its starting square, so it can move two squares forward.",
        },
      ],
    },
  ],
};