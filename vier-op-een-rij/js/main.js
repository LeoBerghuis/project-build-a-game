const gameBoard = document.querySelector(".board");
const playerTurn = document.querySelector(".player-turn");
const cell = document.querySelector(".cell");
const playerOption = document.querySelector("#player");
const rowOneBtn = document
  .querySelector(".row-one")
  .addEventListener("click", () =>
    placeCell(0, firstPlayerTurn === "red" ? 1 : 2)
  );
const rowTwoBtn = document
  .querySelector(".row-two")
  .addEventListener("click", () =>
    placeCell(1, firstPlayerTurn === "red" ? 1 : 2)
  );
const rowThreeBtn = document
  .querySelector(".row-three")
  .addEventListener("click", () =>
    placeCell(2, firstPlayerTurn === "red" ? 1 : 2)
  );
const rowFourBtn = document
  .querySelector(".row-four")
  .addEventListener("click", () =>
    placeCell(3, firstPlayerTurn === "red" ? 1 : 2)
  );
const rowFiveBtn = document
  .querySelector(".row-five")
  .addEventListener("click", () =>
    placeCell(4, firstPlayerTurn === "red" ? 1 : 2)
  );
const rowSixBtn = document
  .querySelector(".row-six")
  .addEventListener("click", () =>
    placeCell(5, firstPlayerTurn === "red" ? 1 : 2)
  );
const rowSevenBtn = document
  .querySelector(".row-seven")
  .addEventListener("click", () =>
    placeCell(6, firstPlayerTurn === "red" ? 1 : 2)
  );
const settignsBtn = document
  .querySelector(".settings")
  .addEventListener("click", openSettings);
const settingsWindow = document.querySelector(".settings-popup");
const playerOne = document.querySelector("#player-select-one");
const playerTwo = document.querySelector("#player-select-two");
const startSreen = document.querySelector(".start-screen");
const popup = document.querySelector(".popup");
const startGameBtn = document
  .querySelector(".start-game")
  .addEventListener("click", startGame);
const allPlayers = JSON.parse(localStorage.getItem("playerObj"));

let activePlayerOne;
let activePlayerTwo;
let selectedPlayerOne;
let selectedPlayerTwo;
let board;
let firstPlayerTurn;
let counter = 0;
let gameEnded = false;

window.onload = () => {
  for (let i = 0; i < allPlayers.length; i++) {
    const player = allPlayers[i];
    playerOne.innerHTML += `<option value="${player.username}">${player.username}</option>`;
    playerTwo.innerHTML += `<option value="${player.username}">${player.username}</option>`;
  }
  loadBoard();
};

function showPopup(text) {
  popup.innerHTML = text;

  popup.classList.add("active");
  setTimeout(() => {
    popup.classList.remove("active");
  }, 3000);
}

function startGame() {
  const selectedPlayerUsernameOne = playerOne.value;
  const selectedPlayerUsernameTwo = playerTwo.value;
  selectedPlayerOne = allPlayers.find(
    (player) => player.username === selectedPlayerUsernameOne
  );
  selectedPlayerTwo = allPlayers.find(
    (player) => player.username === selectedPlayerUsernameTwo
  );

  if (selectedPlayerOne === selectedPlayerTwo) {
    alert("Please select two different players!");
    return;
  }

  if (!selectedPlayerOne.color) {
    selectedPlayerOne.color =
      document.querySelector(".player-one-color-picker").value || "#ff0000"; // Default red
  }
  if (!selectedPlayerTwo.color) {
    selectedPlayerTwo.color =
      document.querySelector(".player-two-color-picker").value || "#ffff00"; // Default yellow
  }

  activePlayerOne = selectedPlayerOne;
  activePlayerTwo = selectedPlayerTwo;
  startSreen.style.display = "none";
  firstPlayerTurn = Math.random() < 0.5 ? selectedPlayerOne : selectedPlayerTwo;
  playerTurn.innerText = `${firstPlayerTurn.username} turn`;
}

function loadBoard() {
  gameEnded = false;
  board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  counter = 0;
  gameBoard.innerHTML = ``;
  for (let i = 0; i < board.length; i++) {
    const row = board[i];
    for (let j = 0; j < row.length; j++) {
      gameBoard.innerHTML += `<div class="cell cell-${counter}"></div>`;
      counter++;
    }
  }
}

function getCell(counter) {
  return document.querySelector(`.cell-${counter}`);
}

function placeCell(column) {
  for (let row = board.length - 1; row >= 0; row--) {
    if (board[row][column] === 0) {
      if (gameEnded === true) {
        alert('Already a winner, Please wait!');
        return;
      }

      const currentPlayer = firstPlayerTurn;
      const currentColor = currentPlayer.color;
      const currentToken = currentPlayer === selectedPlayerOne ? 1 : 2;

      board[row][column] = currentToken;
      const cellNumber = getCell(row * 7 + column);
      cellNumber.style.backgroundColor = currentColor;

      const win = checkWinner(currentToken);

      if (win) {
        gameEnded = true;

        const winnerText = `${currentPlayer.username} has won the game!`;
        showPopup(winnerText);

        currentPlayer.xp += 100;
        while (currentPlayer.xp >= 500) {
          currentPlayer.level++;
          currentPlayer.xp -= 500;
        }

        localStorage.setItem("playerObj", JSON.stringify(allPlayers));
        checkLocalStorage();
        showAllPlayers();

        setTimeout(loadBoard, 1000);
        return;
      }

      firstPlayerTurn = currentPlayer === selectedPlayerOne ? selectedPlayerTwo : selectedPlayerOne;
      playerTurn.innerText = `${firstPlayerTurn.username} turn`;

      break;
    }
  }
}

function checkWinner(player) {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === player) {
        if (
          c <= 3 &&
          board[r][c + 1] === player &&
          board[r][c + 2] === player &&
          board[r][c + 3] === player
        ) {
          return true;
        }

        if (
          r <= 2 &&
          board[r + 1][c] === player &&
          board[r + 2][c] === player &&
          board[r + 3][c] === player
        ) {
          return true;
        }

        if (
          r <= 2 &&
          c <= 3 &&
          board[r + 1][c + 1] === player &&
          board[r + 2][c + 2] === player &&
          board[r + 3][c + 3] === player
        ) {
          return true;
        }

        if (
          r >= 3 &&
          c <= 3 &&
          board[r - 1][c + 1] === player &&
          board[r - 2][c + 2] === player &&
          board[r - 3][c + 3] === player
        ) {
          return true;
        }
      }
    }
  }
  if (checkTie(board)) {
    alert("It's a tie!");
    setTimeout(loadBoard, 3000);
  }

  return false;
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
  settingsWindow.classList.toggle("active");
}
