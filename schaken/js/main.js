



const boardSquares = document.querySelectorAll(".square");
let board = [];

//updates behind the scenes board
function gameLoop(){

    for (let i=0;i<boardSquares.length;i++){
        if (boardSquares[i].firstChild){
            board[i] = boardSquares[i].firstChild.id;
        }
        else {
            board[i] = ""
        }
    }
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
        selectSquare(square, squareId);
        console.log(pieceSelection)
    } else if (squareId === squareSelection) {
        unselectSquare(square);
    } else {
        const legalMoves = getLegalMoves(Number(squareSelection), pieceSelection, board, playerTurn);
        if (legalMoves.includes(Number(squareId))) {
            movePiece(squareSelection, squareId); // Perform the move
        } else {
            console.log("Invalid move");
        }
    }
}

function selectSquare(square, squareId) {
    const piece = square.querySelector(".piece");
    if (!piece) return;
    if (!piece.classList.contains(`${playerTurn}`)) return;

    square.classList.add("selected");
    selected = true;
    squareSelection = squareId;
    pieceSelection = piece.id

    if (playerTurn == "white"){
        const legalMoves = getLegalMoves(Number(squareId), piece.id, board, playerTurn, firstTurnWhite);
        for (let i=0; i<legalMoves.length;i++){
            const square = document.querySelector(`[square-id="${legalMoves[i]}"]`);
            
            if (square) {
                square.classList.add("highlight");
            }
        }

        
    }
    else {
        const legalMoves = getLegalMoves(Number(squareId), piece.id, board, playerTurn, firstTurnBlack);
        for (let i=0; i<legalMoves.length;i++){
            const square = document.querySelector(`[square-id="${legalMoves[i]}"]`);
            
            if (square) {
                square.classList.add("highlight");
            }
        }
    }
    
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


function movePiece(fromSquareId, toSquareId) {
    const fromSquare = document.querySelector(`[square-id="${fromSquareId}"]`);
    const toSquare = document.querySelector(`[square-id="${toSquareId}"]`);

    const piece = fromSquare.querySelector(".piece");

    // Move the piece visually
    if (piece) {
        toSquare.appendChild(piece); // Move piece to the new square
    }

    // Update the internal board state
    board[toSquareId] = board[fromSquareId]; // Move the piece in the board array
    board[fromSquareId] = ""; // Clear the original square in the board array

    // Clear highlights and selection
    unselectSquare(fromSquare);

    // Switch turn
    playerTurn = playerTurn === "white" ? "black" : "white";

    console.log(`Moved piece from ${fromSquareId} to ${toSquareId}`);
}