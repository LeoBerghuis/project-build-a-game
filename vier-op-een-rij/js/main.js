const gameBoard = document.querySelector(".board");
const cell = document.querySelector('.cell')
const rowOneBtn = document.querySelector('.row-one').addEventListener('click', testFunction);
const board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];
const firstPlayerTurn = Math.random() < 0.5 ? 'red' : 'yellow';

let counter = 1;

for (let i = 0; i < board.length; i++) {
    const row = board[i];
    for (let j = 0; j < row.length; j++) {
          gameBoard.innerHTML += `<div class="cell" id="${counter}"></div>`;
          counter++
    }
}

function testFunction () {
    const test = document.querySelector('[id="36"]');
    console.log(firstPlayerTurn)
    if (firstPlayerTurn <= 0.49) {
        redTurn = true;
        if (board[5][0] === 0) {
            test.style.backgroundColor = 'red';
            board[5][0] = 1;
        }
    } else {
        yellowTurn = true;
        if (board[5][0] === 0) {
            test.style.backgroundColor = 'yellow';
            board[5][0] = 2;
        }
    }
    testNumberrTwo()
}

function testNumberrTwo() {
    const test = document.querySelector('[id="29"]');
    if (board[5][0] === 0) {
        console.log('still 0')
    } else if (board[5][0] === 1) {
        test.style.backgroundColor = 'yellow';
        board[4][0] === 2
    } else {
        console.log('wrong one')
    }
}