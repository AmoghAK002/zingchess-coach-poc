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
          id: "welcome",
          type: "explanation",
          title: "Welcome to Chess",
          text: "Chess is a two-player strategy game. The goal is to checkmate your opponent's king.",
        },

        {
          id: "board-intro",
          type: "explanation",
          title: "The Chessboard",
          text: "A chessboard has 64 squares arranged in 8 ranks and 8 files.",
        },

        {
          id: "pieces-intro",
          type: "explanation",
          title: "The Pieces",
          text: "Each player starts with one king, one queen, two rooks, two bishops, two knights, and eight pawns.",
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
          text: "Watch the rook. It can move horizontally across the board.",
          move: "a1-h1",
          delay: 700,
        },

        {
          id: "rook-vertical",
          type: "coach_move",
          title: "Vertical Movement",
          text: "The rook can also move vertically along a file.",
          move: "h1-h5",
          delay: 700,
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

    {
      id: "pawns",
      title: "How Pawns Move",
      description: "Learn the basic movement of the pawn.",
      duration: "5 min",

      steps: [
        {
          id: "pawn-intro",
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