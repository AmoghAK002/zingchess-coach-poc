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
