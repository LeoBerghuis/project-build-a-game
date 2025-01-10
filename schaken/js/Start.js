
const gameBoard = document.querySelector("#gameboard");
const width = 8


const startPieces = [
    Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook,
    Pawn, Pawn, Pawn, Pawn, Pawn, Pawn, Pawn, Pawn,
    "", "", "", "", "", "", "", "", 
    "", "", "", "", "", "", "", "", 
    "", "", "", "", "", "", "", "", 
    "", "", "", "", "", "", "", "", 
    Pawn, Pawn, Pawn, Pawn, Pawn, Pawn, Pawn, Pawn,
    Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook,
]

function createBoard() {
    startPieces.forEach((startPiece, i) => {
        
        const square = document.createElement("div");
        square.classList.add("square");
        square.innerHTML = startPiece

        square.setAttribute("square-id", i);
        square.firstChild?.setAttribute("draggable", true)

        const row = Math.floor((63 - i) / 8) + 1;

        if (row % 2 === 0) {
            square.classList.add(i % 2 === 0 ? "beige"  : "brown");
        } else {
            square.classList.add(i % 2 === 0 ? "brown" : "beige");
        }

        if (i <= 15) {
            square.firstChild.classList.add("black");
            square.firstChild.firstChild.innerHTML += setPieces(startPiece, "b");
        }
        if (i >= 48) {
            square.firstChild.classList.add("white");
            square.firstChild.firstChild.innerHTML += setPieces(startPiece, "w");
        }
        
        gameBoard.append(square);
    })
}


function setPieces(P, C) {
    switch (P){
        case Pawn:
            return `<img class="piece" src="img/${C}Pawn.png" alt="Pawn">`;
            break;
        case Bishop:
            return `<img class="piece" src="img/${C}Bishop.png" alt="Bishop">`;
            break;
        case Rook:
            return `<img class="piece" src="img/${C}Rook.png" alt="Rook">`;
            break;
        case Knight:
            return `<img class="piece" src="img/${C}Knight.png" alt="Knight">`;
            break;
        case Queen:
            return `<img class="piece" src="img/${C}Queen.png" alt="Queen">`;
            break;
        case King:
            return `<img class="piece" src="img/${C}King.png" alt="King">`;
            break;
    }
}

createBoard();