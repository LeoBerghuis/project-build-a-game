// Main logic for the checkers game
console.log("main loaded");

const checkersBoard = document.querySelector(".board");
const turnIndicator = document.querySelector(".turn-indicator"); // Add a DOM element to show turn info
let whiteTurn = true;
let selectedPawn = null;
let board = [
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 0, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1]
];

// Load the board
function loadBoard() {
    console.log("Loading board state:", JSON.parse(JSON.stringify(board)));
    checkersBoard.innerHTML = ""; // Clear the board
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const tile = document.createElement("div");
            tile.classList.add("item", (i + j) % 2 === 0 ? "item1" : "item2");
            tile.dataset.row = i;
            tile.dataset.col = j;

            if (board[i][j] === 1) {
                tile.innerHTML = '<div class="pawn white"></div>';
            } else if (board[i][j] === 2) {
                tile.innerHTML = '<div class="pawn black"></div>';
            } else if (board[i][j] === 3) {
                tile.innerHTML = '<div class="pawn white"><span class="material-symbols-outlined">crown</span></div>';
            } else if (board[i][j] === 4) {
                tile.innerHTML = '<div class="pawn black"><span class="material-symbols-outlined">crown</span></div>';
            }

            checkersBoard.appendChild(tile);

            // Add click listener for pawns
            if ((board[i][j] === 1 || board[i][j] === 3) && whiteTurn) {
                tile.addEventListener("click", () => handlePawnClick(i, j));
            } else if ((board[i][j] === 2 || board[i][j] === 4) && !whiteTurn) {
                tile.addEventListener("click", () => handlePawnClick(i, j));
            }
        }
    }
    updateTurnIndicator(); // Update the turn display
}


// Handle pawn selection
function handlePawnClick(row, col) {
    clearHighlights();
    selectedPawn = { row, col };

    // Highlight valid moves
    const validMoves = getValidMoves(row, col);
    for (const move of validMoves) {
        highlightTile(move.row, move.col, move.middleRow, move.middleCol);
    }
}

// Highlight a tile
function highlightTile(row, col, middleRow = null, middleCol = null) {
    const index = row * 8 + col;
    const tile = checkersBoard.children[index];
    tile.classList.add("highlightedTiles");
    tile.addEventListener(
        "click",
        () => handleMove(row, col, middleRow, middleCol),
        { once: true }
    );
}

// Get valid moves based on checkers rules
function getValidMoves(row, col) {
    const moves = [];
    const captures = [];
    const isKing = board[row][col] === 3 || board[row][col] === 4;

    console.log("Checking moves for:", { row, col, isKing });

    // Determine movement directions
    const directions = isKing 
        ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] // King moves in all diagonal directions
        : (board[row][col] === 1) 
            ? [[-1, -1], [-1, 1]] // White moves up
            : [[1, -1], [1, 1]];  // Black moves down

    // Check normal moves
    for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (
            newRow >= 0 &&
            newRow < 8 &&
            newCol >= 0 &&
            newCol < 8 &&
            board[newRow][newCol] === 0 // The tile must be empty
        ) {
            moves.push({ row: newRow, col: newCol });
        }
    }

    // Check capture moves
    for (const [dx, dy] of directions.map(([x, y]) => [x * 2, y * 2])) {
        const middleRow = row + dx / 2;
        const middleCol = col + dy / 2;
        const newRow = row + dx;
        const newCol = col + dy;
        if (
            newRow >= 0 &&
            newRow < 8 &&
            newCol >= 0 &&
            newCol < 8 &&
            board[newRow][newCol] === 0 && // Landing spot must be empty
            board[middleRow]?.[middleCol] !== 0 && // Middle spot must be occupied
            board[middleRow][middleCol] % 2 !== board[row][col] % 2 // Opponent's piece
        ) {
            captures.push({ row: newRow, col: newCol, middleRow, middleCol });
        }
    }

    console.log("Moves:", moves, "Captures:", captures);
    return captures.length > 0 ? captures : moves;
}

// Handle moving a pawn
function handleMove(row, col, middleRow = null, middleCol = null) {
    if (!selectedPawn) return;

    // Update the board state
    board[row][col] = board[selectedPawn.row][selectedPawn.col];
    board[selectedPawn.row][selectedPawn.col] = 0;

    // Promote to king if reaching the opposite end
    if (row === 0 && board[row][col] === 1) {
        board[row][col] = 3; // White King
    } else if (row === 7 && board[row][col] === 2) {
        board[row][col] = 4; // Black King
    }

    // If a capture, remove the captured piece
    if (middleRow !== null && middleCol !== null) {
        board[middleRow][middleCol] = 0;

        // Check for additional captures
        selectedPawn = { row, col };
        clearHighlights();
        const additionalCaptures = getValidMoves(row, col).filter(
            move => move.middleRow !== undefined && move.middleCol !== undefined
        );
        if (additionalCaptures.length > 0) {
            for (const move of additionalCaptures) {
                highlightTile(move.row, move.col, move.middleRow, move.middleCol);
            }
            return; // Allow multiple captures in the same turn
        }
    }

    selectedPawn = null;

    // Re-render the board
    whiteTurn = !whiteTurn; // Ensure turn is switched only when no additional captures
    rotateBoard(); // Rotate the board before reloading
    loadBoard();
    checkForWinner(); // Check if there's a winner
}

// Clear all highlights
function clearHighlights() {
    const highlightedTiles = document.querySelectorAll(".highlightedTiles");
    for (const tile of highlightedTiles) {
        tile.classList.remove("highlightedTiles");
        tile.replaceWith(tile.cloneNode(true)); // Remove lingering event listeners
    }
}

// Rotate the board
function rotateBoard() {
    checkersBoard.style.transition = "transform 0.5s ease";
    checkersBoard.style.transform = whiteTurn ? "rotate(0deg)" : "rotate(180deg)";
}

// Update the turn indicator
function updateTurnIndicator() {
    turnIndicator.innerText = whiteTurn ? "White's Turn" : "Black's Turn";
}

// Check for a winner
function checkForWinner() {
    const whitePawns = board.flat().filter(value => value == 1 || value == 3).length;
    const blackPawns = board.flat().filter(value => value == 2 || value == 4).length;

    if (whitePawns === 0) {
        setTimeout(() => alert("Black wins!"), 100); // Delay for UX
    } else if (blackPawns === 0) {
        setTimeout(() => alert("White wins!"), 100); // Delay for UX
    }
}

// Initialize the board
window.onload = () => {
    loadBoard();
    rotateBoard();
};