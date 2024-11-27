
const pieces = {
    none:   {
        name: "",
        Movement: null,
        value: null,
    },
    pawn:{
        name: "P",
        Movement: "",
        value: 1
    },
    knight:{
        name: "N",
        Movement: "",
        value: 3
    },
    bishop:{
        name: "B",
        Movement: "",
        value: 3
    },
    rook:{
        name: "R",
        Movement: "",
        value: 5
    },
    queen:{
        name: "Q",
        Movement: "",
        value: 9
    },
    king:{
        name: "K",
        Movement: "",
        value: null
    },
}

const BOARD_SIZE = 8;
const board = createEmptyBoard();

const gameContainer = document.querySelector(".game-container");

//=====================
var chessTable = document.createElement('table'); 
initBoard();
updateBoard();
gameLoop();

board.addEventListener("click", (e)=>{
    console.log(e)
})


//===========================

//functions
function gameLoop(){
    requestAnimationFrame(gameLoop);
    updateBoard();
}

function createEmptyBoard() {
    const letters = 'abcdefgh';
    const board = {};
    for (let letter of letters) {
        board[letter] = {};
        for (let num = 1; num <= BOARD_SIZE; num++) {
            board[letter][num] = { piece: pieces.none, color: '' };
        }
    }
    return board;
}

function initBoard() { 
    // Create rows and cells
    for (let i = 0; i < 8; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < 8; j++) {
            const className = (i + j) % 2 === 0 ? 'cell whitecell' : 'cell blackcell';
            tr.appendChild(createCell(className));
        }
        chessTable.appendChild(tr);
    }
    gameContainer.appendChild(chessTable);

    // Set initial pieces
    const pieceArray = [pieces.rook, pieces.knight, pieces.bishop, pieces.queen, pieces.king, pieces.bishop, pieces.knight, pieces.rook];
    setInitialPiece(Object.values(board.a), pieceArray); // Black main pieces
    setInitialPiece(Object.values(board.h), pieceArray); // White main pieces

    // Pawns
    Object.values(board.b).forEach(cell => cell.piece = pieces.pawn);
    Object.values(board.g).forEach(cell => cell.piece = pieces.pawn);
}

function createCell(className) {
    const td = document.createElement('td');
    td.setAttribute('class', className);
    return td;
}

function setInitialPiece(row, pieceArray) {
    pieceArray.forEach((piece, i) => {
        row[i].piece = piece;
    });
}


function updateBoard() {
    const cells = document.querySelectorAll(".cell");
    const rows = Object.values(board);

    let cellIndex = 0;
    rows.forEach(row => {
        Object.values(row).forEach(cell => {
            cells[cellIndex].innerText = cell.piece.name || '';
            cellIndex++;
        });
    });
}



function movePiece(startrow, startcol, endrow, endcol) {
    // const [startCol, startRow] = start;
    // const [endCol, endRow] = end;

    const piece = board[startrow][startcol].piece;
    board[endrow][endcol].piece = piece;
    board[startrow][startcol].piece = pieces.none;
}

