

const boardSquares = document.querySelectorAll(".square");
let board = [];
let loopGame = true

//updates called upon gameboard
function gameLoop() {

    if (loopGame === false) return;


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

    if (findKing(board, 'white') === -1){gameEnd()}
    if (findKing(board, 'black') === -1)[gameEnd()]
    
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
        }
    }
}

function selectSquare(square, squareId) {
    const piece = board[squareId]; // Get the piece from the board array
    if (loopGame){
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
}



function unselectSquare(square) {
    //In case you change your mind it's very possible to unselect the selected piece
    square.classList.remove("selected");
    selected = false;
    squareSelection = '';
    const highlighted = document.querySelectorAll(".highlight");
    for (i=0;i<highlighted.length;i++){
        highlighted[i].classList.remove("highlight");
    }
}


function changePlayer() {
    //Simple turn switch, changes white to black and black to white
    playerTurn = playerTurn === "white" ? "black" : "white";
}


function movePiece(startPos, endPos) {
    // Get the start and end position of the move on the visual/on-screen board
    const startSquare = document.querySelector(`[square-id="${startPos}"]`);
    const endSquare = document.querySelector(`[square-id="${endPos}"]`);

    if (!startSquare || !endSquare || !startSquare.piece) return;

    // Get the piece to move
    const piece = startSquare.piece;
    endSquare.piece = { ...piece, hasMoved: true };  // Updates `hasMoved` for the piece
    startSquare.piece = null;

    // Check if it's castling (king moves)
    if (piece.type === "king" && Math.abs(startPos - endPos) === 2) {
        // Castling happens if the king moves 2 squares (castling distance)
        console.log("big black balls")
        const rookPosition = getRookPositionForCastling(startPos, piece.color);
        if (rookPosition !== -1) {
            console.log("hoogily boogily")
            const rookSquare = document.querySelector(`[square-id="${rookPosition}"]`);
            const rook = rookSquare.piece;

            // Get the correct new position for the rook based on the direction of castling
            const rookNewPos = getRookNewPosition(startPos, endPos);
            const rookEndSquare = document.querySelector(`[square-id="${rookNewPos}"]`);
            movePiece(rookPosition, rookNewPos)
            // Move the rook to the new position
            rookEndSquare.piece = { ...rook, hasMoved: true };
            rookSquare.piece = null;
        }
    }

    // Update the actual board elements visually
    const pieceElement = startSquare.querySelector(".piece");
    const hasOpponentPiece = endSquare.querySelector(".piece");

    // Remove the piece from the old square and move it to the new square
    if (pieceElement) {
        startSquare.removeChild(pieceElement);
        endSquare.appendChild(pieceElement);

        // Check if the end space already had a piece, remove it if so
        if (hasOpponentPiece) {
            endSquare.removeChild(hasOpponentPiece);
        }
    }

    // Check for checkmate
    const opponentColor = playerTurn === "white" ? "black" : "white";
    if (isCheckmate(board, opponentColor)) {
        gameEnd();
    }

            // Check for pawn promotion
            if (piece.type === "pawn") {
                const row = Math.floor(endPos / 8);
                if ((piece.color === "white" && row === 0) || (piece.color === "black" && row === 7)) {
                    promotePawn(endPos, piece.color); // Use endPos to find the pawn's new location
                }

    // Unselect the square and change the player turn
    unselectSquare(startSquare);
    changePlayer();
}}

// Helper function to determine the rook's position for castling
function getRookPositionForCastling(kingStartPos, kingEndPos) {
    const kingRow = Math.floor(kingStartPos / 8); // Determine the row of the king
    const direction = kingEndPos > kingStartPos ? "kingside" : "queenside";

    // Determine rook's starting position based on castling direction
    if (direction === "kingside") {
        return kingRow * 8 + 7; // Rook at h1 or h8
    } else if (direction === "queenside") {
        return kingRow * 8 + 0; // Rook at a1 or a8
    }

    return -1; // No valid rook position found
}

// Helper function to get the new rook position after castling
function getRookNewPosition(kingPos, endPos) {
    // For castling, the rook should move to the square next to the king
    const kingRow = Math.floor(kingPos / 8);
    if (endPos > kingPos) {
        // Kingside castling (move rook to f1/f8)
        return kingRow * 8 + 5; // f1/f8
    } else {
        // Queenside castling (move rook to d1/d8)
        return kingRow * 8 + 3; // d1/d8
    }
}




function gameEnd(){
    console.error("END GAME")
    //Ends gameloop and changes "turn:" indicator into "[color] wins!" text
    const correctColor = playerTurn === "white" ? "black" : "white";
    const winText = `${correctColor} wins!`;
    const textInput = document.querySelector(".stat-text");
    const textClear = document.querySelector(".turn-input")
    textClear.textContent = "";
    textInput.textContent = winText;
    loopGame = false;
}


// Function to handle pawn promotion
function promotePawn(position, color) {
    // Show a prompt for promotion choice (simplified for now)
    const choice = prompt("Promote to (q, r, b, n):").toLowerCase();

    // Map the choice to the piece type
    const pieceTypeMap = {
        q: "Queen",
        r: "Rook",
        b: "Bishop",
        n: "Knight"
    };
    const newType = pieceTypeMap[choice.toLowerCase] || "queen"; // Default to queen if invalid input
    
    const piece = document.querySelectorAll(`[square-id="${position}"]`)
    console.log(piece)
    piece.type = newType
    if (color === 'white'){piece.src = `img/w${newType}`}
    if (color === 'black'){piece.src = `img/b${newType}`}

}