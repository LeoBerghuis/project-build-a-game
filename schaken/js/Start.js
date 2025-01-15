
const gameBoard = document.querySelector("#gameboard");
const width = 8


const startPieces = [
    { type: "rook", color: "black" }, { type: "knight", color: "black" }, { type: "bishop", color: "black" },
    { type: "queen", color: "black" }, { type: "king", color: "black" }, { type: "bishop", color: "black" },
    { type: "knight", color: "black" }, { type: "rook", color: "black" },
    { type: "pawn", color: "black", hasMoved: false }, { type: "pawn", color: "black", hasMoved: false },
    { type: "pawn", color: "black", hasMoved: false }, { type: "pawn", color: "black", hasMoved: false },
    { type: "pawn", color: "black", hasMoved: false }, { type: "pawn", color: "black", hasMoved: false },
    { type: "pawn", color: "black", hasMoved: false }, { type: "pawn", color: "black", hasMoved: false },
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    { type: "pawn", color: "white", hasMoved: false }, { type: "pawn", color: "white", hasMoved: false },
    { type: "pawn", color: "white", hasMoved: false }, { type: "pawn", color: "white", hasMoved: false },
    { type: "pawn", color: "white", hasMoved: false }, { type: "pawn", color: "white", hasMoved: false },
    { type: "pawn", color: "white", hasMoved: false }, { type: "pawn", color: "white", hasMoved: false },
    { type: "rook", color: "white" }, { type: "knight", color: "white" }, { type: "bishop", color: "white" },
    { type: "queen", color: "white" }, { type: "king", color: "white" }, { type: "bishop", color: "white" },
    { type: "knight", color: "white" }, { type: "rook", color: "white" }
];


function createBoard() {
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement("div");
        square.classList.add("square");
        square.setAttribute("square-id", i);

        if (startPiece) {
            //Creates an image element for the pieces so they have their visual representation
            const pieceElement = document.createElement("img");
            pieceElement.classList.add("piece", startPiece.color);
            pieceElement.setAttribute("draggable", false);

            //Giving the Pieces source/alt/piece values
            if (startPiece.type) {
                pieceElement.src = `img/${startPiece.color[0]}${startPiece.type[0].toUpperCase()}${startPiece.type.slice(1)}.png`;
                pieceElement.alt = startPiece.type;
            }

            // Attach the piece object as metadata to the square
            square.piece = startPiece;
            square.appendChild(pieceElement);
        } else {
            square.piece = null; // Empty square
        }

        // Adds the actual board squares and makes sure to create a nice checker pattern
        const row = Math.floor((63 - i) / 8) + 1;
        if (row % 2 === 0) {
            square.classList.add(i % 2 === 0 ? "beige" : "brown");
        } else {
            square.classList.add(i % 2 === 0 ? "brown" : "beige");
        }

        gameBoard.append(square);
    });
}


createBoard();