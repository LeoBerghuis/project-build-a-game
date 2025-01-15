

const boardSquares = document.querySelectorAll(".square");
let board = [];

//updates called upon gameboard
function gameLoop() {
    for (let i = 0; i < boardSquares.length; i++) {
        if (boardSquares[i].firstChild) {
            const pieceElement = boardSquares[i].firstChild;
            const pieceType = pieceElement.alt || ''; // Ensure alt exists
            const pieceColor = pieceElement.classList.contains('white') ? 'white' : 'black';
            const hasMoved = boardSquares[i].piece?.hasMoved || false;

            board[i] = { type: pieceType, color: pieceColor, hasMoved };
        } else {
            board[i] = null; // Explicitly set empty squares to null
        }
    }
    // console.log("Board state:", board); // Debug the board state
    requestAnimationFrame(gameLoop)
}


gameLoop()



let firstTurnWhite = true;
let firstTurnBlack = true;
let selected = ""; //toggle bool for the ability to select and unselect... deselect? remove selection from piece
let squareSelection = ''; //stored value of which square is currently selected
let pieceSelection = '';
let playerTurn = "white";
const turnDisplay = document.querySelector(".turn-input");
turnDisplay.textContent = playerTurn



gameBoard.addEventListener("click", handleSquareClick);

function handleSquareClick(e) {
    const square = e.target.closest(".square"); // Get the closest square element
    if (!square) return;

    const squareId = square.getAttribute("square-id");

    if (!selected) {
        selectSquare(square, squareId); // Select the piece
    } else if (squareId === squareSelection) {
        unselectSquare(square); // Unselect if the same square is clicked again
    } else {
        const legalMoves = getLegalMoves(Number(squareSelection), board[squareSelection], board, playerTurn, playerTurn === "white" ? firstTurnWhite : firstTurnBlack);
        if (legalMoves.includes(Number(squareId))) {
            movePiece(squareSelection, squareId); // Perform the move
        } else {
            console.log("Invalid move");
        }
    }
}

function selectSquare(square, squareId) {
    const piece = board[squareId]; // Get the piece from the board array
    console.log(piece)
    if (!piece) {
        console.error("No piece in selected square");
        return;
    }
    
    // Ensure the selected piece belongs to the current player
    if (piece.color !== playerTurn) {
        console.error("Not your turn:", piece);
        return;
    }
    
    console.log("Selected piece:", piece.type);
    square.classList.add("selected");
    selected = true;
    squareSelection = squareId;
    pieceSelection = piece; // Store the piece object itself

    // Get the legal moves for the piece on the selected square
    const legalMoves = getLegalMoves(Number(squareId), piece, board, playerTurn, playerTurn === "white" ? firstTurnWhite : firstTurnBlack);
    
    // Highlight all the legal moves
    legalMoves.forEach(move => {
        const targetSquare = document.querySelector(`[square-id="${move}"]`);
        if (targetSquare) {
            targetSquare.classList.add("highlight");
        }
    });
}



function unselectSquare(square) {
    square.classList.remove("selected");
    selected = false;
    squareSelection = '';
    const highlighted = document.querySelectorAll(".highlight");
    for (i=0;i<highlighted.length;i++){
        highlighted[i].classList.remove("highlight");
    }
}


function changePlayer() {
    if (playerTurn === 'black') {
        playerTurn = 'white';
        turnDisplay.textContent = playerTurn
        firstTurnBlack = false;
    } else {
        playerTurn = 'black'
        turnDisplay.textContent = playerTurn
        firstTurnWhite = false;
    }
}


function movePiece(startPos, endPos) {
    const startSquare = document.querySelector(`[square-id="${startPos}"]`);
    const endSquare = document.querySelector(`[square-id="${endPos}"]`);
    
    if (!startSquare || !endSquare || !startSquare.piece) return;

    // Moves the piece
    const piece = startSquare.piece;
    endSquare.piece = { ...piece, hasMoved: true }; // Update `hasMoved` for pawns to make sure they don't continue to move two spaces
    startSquare.piece = null;

    // Update the actual board elements
    const pieceElement = startSquare.querySelector(".piece");
    const hasOpponentPiece = endSquare.querySelector(".piece");
    if (pieceElement) {
        startSquare.removeChild(pieceElement);
        endSquare.appendChild(pieceElement);

        if (hasOpponentPiece){
            endSquare.removeChild(hasOpponentPiece)
        }
    }
    unselectSquare(startSquare);
}
