import type { Course } from "../types/coach";

export const coach1Course: Course = {
  id: "coach-1-basics",
  title: "The Basics",
  description: "Learn chess from the ground up.",

  lessons: [
    // ===================================================
    // LESSON 1 — WHAT IS CHESS?
    // ===================================================
    {
      id: "what-is-chess",
      title: "What is Chess?",
      description: "Start here. Learn what chess is and why it's worth learning.",
      duration: "2 min",

      steps: [
        {
          id: "chess-intro",
          type: "explanation",
          title: "Welcome",
          text: "Hi, I'm your coach. Welcome to chess.\n\nChess is a game between two players — one controls the white pieces, the other controls black. No dice, no luck. Every outcome depends entirely on your decisions.",
        },
        {
          id: "chess-goal",
          type: "explanation",
          title: "One Goal",
          text: "Your goal is simple: trap your opponent's king so it can't escape. That's called checkmate.\n\nOnce you checkmate their king, you win. That's the whole game.",
        },
        {
          id: "chess-board",
          type: "explanation",
          title: "The Board",
          text: "Chess is played on a board of 64 squares — 8 rows and 8 columns. The squares alternate between light and dark.\n\nEvery square has a name. Columns are labeled a through h. Rows are labeled 1 through 8.",
          highlightSquares: [
            "a1","b2","c3","d4","e5","f6","g7","h8",
            "h1","g2","f3","e4","d5","c6","b7","a8",
          ],
        },
      ],
    },

    // ===================================================
    // LESSON 2 — STARTING POSITION
    // ===================================================
    {
      id: "starting-position",
      title: "Starting Position",
      description: "See where every piece starts before the game begins.",
      duration: "2 min",

      steps: [
        {
          id: "starting-position-intro",
          type: "explanation",
          title: "The Setup",
          text: "Every chess game starts from the exact same position. Both sides arrange their pieces in the same way.\n\nTake a look at the board.",
          setupFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        },
        {
          id: "back-rank",
          type: "explanation",
          title: "The Back Row",
          text: "The bottom two rows belong to you — white. The top two rows belong to black.\n\nThe back row — row 1 for white, row 8 for black — holds the powerful pieces: rooks, knights, bishops, the queen, and the king.",
          highlightSquares: [
            "a1","b1","c1","d1","e1","f1","g1","h1",
            "a8","b8","c8","d8","e8","f8","g8","h8",
          ],
        },
        {
          id: "pawns-start",
          type: "explanation",
          title: "The Pawns",
          text: "The row just in front of your back row is filled with pawns — eight of them. They're like soldiers at the front line.\n\nYou'll learn how they move in a later lesson.",
          highlightSquares: [
            "a2","b2","c2","d2","e2","f2","g2","h2",
            "a7","b7","c7","d7","e7","f7","g7","h7",
          ],
        },
      ],
    },

    // ===================================================
    // LESSON 3 — MEET THE PIECES
    // ===================================================
    {
      id: "pieces",
      title: "Meet the Pieces",
      description: "Get to know all six types of chess pieces.",
      duration: "3 min",

      steps: [
        {
          id: "pieces-intro",
          type: "explanation",
          title: "Six Pieces",
          text: "There are six different types of pieces in chess: the king, the queen, the rook, the bishop, the knight, and the pawn.\n\nEach one moves in a completely different way. We'll learn each one.",
          setupFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        },
        {
          id: "pieces-king",
          type: "explanation",
          title: "The King",
          text: "This is the king. You have one. So does your opponent.\n\nProtecting your king is your most important job. If it gets trapped, you lose.",
          highlightSquares: ["e1", "e8"],
        },
        {
          id: "pieces-queen",
          type: "explanation",
          title: "The Queen",
          text: "This is the queen — your most powerful piece. She can move in any direction, as far as she wants.\n\nLose the queen and you're in serious trouble.",
          highlightSquares: ["d1", "d8"],
        },
        {
          id: "pieces-rook",
          type: "explanation",
          title: "The Rook",
          text: "These are the rooks. You have two of them — one in each corner.\n\nThey're strong pieces that control entire rows and columns.",
          highlightSquares: ["a1", "h1", "a8", "h8"],
        },
        {
          id: "pieces-bishop",
          type: "explanation",
          title: "The Bishop",
          text: "These are the bishops. You have two — one stays on light squares, the other on dark squares, forever.\n\nThey move diagonally across the board.",
          highlightSquares: ["c1", "f1", "c8", "f8"],
        },
        {
          id: "pieces-knight",
          type: "explanation",
          title: "The Knight",
          text: "These are the knights. They look like horses — and they move unlike any other piece.\n\nThe knight is the only piece that can jump over others.",
          highlightSquares: ["b1", "g1", "b8", "g8"],
        },
        {
          id: "pieces-pawn",
          type: "explanation",
          title: "The Pawn",
          text: "These are the pawns. Each player starts with eight.\n\nThey're the smallest pieces, but don't underestimate them — a pawn that reaches the other side of the board can become a queen.",
          highlightSquares: [
            "a2","b2","c2","d2","e2","f2","g2","h2",
            "a7","b7","c7","d7","e7","f7","g7","h7",
          ],
        },
      ],
    },

    // ===================================================
    // LESSON 4 — THE ROOK
    // ===================================================
    {
      id: "rook",
      title: "The Rook",
      description: "Learn how the rook moves across the board.",
      duration: "5 min",

      steps: [
        {
          id: "rook-intro",
          type: "explanation",
          title: "Meet the Rook",
          text: "The rook is one of your most powerful pieces. It looks like a castle tower.\n\nOne key thing to know: the rook is great in open positions — when there's nothing blocking its path.",
          setupFen: "4k3/8/8/8/8/8/K7/R7 w - - 0 1",
          highlightSquares: ["a1"],
        },

        {
          id: "rook-horizontal",
          type: "coach_move",
          title: "Moving Across a Row",
          text: "Take a look at this rook. See how the entire first row is completely open? That means it can slide all the way across. Watch as I move it from one side to the other.",
          setupFen: "4k3/8/8/8/8/8/K7/R7 w - - 0 1",
          move: "a1-h1",
          /*
           * "Watch as I move it" begins around word 22.
           * elapsedMs fallback: 3800ms — roughly when that phrase is spoken.
           */
          actionTrigger: { mode: "word", wordIndex: 22, elapsedMs: 3800 },
          visualEmphasis: [
            { squares: ["a1","b1","c1","d1","e1","f1","g1","h1"], style: "path" },
          ],
        },

        {
          id: "rook-vertical",
          type: "coach_move",
          title: "Moving Up a Column",
          text: "The rook can also move vertically — straight up or down a column. Watch it travel up the h-file.",
          setupFen: "4k3/8/8/8/8/8/K7/7R w - - 0 1",
          move: "h1-h5",
          /*
           * "Watch it travel" is around word 14.
           * elapsedMs fallback: 2200ms.
           */
          actionTrigger: { mode: "word", wordIndex: 14, elapsedMs: 2200 },
          visualEmphasis: [
            { squares: ["h1","h2","h3","h4","h5"], style: "path" },
          ],
        },

        {
          id: "rook-summary",
          type: "explanation",
          title: "Rook Rule",
          text: "Simple rule: the rook moves in straight lines only — horizontally or vertically. It can go as far as it wants, but it can never move diagonally.\n\nNow it's your turn to try.",
          setupFen: "4k3/8/8/7R/8/8/K7/8 w - - 0 1",
        },

        {
          id: "rook-practice",
          type: "player_move",
          title: "Your Turn",
          text: "The rook is on h5. Can you move it all the way up to h8?\n\nDrag the rook and drop it on h8.",
          setupFen: "4k3/8/8/7R/8/8/K7/8 w - - 0 1",
          expectedMove: "h5-h8",
          hint: "Keep the rook on the h-column and drag it straight up.",
          feedbackCorrect: "Nice! That's exactly it. You moved the rook straight up the column.",
          feedbackWrong: "Good try — but that's not quite what we're practicing here. Move the rook vertically, all the way up to h8.",
          feedbackIllegal: "The rook can't move that way. It only moves in straight lines — same row or same column. Give it another go.",
        },
      ],
    },

    // ===================================================
    // LESSON 5 — THE KNIGHT
    // ===================================================
    {
      id: "knight",
      title: "The Knight",
      description: "The knight moves unlike any other piece — learn the L-shape.",
      duration: "4 min",

      steps: [
        {
          id: "knight-intro",
          type: "explanation",
          title: "Meet the Knight",
          text: "The knight is the most unusual piece on the board. It's the only piece that can jump over others — nothing blocks it.\n\nIt moves in an L-shape: two squares in one direction, then one square to the side.",
          setupFen: "4k3/8/8/8/8/2N5/K7/8 w - - 0 1",
          highlightSquares: ["c3"],
        },
        {
          id: "knight-demo",
          type: "coach_move",
          title: "The L-Shape Jump",
          text: "See the knight on c3? It's going to jump in an L-shape. Two squares up, one square to the right. Watch the jump.",
          setupFen: "4k3/8/8/8/8/2N5/K7/8 w - - 0 1",
          move: "c3-d5",
          /*
           * "Watch the jump" is around word 18.
           * elapsedMs fallback: 2800ms.
           */
          actionTrigger: { mode: "word", wordIndex: 18, elapsedMs: 2800 },
          visualEmphasis: [
            { squares: ["b5","d5","a4","a2","b1","d1","e2","e4"], style: "destinations" },
          ],
        },
        {
          id: "knight-practice",
          type: "player_move",
          title: "Your Turn",
          text: "Same position. The knight is on c3.\n\nCan you make the same L-shaped jump to d5?",
          setupFen: "4k3/8/8/8/8/2N5/K7/8 w - - 0 1",
          expectedMove: "c3-d5",
          hint: "Two squares up from c3, then one to the right — that lands on d5.",
          feedbackCorrect: "Perfect jump! That's the L-shape exactly.",
          feedbackWrong: "That's a valid square for the knight, but try the specific move to d5 for this exercise.",
          feedbackIllegal: "The knight moves in an L: two squares in one direction, then one to the side. It can't move any other way.",
        },
      ],
    },

    // ===================================================
    // LESSON 6 — THE BISHOP
    // ===================================================
    {
      id: "bishop",
      title: "The Bishop",
      description: "Learn how the bishop cuts across the board diagonally.",
      duration: "4 min",

      steps: [
        {
          id: "bishop-intro",
          type: "explanation",
          title: "Meet the Bishop",
          text: "The bishop is a long-range piece that moves exclusively on diagonals.\n\nOne important detail: each bishop is confined to either the light squares or the dark squares for the entire game. It can never switch.",
          setupFen: "4k3/8/8/8/3B4/8/K7/8 w - - 0 1",
          highlightSquares: ["d4"],
        },
        {
          id: "bishop-demo",
          type: "coach_move",
          title: "Cutting Diagonally",
          text: "Look at the bishop on d4. The diagonals are wide open. I'm going to send it all the way to h8 in one move. Watch it slide along the diagonal.",
          setupFen: "4k3/8/8/8/3B4/8/K7/8 w - - 0 1",
          move: "d4-h8",
          /*
           * "Watch it slide" is around word 22.
           * elapsedMs fallback: 3500ms.
           */
          actionTrigger: { mode: "word", wordIndex: 22, elapsedMs: 3500 },
          visualEmphasis: [
            { squares: ["d4","e5","f6","g7","h8"], style: "path" },
          ],
        },
        {
          id: "bishop-practice",
          type: "player_move",
          title: "Your Turn",
          text: "The bishop is back on d4. Can you move it diagonally all the way to h8?",
          setupFen: "4k3/8/8/8/3B4/8/K7/8 w - - 0 1",
          expectedMove: "d4-h8",
          hint: "Follow the diagonal: d4 → e5 → f6 → g7 → h8.",
          feedbackCorrect: "Beautiful! Right along the diagonal.",
          feedbackWrong: "The bishop can only move on diagonals. Try sending it to h8 this time.",
          feedbackIllegal: "The bishop only moves diagonally — it can't go straight or sideways.",
        },
      ],
    },

    // ===================================================
    // LESSON 7 — THE QUEEN
    // ===================================================
    {
      id: "queen",
      title: "The Queen",
      description: "Discover why the queen is the most powerful piece on the board.",
      duration: "4 min",

      steps: [
        {
          id: "queen-intro",
          type: "explanation",
          title: "Meet the Queen",
          text: "The queen is your most powerful piece — and it's not even close.\n\nShe combines everything: the rook's straight-line movement AND the bishop's diagonals. She can reach almost anywhere on the board in a single move.",
          setupFen: "4k3/8/8/8/8/8/K7/3Q4 w - - 0 1",
          highlightSquares: ["d1"],
        },
        {
          id: "queen-demo-straight",
          type: "coach_move",
          title: "Moving in a Straight Line",
          text: "The queen can move exactly like a rook — straight up, down, left, or right. Watch her move up the d-file.",
          setupFen: "4k3/8/8/8/8/8/K7/3Q4 w - - 0 1",
          move: "d1-d5",
          actionTrigger: { mode: "word", wordIndex: 16, elapsedMs: 2500 },
          visualEmphasis: [
            { squares: ["d1","d2","d3","d4","d5"], style: "path" },
          ],
        },
        {
          id: "queen-demo-diagonal",
          type: "coach_move",
          title: "Moving Diagonally",
          text: "And just like a bishop, the queen also moves diagonally. Same piece — completely different direction. Here she goes from d1 along the diagonal.",
          setupFen: "4k3/8/8/8/8/8/K7/3Q4 w - - 0 1",
          move: "d1-h5",
          actionTrigger: { mode: "word", wordIndex: 18, elapsedMs: 2800 },
          visualEmphasis: [
            { squares: ["d1","e2","f3","g4","h5"], style: "path" },
          ],
        },
        {
          id: "queen-practice",
          type: "player_move",
          title: "Your Turn",
          text: "Queen is on d1. Move her straight up to d5.\n\nRemember — she can go straight or diagonally.",
          setupFen: "4k3/8/8/8/8/8/K7/3Q4 w - - 0 1",
          expectedMove: "d1-d5",
          hint: "Go straight up the d-column: d1 → d5.",
          feedbackCorrect: "That's the queen doing what she does best.",
          feedbackWrong: "The queen can definitely move there, but for this exercise let's practice moving straight up to d5.",
          feedbackIllegal: "The queen moves in straight lines or diagonals. That direction isn't one of them.",
        },
      ],
    },

    // ===================================================
    // LESSON 8 — THE KING
    // ===================================================
    {
      id: "king",
      title: "The King",
      description: "Learn how the king moves — and why protecting it matters most.",
      duration: "4 min",

      steps: [
        {
          id: "king-intro",
          type: "explanation",
          title: "The Most Important Piece",
          text: "The king is the most important piece — but also the most limited.\n\nThe king can move in any direction, just like the queen. But there's a big difference: it can only move one square at a time.",
          setupFen: "4k3/8/8/8/8/8/K7/8 w - - 0 1",
          highlightSquares: ["a2"],
        },
        {
          id: "king-demo",
          type: "coach_move",
          title: "One Step at a Time",
          text: "Watch the king move. It can go in any direction — but only one square. Here it moves diagonally from a2 to b3.",
          setupFen: "4k3/8/8/8/8/8/K7/8 w - - 0 1",
          move: "a2-b3",
          actionTrigger: { mode: "word", wordIndex: 17, elapsedMs: 2600 },
          visualEmphasis: [
            { squares: ["a1","a2","a3","b1","b2","b3"], style: "destinations" },
          ],
        },
        {
          id: "king-practice",
          type: "player_move",
          title: "Your Turn",
          text: "Move the king from a2 to b3. One step diagonally.",
          setupFen: "4k3/8/8/8/8/8/K7/8 w - - 0 1",
          expectedMove: "a2-b3",
          hint: "The king moves one square in any direction — try one step to the upper right.",
          feedbackCorrect: "Exactly right. One step, any direction.",
          feedbackWrong: "The king can only move one square at a time. Try moving it just one step to b3.",
          feedbackIllegal: "The king moves one square at a time, in any direction. That move is too far, or blocked.",
        },
      ],
    },

    // ===================================================
    // LESSON 9 — THE PAWN
    // ===================================================
    {
      id: "pawn",
      title: "The Pawn",
      description: "Learn how pawns move, and the surprising way they capture.",
      duration: "5 min",

      steps: [
        {
          id: "pawn-intro",
          type: "explanation",
          title: "The Pawn",
          text: "Pawns are the smallest pieces on the board — but they have a special rule that makes them dangerous: if a pawn reaches the other end of the board, it can become a queen.\n\nFor now, let's learn how they move.",
          setupFen: "4k3/8/8/8/8/8/4P3/K7 w - - 0 1",
          highlightSquares: ["e2"],
        },

        {
          id: "pawn-forward",
          type: "coach_move",
          title: "Moving Forward",
          text: "A pawn moves straight forward, one square at a time. It can never move backward. Watch this pawn step forward one square.",
          setupFen: "4k3/8/8/8/8/8/4P3/K7 w - - 0 1",
          move: "e2-e3",
          actionTrigger: { mode: "word", wordIndex: 18, elapsedMs: 2800 },
          visualEmphasis: [
            { squares: ["e2","e3"], style: "path" },
          ],
        },

        {
          id: "pawn-two-squares",
          type: "coach_move",
          title: "The First-Move Option",
          text: "There's one special rule: on its very first move, a pawn can choose to advance two squares instead of one. It's optional — but useful for getting into the game faster. Watch.",
          setupFen: "4k3/8/8/8/8/8/4P3/K7 w - - 0 1",
          move: "e2-e4",
          actionTrigger: { mode: "word", wordIndex: 24, elapsedMs: 3800 },
          visualEmphasis: [
            { squares: ["e2","e3","e4"], style: "path" },
          ],
        },

        {
          id: "pawn-capture",
          type: "coach_move",
          title: "How Pawns Capture",
          text: "Here's the interesting part. Pawns move forward, but they capture diagonally. See that black pawn on d6? The white pawn can't take it by going straight. It has to strike diagonally. Watch.",
          setupFen: "4k3/8/3p4/4P3/8/8/8/K7 w - - 0 1",
          move: "e5-d6",
          actionTrigger: { mode: "word", wordIndex: 29, elapsedMs: 4500 },
          visualEmphasis: [
            { squares: ["d6"], style: "capture-target" },
          ],
        },

        {
          id: "pawn-practice",
          type: "player_move",
          title: "Your Turn",
          text: "The pawn is on e2. Move it two squares forward to e4.\n\nRemember — on its first move, a pawn can go one or two squares.",
          setupFen: "4k3/8/8/8/8/8/4P3/K7 w - - 0 1",
          expectedMove: "e2-e4",
          hint: "Move the pawn from e2 straight forward to e4.",
          feedbackCorrect: "That's it! Two squares on the first move — a great way to open the game.",
          feedbackWrong: "That's a valid pawn move, but let's practice the two-square first move. Try moving from e2 to e4.",
          feedbackIllegal: "Pawns can only move straight forward. Try moving it to e3 or e4.",
        },
      ],
    },
  ],
};
