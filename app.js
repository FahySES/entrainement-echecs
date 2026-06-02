(function () {
  "use strict";

  const CATEGORY_LABELS = {
    all: "Type d’exercice",
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
    solutionAnimating: false,
    solutionTimer: null,
    feedbackTimer: null,
    successes: 0,
    attempts: 0
  };

  const boardEl = document.getElementById("board");
  const puzzleCardEl = document.querySelector(".puzzle-card");
  const categorySelect = document.getElementById("categorySelect");
  const newPuzzleBtn = document.getElementById("newPuzzleBtn");
  const hintBtn = document.getElementById("hintBtn");
  const mobileHintBtn = document.getElementById("mobileHintBtn");
  const solutionBtn = document.getElementById("solutionBtn");
  const mobileSolutionBtn = document.getElementById("mobileSolutionBtn");
  const messageEl = document.getElementById("message");
  const hintEl = document.getElementById("hintText");
  const explanationEl = document.getElementById("explanationText");
  const correctionMessageEl = document.getElementById("correctionMessage");
  const scoreEl = document.querySelector(".score");

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
    solutionBtn.addEventListener("click", showSolution);

    if (mobileHintBtn) {
      mobileHintBtn.addEventListener("click", showHint);
    }

    if (mobileSolutionBtn) {
      mobileSolutionBtn.addEventListener("click", showSolution);
    }
  }

  function loadRandomPuzzle() {
    const selectedCategory = categorySelect.value || "all";
    const pool = state.validPuzzles.filter((puzzle) => {
      return selectedCategory === "all" || puzzle.categorie === selectedCategory;
    });

    if (pool.length === 0) {
      clearCurrentPuzzle();
      setCorrection("Aucun exercice valide pour cette catégorie.", true);
      return;
    }

    const nextPuzzle = pool[Math.floor(Math.random() * pool.length)];

    state.puzzle = nextPuzzle;
    state.game = new Chess(nextPuzzle.fen);
    state.selected = null;
    state.lineIndex = 0;
    state.solved = false;
    state.solutionAnimating = false;
    window.clearTimeout(state.solutionTimer);
    state.orientation = state.game.turn();

    hintEl.hidden = true;
    explanationEl.hidden = true;
    hintEl.textContent = "";
    explanationEl.textContent = "";
    setTurnIndicator();
    setCorrection("");
    renderBoard();
  }

  function clearCurrentPuzzle() {
    state.game = null;
    state.puzzle = null;
    state.selected = null;
    state.lineIndex = 0;
    state.solved = true;
    boardEl.classList.remove("board-feedback-correct", "board-feedback-wrong");
    puzzleCardEl.classList.remove("correct", "wrong");
    state.solutionAnimating = false;
    window.clearTimeout(state.solutionTimer);
    boardEl.innerHTML = "";
    hintEl.hidden = true;
    explanationEl.hidden = true;
    hintEl.textContent = "";
    explanationEl.textContent = "";
    setCorrection("");
  }

  function validatePuzzleDatabase(puzzles) {
    const report = {
      validPuzzles: 0,
      invalidFen: [],
      disabledPuzzles: [],
      mate1NoSolution: [],
      mate1MultipleSolutions: [],
      mate1ExpectedMismatch: [],
      tacticInvalidSolution: []
    };

    const validPuzzles = [];

    puzzles.forEach((puzzle) => {
      if (puzzle.active === false) {
        report.disabledPuzzles.push({
          id: puzzle.id || "(sans id)",
          commentaireValidation: puzzle.commentaireValidation || "Puzzle désactivé."
        });
        return;
      }

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

      if (puzzle.categorie === "tactic1" && !isFirstSolutionMoveLegal(puzzle)) {
        report.tacticInvalidSolution.push({
          id: puzzle.id || "(sans id)",
          solution: Array.isArray(puzzle.solution) ? puzzle.solution[0] : puzzle.solution
        });
        return;
      }

      validPuzzles.push(puzzle);
    });

    report.validPuzzles = validPuzzles.length;
    return { validPuzzles, report };
  }

  function isFirstSolutionMoveLegal(puzzle) {
    const game = createGameFromFen(puzzle.fen);
    const move = Array.isArray(puzzle.solution) ? puzzle.solution[0] : puzzle.solution;

    if (!game || !move) {
      return false;
    }

    return Boolean(game.move({
      from: move.slice(0, 2),
      to: move.slice(2, 4),
      promotion: move.slice(4) || "q"
    }));
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
    console.log(`Puzzles désactivés : ${report.disabledPuzzles.length}`, report.disabledPuzzles);
    console.log(`Mats en 1 avec 0 solution : ${report.mate1NoSolution.length}`, report.mate1NoSolution);
    console.log(
      `Mats en 1 avec plusieurs solutions : ${report.mate1MultipleSolutions.length}`,
      report.mate1MultipleSolutions
    );

    if (report.tacticInvalidSolution.length > 0) {
      console.warn("Tactiques dont la solution est illégale :", report.tacticInvalidSolution);
    }

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

    boardEl.appendChild(createBoardOverlay());
  }

  function handleSquareClick(squareName) {
    if (state.solved || state.solutionAnimating) {
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
      setCorrection("Choisis la case d'arrivée");
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
        flashBoard("correct");
        markSuccess("Bravo, c'est mat !");
        return;
      }
      flashBoard("wrong");
      failAndReset("Essaie encore : le roi noir n'est pas mat.");
      return;
    }

    if (!isExpected) {
      flashBoard("wrong");
      failAndReset("Essaie encore");
      return;
    }

    if (state.puzzle.categorie === "mate2") {
      playGuidedLine();
      return;
    }

    flashBoard("correct");
    markSuccess("Bravo");
  }

  function playGuidedLine() {
    const line = solutionLine();

    state.lineIndex += 1;

    if (state.lineIndex === 1) {
      const blackReply = line[state.lineIndex];
      const played = blackReply && state.game.move({
        from: blackReply.slice(0, 2),
        to: blackReply.slice(2, 4),
        promotion: blackReply.slice(4) || "q"
      });

      if (!played) {
        flashBoard("wrong");
        failAndReset("La réponse noire forcée est invalide.");
        return;
      }

      state.lineIndex += 1;
      flashBoard("correct");
      setCorrection("Bien. Trouve maintenant le mat.");
      setTurnIndicator();
      renderBoard();
      return;
    }

    if (state.game.in_checkmate()) {
      flashBoard("correct");
      markSuccess("Bravo, c'est mat !");
      return;
    }

    flashBoard("wrong");
    failAndReset("Essaie encore : ce n'est pas mat.");
  }

  function failAndReset(text) {
    setCorrection(text, true);
    window.setTimeout(() => {
      state.game = new Chess(state.puzzle.fen);
      state.selected = null;
      state.lineIndex = 0;
      renderBoard();
      setTurnIndicator();
      setCorrection("");
    }, 800);
  }

  function markSuccess(text) {
    state.solved = true;
    state.successes += 1;
    updateScore();
    setCorrection(text);
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
    image.src = `${piece.color}${piece.type.toUpperCase()}.svg`;
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

    const solution = solutionLineToFrenchNotation(state.puzzle);
    explanationEl.textContent = `Solution : ${solution}. ${state.puzzle.explication}`;
    explanationEl.hidden = false;
    animateSolutionMove();
  }

  function animateSolutionMove() {
    if (!state.game || state.solved || state.solutionAnimating) {
      return;
    }

    const uci = expectedMove();
    const from = uci.slice(0, 2);
    const to = uci.slice(2, 4);
    const piece = state.game.get(from);
    const fromSquare = boardEl.querySelector(`[data-square="${from}"]`);
    const toSquare = boardEl.querySelector(`[data-square="${to}"]`);
    const overlay = boardEl.querySelector(".board-overlay");

    if (!piece || !fromSquare || !toSquare || !overlay) {
      return;
    }

    const testGame = new Chess(state.game.fen());
    const legalMove = testGame.move({
      from,
      to,
      promotion: uci.slice(4) || "q"
    });

    if (!legalMove) {
      return;
    }

    state.solutionAnimating = true;
    overlay.innerHTML = "";
    const geometry = getMoveGeometry(fromSquare, toSquare);
    const arrow = createSolutionArrow(geometry);
    const movingPiece = createAnimatedPiece(piece, geometry);
    const originalPiece = fromSquare.querySelector(".piece");

    if (originalPiece) {
      originalPiece.classList.add("piece-hidden-during-solution");
    }

    overlay.appendChild(arrow);
    overlay.appendChild(movingPiece);
    window.requestAnimationFrame(() => {
      movingPiece.style.transform = `translate(${geometry.dx}px, ${geometry.dy}px)`;
    });

    window.clearTimeout(state.solutionTimer);
    state.solutionTimer = window.setTimeout(() => {
      state.game.move({
        from,
        to,
        promotion: uci.slice(4) || "q"
      });
      state.selected = null;
      state.solved = true;
      state.solutionAnimating = false;
      renderBoard();
      const refreshedOverlay = boardEl.querySelector(".board-overlay");
      refreshedOverlay.appendChild(createSolutionArrow(geometry));
      window.setTimeout(() => {
        refreshedOverlay.innerHTML = "";
      }, 900);
    }, 2000);
  }

  function createBoardOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "board-overlay";
    overlay.setAttribute("aria-hidden", "true");
    return overlay;
  }

  function getMoveGeometry(fromSquare, toSquare) {
    const boardRect = boardEl.getBoundingClientRect();
    const fromRect = fromSquare.getBoundingClientRect();
    const toRect = toSquare.getBoundingClientRect();
    const squareSize = fromRect.width;
    const fromX = fromRect.left - boardRect.left + fromRect.width / 2;
    const fromY = fromRect.top - boardRect.top + fromRect.height / 2;
    const toX = toRect.left - boardRect.left + toRect.width / 2;
    const toY = toRect.top - boardRect.top + toRect.height / 2;

    return {
      fromX,
      fromY,
      toX,
      toY,
      dx: toX - fromX,
      dy: toY - fromY,
      pieceSize: squareSize * 0.9
    };
  }

  function createSolutionArrow(geometry) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    const markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const length = Math.hypot(geometry.dx, geometry.dy) || 1;
    const trim = Math.min(geometry.pieceSize * 0.34, length * 0.22);
    const startX = geometry.fromX + (geometry.dx / length) * trim;
    const startY = geometry.fromY + (geometry.dy / length) * trim;
    const endX = geometry.toX - (geometry.dx / length) * trim;
    const endY = geometry.toY - (geometry.dy / length) * trim;

    svg.classList.add("solution-arrow");
    svg.setAttribute("viewBox", `0 0 ${boardEl.clientWidth} ${boardEl.clientHeight}`);
    marker.setAttribute("id", "solution-arrow-head");
    marker.setAttribute("markerWidth", "9");
    marker.setAttribute("markerHeight", "9");
    marker.setAttribute("refX", "7");
    marker.setAttribute("refY", "4.5");
    marker.setAttribute("orient", "auto");
    marker.setAttribute("markerUnits", "strokeWidth");
    markerPath.setAttribute("d", "M0,0 L8,4.5 L0,9 Z");
    marker.appendChild(markerPath);
    defs.appendChild(marker);
    line.setAttribute("x1", startX);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", endX);
    line.setAttribute("y2", endY);
    line.setAttribute("marker-end", "url(#solution-arrow-head)");
    svg.appendChild(defs);
    svg.appendChild(line);
    return svg;
  }

  function createAnimatedPiece(piece, geometry) {
    const node = createPieceNode(piece);
    node.classList.add("solution-moving-piece");
    node.style.width = `${geometry.pieceSize}px`;
    node.style.height = `${geometry.pieceSize}px`;
    node.style.left = `${geometry.fromX - geometry.pieceSize / 2}px`;
    node.style.top = `${geometry.fromY - geometry.pieceSize / 2}px`;
    return node;
  }

  function solutionLineToFrenchNotation(puzzle) {
    const game = createGameFromFen(puzzle.fen);

    if (!game) {
      return solutionLine().join(" ");
    }

    return solutionLine().map((uci) => moveToFrenchNotation(game, uci)).join(" ");
  }

  function moveToFrenchNotation(game, uci) {
    const move = game.move({
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
      promotion: uci.slice(4) || "q"
    });

    if (!move) {
      return uci;
    }

    return sanToFrench(move.san);
  }

  function sanToFrench(san) {
    return san.replace(/[KQRBN]/g, (piece) => {
      return {
        K: "R",
        Q: "D",
        R: "T",
        B: "F",
        N: "C"
      }[piece];
    });
  }

  function flashBoard(type) {
    window.clearTimeout(state.feedbackTimer);
    boardEl.classList.remove("board-feedback-correct", "board-feedback-wrong");
    puzzleCardEl.classList.remove("correct", "wrong");
    void boardEl.offsetWidth;
    void puzzleCardEl.offsetWidth;
    boardEl.classList.add(type === "correct" ? "board-feedback-correct" : "board-feedback-wrong");
    puzzleCardEl.classList.add(type === "correct" ? "correct" : "wrong");

    state.feedbackTimer = window.setTimeout(() => {
      boardEl.classList.remove("board-feedback-correct", "board-feedback-wrong");
      puzzleCardEl.classList.remove("correct", "wrong");
    }, 900);
  }

  function updateScore() {
    const successLabel = state.successes > 1 ? "réussites" : "réussite";
    const attemptLabel = state.attempts > 1 ? "tentatives" : "tentative";
    scoreEl.textContent = `${state.successes} ${successLabel} / ${state.attempts} ${attemptLabel}`;
  }

  function setTurnIndicator() {
    if (!state.game) {
      setMessage("Trait aux blancs");
      return;
    }

    setMessage(state.game.turn() === "w" ? "Trait aux blancs" : "Trait aux noirs");
  }

  function setMessage(text, isError) {
    messageEl.textContent = text;
    messageEl.classList.toggle("error", Boolean(isError));
  }

  function setCorrection(text, isError) {
    correctionMessageEl.textContent = text;
    correctionMessageEl.classList.toggle("error", Boolean(isError));
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
