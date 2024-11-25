const gameBoard = document.querySelector(".board");
const playerTurn = document.querySelector('.player-turn');
const cell = document.querySelector('.cell')
const rowOneBtn = document.querySelector('.row-one').addEventListener('click', () => rowOne(0, firstPlayerTurn === 'red' ? 1 : 2));
const rowTwoBtn = document.querySelector('.row-two').addEventListener('click', () => rowOne(1, firstPlayerTurn === 'red' ? 1 : 2));
const rowThreeBtn = document.querySelector('.row-three').addEventListener('click', () => rowOne(2, firstPlayerTurn === 'red' ? 1 : 2));
const rowFourBtn = document.querySelector('.row-four').addEventListener('click', () => rowOne(3, firstPlayerTurn === 'red' ? 1 : 2));
const rowFiveBtn = document.querySelector('.row-five').addEventListener('click', () => rowOne(4, firstPlayerTurn === 'red' ? 1 : 2));
const rowSixBtn = document.querySelector('.row-six').addEventListener('click', () => rowOne(5, firstPlayerTurn === 'red' ? 1 : 2));
const rowSevenBtn = document.querySelector('.row-seven').addEventListener('click', () => rowOne(6, firstPlayerTurn === 'red' ? 1 : 2));


const board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];

let firstPlayerTurn = Math.random() < 0.5 ? 'red' : 'yellow';
let counter = 0;
const yellow = 2;
const red = 1;

for (let i = 0; i < board.length; i++) {
    const row = board[i];
    for (let j = 0; j < row.length; j++) {
        gameBoard.innerHTML += `<div class="cell cell-${counter}"></div>`;
        counter++
    }
}

playerTurn.innerText = `${firstPlayerTurn} player turn`

function getCell(counter) {
    return document.querySelector(`.cell-${counter}`);
}

function rowOne(column) {
    let redWin
    let yellowWin
    if (firstPlayerTurn === 'red') {
        for (let row = board.length - 1; row >= 0; row--) {
            if (board[row][column] === 0) {
                board[row][column] = 1;
                let cellNumber = getCell(row * 7 + column);
                cellNumber.style.backgroundColor = 'red';
                firstPlayerTurn = 'yellow';
                playerTurn.innerText = `Yellow player turn`;
                redWin = checkWinner(1);
                console.log(redWin)
                if (redWin === true) {
                    alert('Red wins!');
                }
                break;
            }

        }
    } else {
        for (let row = board.length - 1; row >= 0; row--) {
            if (board[row][column] === 0) {
                board[row][column] = 2;
                let cellNumber = getCell(row * 7 + column);
                cellNumber.style.backgroundColor = 'yellow';
                firstPlayerTurn = 'red';
                playerTurn.innerText = `Red player turn`
                yellowWin = checkWinner(2);
                if (yellowWin === true) {
                    alert('yellow wins!');
                }
                break;
            }

        }
    }
}

function checkWinner(player) {
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (board[r][c] === player) {

               // Horizontal Check (right)
               if (c <= 6 &&  // Ensure we don't go out of bounds horizontally
                board[r][c + 1] === player &&
                board[r][c + 2] === player &&
                board[r][c + 3] === player) {
                return true;  // Four in a row horizontally
            }

            // Vertical Check (down)
            if (r <= 5 &&  // Ensure we don't go out of bounds vertically
                board[r + 1][c] === player &&
                board[r + 2][c] === player &&
                board[r + 3][c] === player) {
                return true;  // Four in a row vertically
            }

            // Diagonal Check (down-right)
            if (r <= 5 && c <= 6 &&  // Ensure we don't go out of bounds
                board[r + 1][c + 1] === player &&
                board[r + 2][c + 2] === player &&
                board[r + 3][c + 3] === player) {
                return true;  // Four in a row diagonally (down-right)
            }

            // Diagonal Check (up-right)
            if (r >= 5 && c <= 6 &&  // Ensure we don't go out of bounds
                board[r - 1][c + 1] === player &&
                board[r - 2][c + 2] === player &&
                board[r - 3][c + 3] === player) {
                return true;  // Four in a row diagonally (up-right)
            }
            }
        }
    }
   return false
}

