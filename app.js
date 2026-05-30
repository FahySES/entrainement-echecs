(function () {
  "use strict";

  const CATEGORY_LABELS = {
    all: "Tous les exercices",
    mate1: "Exercices de mat en 1",
    mate2: "Exercices de mat en 2",
    tactic1: "Tactiques en 1 coup",
    endgame: "Finales basiques",
    special: "Entraînement spécial"
  };

  const PIECES = {
    p: "pion",
    n: "cavalier",
    b: "fou",
    r: "tour",
    q: "dame",
    k: "roi"
  };

  const engineHooks = {
    stockfish: null,
    lichessImporter: null,
    generator: null
  };

  const state = {
    game: null,
    puzzle: null,
    validPuzzles: [],
    validationReport: null,
    selected: null,
    orientation: "w",
    lineIndex: 0,
    solved: false,
    successes: 0,
    attempts: 0
  };

  const boardEl = document.getElementById("board");
  const categorySelect = document.getElementById("categorySelect");
  const newPuzzleBtn = document.getElementById("newPuzzleBtn");
  const hintBtn = document.getElementById("hintBtn");
  const mobileHintBtn = document.getElementById("mobileHintBtn");
  const solutionBtn = document.getElementById("solutionBtn");
  const mobileSolutionBtn = document.getElementById("mobileSolutionBtn");
  const messageEl = document.getElementById("message");
  const hintEl = document.getElementById("hintText");
  const explanationEl = document.getElementById("explanationText");
  const metaEl = document.getElementById("puzzleMeta");
  const successEl = document.getElementById("successCount");
  const attemptEl = document.getElementById("attemptCount");

  function boot() {
    if (typeof Chess === "undefined") {
      setMessage("Impossible de charger chess.js.", true);
      return;
    }

    const validation = validatePuzzleDatabase(window.EM_PUZZLES || []);
    state.validPuzzles = validation.validPuzzles;
    state.validationReport = validation.report;
    logValidationReport(validation.report);

    populateCategories();
    bindEvents();
    loadRandomPuzzle();
  }

  function populateCategories() {
    Object.entries(CATEGORY_LABELS).forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      categorySelect.appendChild(option);
    });
  }

  function bindEvents() {
    newPuzzleBtn.addEventListener("click", loadRandomPuzzle);
    categorySelect.addEventListener("change", loadRandomPuzzle);
    hintBtn.addEventListener("click", showHint);
    mobileHintBtn.addEventListener("click", showHint);
    solutionBtn.addEventListener("click", showSolution);
    mobileSolutionBtn.addEventListener("click", showSolution);
  }

  function loadRandomPuzzle() {
    const selectedCategory = categorySelect.value || "all";
    const pool = state.validPuzzles.filter((puzzle) => {
      return selectedCategory === "all" || puzzle.categorie === selectedCategory;
    });

    if (pool.length === 0) {
      clearCurrentPuzzle();
      setMessage("Aucun exercice valide pour cette catégorie.", true);
      return;
    }

    const nextPuzzle = pool[Math.floor(Math.random() * pool.length)];

    state.puzzle = nextPuzzle;
    state.game = new Chess(nextPuzzle.fen);
    state.selected = null;
    state.lineIndex = 0;
    state.solved = false;
    state.orientation = state.game.turn();

    hintEl.hidden = true;
    explanationEl.hidden = true;
    hintEl.textContent = "";
    explanationEl.textContent = "";
    metaEl.textContent = `${nextPuzzle.theme} · ${nextPuzzle.niveau} · ${turnLabel(state.game.turn())} au trait`;
    setMessage("À toi de jouer");
    renderBoard();
  }

  function clearCurrentPuzzle() {
    state.game = null;
    state.puzzle = null;
    state.selected = null;
    state.lineIndex = 0;
    state.solved = true;
    boardEl.innerHTML = "";
    hintEl.hidden = true;
    explanationEl.hidden = true;
    hintEl.textContent = "";
    explanationEl.textContent = "";
    metaEl.textContent = "-";
  }

  function validatePuzzleDatabase(puzzles) {
    const report = {
      validPuzzles: 0,
      invalidFen: [],
      mate1NoSolution: [],
      mate1MultipleSolutions: [],
      mate1ExpectedMismatch: []
    };

    const validPuzzles = [];

    puzzles.forEach((puzzle) => {
      const game = createGameFromFen(puzzle.fen);

      if (!game) {
        report.invalidFen.push(puzzle.id || "(sans id)");
        return;
      }

      if (puzzle.categorie === "mate1") {
        const mateMoves = findMateInOneMoves(puzzle.fen);

        if (mateMoves.length === 0) {
          report.mate1NoSolution.push(puzzle.id || "(sans id)");
          return;
        }

        if (mateMoves.length > 1) {
          report.mate1MultipleSolutions.push({
            id: puzzle.id || "(sans id)",
            solutions: mateMoves
          });
          return;
        }

        if (puzzle.solution && normalizeMove(puzzle.solution) !== mateMoves[0]) {
          report.mate1ExpectedMismatch.push({
            id: puzzle.id || "(sans id)",
            expected: normalizeMove(puzzle.solution),
            computed: mateMoves[0]
          });
          return;
        }

        puzzle.computedMateSolutions = mateMoves;
      }

      validPuzzles.push(puzzle);
    });

    report.validPuzzles = validPuzzles.length;
    return { validPuzzles, report };
  }

  function createGameFromFen(fen) {
    try {
      const validator = new Chess();
      const validation = validator.validate_fen(fen);

      if (!validation.valid) {
        return null;
      }

      return new Chess(fen);
    } catch (error) {
      return null;
    }
  }

  function findMateInOneMoves(fen) {
    const game = createGameFromFen(fen);

    if (!game) {
      return [];
    }

    return game.moves({ verbose: true }).reduce((mates, move) => {
      const line = createGameFromFen(fen);
      line.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion || "q"
      });

      if (line.in_checkmate()) {
        mates.push(normalizeMove(move.from + move.to + (move.promotion || "")));
      }

      return mates;
    }, []);
  }

  function logValidationReport(report) {
    console.group("Rapport de validation des puzzles");
    console.log(`Puzzles valides : ${report.validPuzzles}`);
    console.log(`FEN invalides : ${report.invalidFen.length}`, report.invalidFen);
    console.log(`Mats en 1 avec 0 solution : ${report.mate1NoSolution.length}`, report.mate1NoSolution);
    console.log(
      `Mats en 1 avec plusieurs solutions : ${report.mate1MultipleSolutions.length}`,
      report.mate1MultipleSolutions
    );

    if (report.mate1ExpectedMismatch.length > 0) {
      console.warn(
        "Mats en 1 dont la solution indiquée ne correspond pas à l'unique mat calculé :",
        report.mate1ExpectedMismatch
      );
    }

    console.groupEnd();
  }

  function renderBoard() {
    boardEl.innerHTML = "";
    const files = state.orientation === "w" ? "abcdefgh" : "hgfedcba";
    const ranks = state.orientation === "w" ? "87654321" : "12345678";
    const legalTargets = state.selected ? legalMovesFrom(state.selected) : [];

    ranks.split("").forEach((rank, rankIndex) => {
      files.split("").forEach((file, fileIndex) => {
        const squareName = `${file}${rank}`;
        const square = document.createElement("button");
        const piece = state.game.get(squareName);
        const isDark = (rankIndex + fileIndex) % 2 === 1;

        square.type = "button";
        square.className = `square${isDark ? " dark" : ""}`;
        square.dataset.square = squareName;
        square.setAttribute("role", "gridcell");
        square.setAttribute("aria-label", labelForSquare(squareName, piece));

        if (piece) {
          square.appendChild(createPieceNode(piece));
        }

        if (squareName === state.selected) {
          square.classList.add("selected");
        }

        if (legalTargets.includes(squareName)) {
          square.classList.add("legal");
        }

        appendCoordinates(square, file, rank, isDark);

        square.addEventListener("click", () => handleSquareClick(squareName));
        boardEl.appendChild(square);
      });
    });
  }

  function handleSquareClick(squareName) {
    if (state.solved) {
      return;
    }

    const piece = state.game.get(squareName);

    if (state.selected) {
      if (squareName === state.selected) {
        state.selected = null;
        renderBoard();
        return;
      }

      const move = state.game.move({
        from: state.selected,
        to: squareName,
        promotion: "q"
      });

      if (move) {
        state.selected = null;
        evaluateMove(move);
        renderBoard();
        return;
      }
    }

    if (piece && piece.color === state.game.turn()) {
      state.selected = squareName;
      setMessage("Choisis la case d'arrivée");
      renderBoard();
    }
  }

  function evaluateMove(move) {
    state.attempts += 1;
    updateScore();

    const uci = move.from + move.to + (move.promotion || "");
    const expected = expectedMove();
    const isExpected = normalizeMove(uci) === normalizeMove(expected);

    if (state.puzzle.categorie === "mate1") {
      if (isExpected && state.game.in_checkmate()) {
        markSuccess("Bravo, c'est mat !");
        return;
      }
      failAndReset("Essaie encore : le roi noir n'est pas mat.");
      return;
    }

    if (!isExpected) {
      failAndReset("Essaie encore");
      return;
    }

    if (state.puzzle.categorie === "mate2") {
      playGuidedLine();
      return;
    }

    markSuccess("Bravo");
  }

  function playGuidedLine() {
    state.lineIndex += 1;
    const line = solutionLine();
    const reply = line[state.lineIndex];

    if (reply) {
      const played = state.game.move({
        from: reply.slice(0, 2),
        to: reply.slice(2, 4),
        promotion: reply.slice(4) || "q"
      });

      if (played) {
        state.lineIndex += 1;
        setMessage("Bien. Réponds maintenant au coup forcé.");
        renderBoard();
        return;
      }
    }

    markSuccess(state.game.in_checkmate() ? "Bravo, c'est mat !" : "Bravo");
  }

  function failAndReset(text) {
    setMessage(text, true);
    window.setTimeout(() => {
      state.game = new Chess(state.puzzle.fen);
      state.selected = null;
      state.lineIndex = 0;
      renderBoard();
      setMessage("À toi de jouer");
    }, 800);
  }

  function markSuccess(text) {
    state.solved = true;
    state.successes += 1;
    updateScore();
    setMessage(text);
    explanationEl.textContent = state.puzzle.explication;
    explanationEl.hidden = false;
  }

  function expectedMove() {
    if (state.puzzle.categorie === "mate1" && !state.puzzle.solution) {
      return state.puzzle.computedMateSolutions[0] || "";
    }

    return solutionLine()[state.lineIndex] || "";
  }

  function solutionLine() {
    if (state.puzzle.categorie === "mate1" && !state.puzzle.solution) {
      return state.puzzle.computedMateSolutions || [];
    }

    return Array.isArray(state.puzzle.solution) ? state.puzzle.solution : [state.puzzle.solution];
  }

  function legalMovesFrom(square) {
    return state.game.moves({ square, verbose: true }).map((move) => move.to);
  }

  function normalizeMove(move) {
    return String(move || "").trim().toLowerCase();
  }

  function createPieceNode(piece) {
    const node = document.createElement("span");
    const image = document.createElement("img");

    node.className = `piece piece-${piece.color}`;
    node.setAttribute("aria-hidden", "true");
    image.className = "piece-img";
    image.src = `./${piece.color}${piece.type.toUpperCase()}.svg`;
    image.alt = "";
    image.draggable = false;
    node.appendChild(image);

    return node;
  }

  function appendCoordinates(square, file, rank, isDark) {
    if (isLeftEdge(file)) {
      square.appendChild(createCoordinate(rank, "rank", isDark));
    }

    if (isBottomEdge(rank)) {
      square.appendChild(createCoordinate(file, "file", isDark));
    }
  }

  function createCoordinate(text, type, isDark) {
    const coord = document.createElement("span");
    coord.className = `coord coord-${type} ${isDark ? "coord-dark" : "coord-light"}`;
    coord.textContent = text;
    return coord;
  }

  function isLeftEdge(file) {
    return (state.orientation === "w" && file === "a") || (state.orientation === "b" && file === "h");
  }

  function isBottomEdge(rank) {
    return (state.orientation === "w" && rank === "1") || (state.orientation === "b" && rank === "8");
  }

  function showHint() {
    if (!state.puzzle) {
      return;
    }

    hintEl.textContent = state.puzzle.indice;
    hintEl.hidden = false;
  }

  function showSolution() {
    if (!state.puzzle) {
      return;
    }

    const solution = solutionLine().join(" ");
    explanationEl.textContent = `Solution : ${solution}. ${state.puzzle.explication}`;
    explanationEl.hidden = false;
  }

  function updateScore() {
    successEl.textContent = state.successes;
    attemptEl.textContent = state.attempts;
  }

  function setMessage(text, isError) {
    messageEl.textContent = text;
    messageEl.classList.toggle("error", Boolean(isError));
  }

  function turnLabel(color) {
    return color === "w" ? "Blancs" : "Noirs";
  }

  function labelForSquare(square, piece) {
    if (!piece) {
      return `Case ${square}`;
    }
    const color = piece.color === "w" ? "blanche" : "noire";
    return `${PIECES[piece.type]} ${color} en ${square}`;
  }

  window.EM_TRAINER_HOOKS = engineHooks;
  document.addEventListener("DOMContentLoaded", boot);
})();
