const gameBoard = document.querySelector(".board");
const playerTurn = document.querySelector('.player-turn');
const cell = document.querySelector('.cell')
const playerOption = document.querySelector('#player');
const rowOneBtn = document.querySelector('.row-one').addEventListener('click', () => placeCell(0, firstPlayerTurn === 'red' ? 1 : 2));
const rowTwoBtn = document.querySelector('.row-two').addEventListener('click', () => placeCell(1, firstPlayerTurn === 'red' ? 1 : 2));
const rowThreeBtn = document.querySelector('.row-three').addEventListener('click', () => placeCell(2, firstPlayerTurn === 'red' ? 1 : 2));
const rowFourBtn = document.querySelector('.row-four').addEventListener('click', () => placeCell(3, firstPlayerTurn === 'red' ? 1 : 2));
const rowFiveBtn = document.querySelector('.row-five').addEventListener('click', () => placeCell(4, firstPlayerTurn === 'red' ? 1 : 2));
const rowSixBtn = document.querySelector('.row-six').addEventListener('click', () => placeCell(5, firstPlayerTurn === 'red' ? 1 : 2));
const rowSevenBtn = document.querySelector('.row-seven').addEventListener('click', () => placeCell(6, firstPlayerTurn === 'red' ? 1 : 2));
const settignsBtn = document.querySelector('.settings').addEventListener('click', openSettings);
const settingsWindow = document.querySelector('.settings-popup');
const startGameBtn = document.querySelector('.start-game').addEventListener('click', startGame);
let board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];

let firstPlayerTurn = Math.random() < 0.5 ? 'red' : 'yellow';
let counter = 0;

window.onload = loadBoard();

function startGame() {
    const startSreen = document.querySelector('.start-screen');
    startSreen.style.display = 'none';
}

function loadBoard() {
    board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ];
    counter = 0;
    gameBoard.innerHTML = ``;
    for (let i = 0; i < board.length; i++) {
        const row = board[i];
        for (let j = 0; j < row.length; j++) {
            gameBoard.innerHTML += `<div class="cell cell-${counter}"></div>`;
            counter++
        }
    }
}

playerTurn.innerText = `${firstPlayerTurn} player turn`

function getCell(counter) {
    return document.querySelector(`.cell-${counter}`);
}

function placeCell(column) {
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
                if (redWin === true) {
                    alert('Red wins!');
                    setTimeout(loadBoard, 3000);
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
                    alert('yellow wins');
                    setTimeout(loadBoard, 3000);
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

                if (c <= 3 &&
                    board[r][c + 1] === player &&
                    board[r][c + 2] === player &&
                    board[r][c + 3] === player) {
                    return true;
                }

                if (r <= 2 &&
                    board[r + 1][c] === player &&
                    board[r + 2][c] === player &&
                    board[r + 3][c] === player) {
                    return true;
                }

                if (r <= 2 && c <= 3 &&
                    board[r + 1][c + 1] === player &&
                    board[r + 2][c + 2] === player &&
                    board[r + 3][c + 3] === player) {
                    return true;
                }

                if (r >= 3 && c <= 3 &&
                    board[r - 1][c + 1] === player &&
                    board[r - 2][c + 2] === player &&
                    board[r - 3][c + 3] === player) {
                    return true;
                }
            }
        }
    }
    if (checkTie(board)) {
        alert("It's a tie!");
        setTimeout(loadBoard, 3000);
    }

    return false
}

function checkTie(board) {
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (board[r][c] === 0) {
                return false;
            }
        }
    }
    return true;
}


function openSettings() {
    settingsWindow.classList.toggle('active');
}