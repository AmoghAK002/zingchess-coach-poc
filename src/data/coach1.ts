import type { Course } from "../types/coach";

export const coach1Course: Course = {
  id: "coach-1-basics",
  title: "The Basics",
  description: "Learn chess from the ground up.",

  lessons: [
    {
      id: "what-is-chess",
      title: "What is Chess?",
      description: "Learn the basic idea of chess.",
      duration: "2 min",

      steps: [
        {
          id: "chess-intro",
          type: "explanation",
          title: "Welcome to Chess",
          text: "Chess is a game for two players. Each player has an army of pieces.",
        },
        {
          id: "chess-goal",
          type: "explanation",
          title: "The Goal",
          text: "The goal is to checkmate your opponent's king.",
        },
        {
          id: "chess-board",
          type: "explanation",
          title: "The Board",
          text: "Chess is played on a board with 64 squares.",
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
      ],
    },

    {
      id: "starting-position",
      title: "Starting Position",
      description: "See where the pieces start.",
      duration: "2 min",

      steps: [
        {
          id: "starting-position-intro",
          type: "explanation",
          title: "The Starting Position",
          text: "Every chess game starts with the pieces arranged in the same way.",
          setupFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        },
        {
          id: "back-rank",
          type: "explanation",
          title: "The Back Row",
          text: "The back row contains the rooks, knights, bishops, queen and king.",
          highlightSquares: [
            "a1",
            "b1",
            "c1",
            "d1",
            "e1",
            "f1",
            "g1",
            "h1",
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
          id: "pawns-start",
          type: "explanation",
          title: "The Pawns",
          text: "Eight pawns stand in front of the other pieces.",
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
      id: "pieces",
      title: "Meet the Pieces",
      description: "Learn the names of the chess pieces.",
      duration: "3 min",

      steps: [
        {
          id: "pieces-intro",
          type: "explanation",
          title: "Six Types of Pieces",
          text: "There are six types of chess pieces: king, queen, rook, bishop, knight and pawn.",
          setupFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        },
        {
          id: "pieces-king",
          type: "explanation",
          title: "King",
          text: "Each player has one king.",
          highlightSquares: ["e1", "e8"],
        },
        {
          id: "pieces-queen",
          type: "explanation",
          title: "Queen",
          text: "Each player has one queen.",
          highlightSquares: ["d1", "d8"],
        },
        {
          id: "pieces-rook",
          type: "explanation",
          title: "Rook",
          text: "Each player has two rooks.",
          highlightSquares: ["a1", "h1", "a8", "h8"],
        },
        {
          id: "pieces-bishop",
          type: "explanation",
          title: "Bishop",
          text: "Each player has two bishops.",
          highlightSquares: ["c1", "f1", "c8", "f8"],
        },
        {
          id: "pieces-knight",
          type: "explanation",
          title: "Knight",
          text: "Each player has two knights.",
          highlightSquares: ["b1", "g1", "b8", "g8"],
        },
        {
          id: "pieces-pawn",
          type: "explanation",
          title: "Pawn",
          text: "Each player has eight pawns.",
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

          /*
           * The Coach explains what is happening.
           * This text is also spoken aloud.
           */
          text: "Watch the rook. It can move horizontally across the board.",

          /*
           * Teaching position:
           * White rook → a1
           * White king → a2
           * Black king → e8
           *
           * The first rank is clear so the rook
           * can demonstrate horizontal movement.
           */
          setupFen: "4k3/8/8/8/8/8/K7/R7 w - - 0 1",

          /*
           * Coach demonstrates:
           * a1 → h1
           */
          move: "a1-h1",

          delay: 1500,
          actionDelay: 1200,
        },

        {
          id: "rook-vertical",
          type: "coach_move",
          title: "Vertical Movement",

          /*
           * The Coach now explains that the rook
           * can also move vertically.
           */
          text: "The rook can also move vertically along a file.",

          /*
           * IMPORTANT:
           * The rook starts on h1 for THIS step.
           *
           * h1 → h5
           */
          setupFen: "4k3/8/8/8/8/8/K7/7R w - - 0 1",

          move: "h1-h5",

          delay: 900,
        },

        {
          id: "rook-practice",
          type: "player_move",
          title: "Your Turn",

          text: "Now you try. Move the rook from h5 to h8.",

          /*
           * Practice always starts from a known position.
           *
           * White rook → h5
           * White king → a2
           * Black king → e8
           */
          setupFen: "4k3/8/8/7R/8/8/K7/8 w - - 0 1",

          /*
           * The player must make:
           *
           * h5 → h8
           */
          expectedMove: "h5-h8",

          hint: "The rook can move vertically.",
        },
      ],
    },

    {
      id: "knight",
      title: "The Knight",
      description: "Learn how the knight moves.",
      duration: "4 min",

      steps: [
        {
          id: "knight-intro",
          type: "explanation",
          title: "Meet the Knight",
          text: "The knight is a chess piece that moves in an L-shape.",
        },
        {
          id: "knight-demo",
          type: "coach_move",
          title: "The L-Shape",
          text: "Watch the knight move in an L-shape.",
          setupFen: "4k3/8/8/8/8/2N5/K7/8 w - - 0 1",
          move: "c3-d5",
          delay: 500,
        },
        {
          id: "knight-practice",
          type: "player_move",
          title: "Your Turn",
          text: "Move the knight to the highlighted square.",
          setupFen: "4k3/8/8/8/8/2N5/K7/8 w - - 0 1",
          expectedMove: "c3-d5",
          hint: "The knight moves in an L-shape.",
        },
      ],
    },

    {
      id: "bishop",
      title: "The Bishop",
      description: "Learn how the bishop moves.",
      duration: "4 min",

      steps: [
        {
          id: "bishop-intro",
          type: "explanation",
          title: "Meet the Bishop",
          text: "The bishop moves diagonally.",
        },
        {
          id: "bishop-demo",
          type: "coach_move",
          title: "Diagonal Movement",
          text: "Watch the bishop move diagonally.",
          setupFen: "4k3/8/8/8/3B4/8/K7/8 w - - 0 1",
          move: "d4-h8",
          delay: 500,
        },
        {
          id: "bishop-practice",
          type: "player_move",
          title: "Your Turn",
          text: "Move the bishop to the highlighted square.",
          setupFen: "4k3/8/8/8/3B4/8/K7/8 w - - 0 1",
          expectedMove: "d4-h8",
          hint: "The bishop moves diagonally.",
        },
      ],
    },

    {
      id: "queen",
      title: "The Queen",
      description: "Learn how the queen moves.",
      duration: "4 min",

      steps: [
        {
          id: "queen-intro",
          type: "explanation",
          title: "Meet the Queen",
          text: "The queen is a powerful chess piece.",
        },
        {
          id: "queen-demo",
          type: "coach_move",
          title: "Straight Lines",
          text: "The queen can move horizontally and vertically.",
          setupFen: "4k3/8/8/8/8/8/K7/3Q4 w - - 0 1",
          move: "d1-d5",
          delay: 500,
        },
        {
          id: "queen-diagonal",
          type: "coach_move",
          title: "Diagonal Movement",
          text: "The queen can also move diagonally.",
          setupFen: "4k3/8/8/8/8/8/K7/3Q4 w - - 0 1",
          move: "d1-h5",
          delay: 900,
        },
        {
          id: "queen-practice",
          type: "player_move",
          title: "Your Turn",
          text: "Move the queen to the highlighted square.",
          setupFen: "4k3/8/8/8/8/8/K7/3Q4 w - - 0 1",
          expectedMove: "d1-d5",
          hint: "The queen can move straight or diagonally.",
        },
      ],
    },

    {
      id: "king",
      title: "The King",
      description: "Learn how the king moves.",
      duration: "4 min",

      steps: [
        {
          id: "king-intro",
          type: "explanation",
          title: "Meet the King",
          text: "The king is the most important piece in chess.",
          highlightSquares: ["e1", "e8"],
        },
        {
          id: "king-demo",
          type: "coach_move",
          title: "One Square",
          text: "The king moves one square at a time.",
          setupFen: "4k3/8/8/8/8/8/K7/8 w - - 0 1",
          move: "a2-b3",
          delay: 500,
        },
        {
          id: "king-practice",
          type: "player_move",
          title: "Your Turn",
          text: "Move the king one square to the highlighted square.",
          setupFen: "4k3/8/8/8/8/8/K7/8 w - - 0 1",
          expectedMove: "a2-b3",
          hint: "The king moves one square at a time.",
        },
      ],
    },

    {
      id: "pawn",
      title: "The Pawn",
      description: "Learn how pawns move and capture.",
      duration: "5 min",
      steps: [
        {
          id: "pawn-intro",
          type: "explanation",
          title: "Meet the Pawn",
          text: "Pawns are the smallest pieces on the board. Each player starts with eight pawns.",
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

        {
          id: "pawn-forward",
          type: "coach_move",
          title: "Moving Forward",
          text: "A pawn normally moves one square forward. Watch this pawn move from e2 to e3.",
          setupFen: "4k3/8/8/8/8/8/4P3/K7 w - - 0 1",
          move: "e2-e3",
          delay: 700,
        },

        {
          id: "pawn-two-squares",
          type: "coach_move",
          title: "The First Move",
          text: "From its starting position, a pawn can also move two squares forward.",
          setupFen: "4k3/8/8/8/8/8/4P3/K7 w - - 0 1",
          move: "e2-e4",
          delay: 700,
        },

        {
          id: "pawn-capture",
          type: "coach_move",
          title: "Capturing",
          text: "Pawns move forward, but they capture diagonally. Watch the white pawn capture the black pawn.",
          setupFen: "4k3/8/3p4/4P3/8/8/8/K7 w - - 0 1",
          move: "e5-d6",
          delay: 700,
        },

        {
          id: "pawn-practice",
          type: "player_move",
          title: "Your Turn",
          text: "Now you try. Move the pawn from e2 to e4.",
          setupFen: "4k3/8/8/8/8/8/4P3/K7 w - - 0 1",
          expectedMove: "e2-e4",
          hint: "A pawn can move two squares on its first move.",
        },
      ],
    },
  ],
};
