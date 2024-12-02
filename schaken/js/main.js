
//https://github.com/SahilM2063/Simple-Chess-Using-Javascript/blob/main/app.js
//this is what you're learning from (copying but also figuring out how it works)


const gameBoard = document.querySelector("#gameboard");
const width = 8

let playerTurn = "black";

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
            square.firstChild.firstChild.classList.add("black");
        }
        if (i >= 48) {
            square.firstChild.firstChild.classList.add("white");
        }
        
        gameBoard.append(square);
    })
}


createBoard();


const allSquares = document.querySelectorAll("#gameboard .square");

allSquares.forEach( square =>{
    square.addEventListener("dragstart", dragstart);
    square.addEventListener('dragover', dragover);
    square.addEventListener('drop', dragdrop);
})

function dragstart(e) {
    startPositionId = e.target.parentNode.getAttribute("square-id")
    draggedElement = e.target
    console.log("DRAG")
}

function dragover(e) {
    e.preventDefault();
    console.log("OVER")
}

function dragdrop(e) {
    e.stopPropagation();
    console.log("DROP")


    const correctTurn = draggedElement.firstChild.classList.contains(playerTurn);
    const taken = e.target.classList.contains('piece');
    const valid = null //coming soon
    const opponentTurn = playerTurn === "white" ? "black" : "white";
    const takenByOpponent = e.target.firstChild.classList.contains(opponentTurn);

    
    if (correctTurn){
        //if true the piece is allowed to move(later will also check valid)
    }
}

// const pieces = {
//     none:   {
//         name: "",
//         Movement: null,
//         value: null,
//     },
//     pawn:{
//         name: "P",
//         Movement: "",
//         value: 1
//     },
//     knight:{
//         name: "N",
//         Movement: "",
//         value: 3
//     },
//     bishop:{
//         name: "B",
//         Movement: "",
//         value: 3
//     },
//     rook:{
//         name: "R",
//         Movement: "",
//         value: 5
//     },
//     queen:{
//         name: "Q",
//         Movement: "",
//         value: 9
//     },
//     king:{
//         name: "K",
//         Movement: "",
//         value: null
//     },
// }

// const BOARD_SIZE = 8;
// const board = createEmptyBoard();

// const gameContainer = document.querySelector(".game-container");

// //=====================
// var chessTable = document.createElement('table'); 
// initBoard();
// updateBoard();
// gameLoop();

// board.addEventListener("click", (e)=>{
//     console.log(e)
// })


// //===========================

// //functions
// function gameLoop(){
//     requestAnimationFrame(gameLoop);
//     updateBoard();
// }

// function createEmptyBoard() {
//     const letters = 'abcdefgh';
//     const board = {};
//     for (let letter of letters) {
//         board[letter] = {};
//         for (let num = 1; num <= BOARD_SIZE; num++) {
//             board[letter][num] = { piece: pieces.none, color: '' };
//         }
//     }
//     return board;
// }

// function initBoard() { 
//     // Create rows and cells
//     for (let i = 0; i < 8; i++) {
//         const tr = document.createElement('tr');
//         for (let j = 0; j < 8; j++) {
//             const className = (i + j) % 2 === 0 ? 'cell whitecell' : 'cell blackcell';
//             tr.appendChild(createCell(className));
//         }
//         chessTable.appendChild(tr);
//     }
//     gameContainer.appendChild(chessTable);

//     // Set initial pieces
//     const pieceArray = [pieces.rook, pieces.knight, pieces.bishop, pieces.queen, pieces.king, pieces.bishop, pieces.knight, pieces.rook];
//     setInitialPiece(Object.values(board.a), pieceArray); // Black main pieces
//     setInitialPiece(Object.values(board.h), pieceArray); // White main pieces

//     // Pawns
//     Object.values(board.b).forEach(cell => cell.piece = pieces.pawn);
//     Object.values(board.g).forEach(cell => cell.piece = pieces.pawn);
// }

// function createCell(className) {
//     const td = document.createElement('td');
//     td.setAttribute('class', className);
//     return td;
// }

// function setInitialPiece(row, pieceArray) {
//     pieceArray.forEach((piece, i) => {
//         row[i].piece = piece;
//     });
// }


// function updateBoard() {
//     const cells = document.querySelectorAll(".cell");
//     const rows = Object.values(board);

//     let cellIndex = 0;
//     rows.forEach(row => {
//         Object.values(row).forEach(cell => {
//             cells[cellIndex].innerText = cell.piece.name || '';
//             cellIndex++;
//         });
//     });
// }



// function movePiece(startrow, startcol, endrow, endcol) {
//     // const [startCol, startRow] = start;
//     // const [endCol, endRow] = end;

//     const piece = board[startrow][startcol].piece;
//     board[endrow][endcol].piece = piece;
//     board[startrow][startcol].piece = pieces.none;
// }

