console.log("main loaded")
const checkersBoard = document.querySelector(".board");
let selectedPawn = {
    x: null,
    y: null
}
const board = [
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1]
];

for (let i = 0; i < board.length; i++) {
    const row = board[i];
    const isRowEven = i % 2;
    for (let j = 0; j < row.length; j++) {
        const isEven = j % 2;
        const classnames = []
        if (isRowEven) {
            if (isEven) {
                classnames.push("item1");
            } else {
                classnames.push("item2");
            }
        } else {
            if (isEven) {
                classnames.push("item2");
            } else {
                classnames.push("item1");
            }
        }
        let pawnHTML = '';
        if (row[j] === 1) {
            pawnHTML = '<div class="pawn white"></div>';
        } else if (row[j] === 2) {
            pawnHTML = '<div class="pawn black"></div>';
        }
        checkersBoard.innerHTML += `<div class="item ${classnames.join(" ")}">${pawnHTML}</div>`;
    }
}

const pawns = document.querySelectorAll(".white");

for (let i = 0; i < pawns.length; i++) {
    const pawn = pawns[i];
    pawn.addEventListener('click', function () {
        if (pawn.classList.contains("highlighted")) {
            clearSelect();
        } else {
            clearSelect();
            pawn.classList.add("highlighted");
            highlightTiles()
            console.log(pawns[i])
            console.log(board.map(function (value, index) {
                const foundIndex = value.findIndex(function (value2) {
                    if (value2 === 1) {
                        return true;
                    } else {
                        return false;
                    }
                });
                return {
                    x: index,
                    y: foundIndex,
                }
            }));
        }
    });
}

function clearSelect() {
    for (let j = 0; j < pawns.length; j++) {
        const pawn = pawns[j];
        pawn.classList.remove("highlighted");
    }
    for (let i = 0; i < board.length; i++) {
        const row = board[i];
        for (let j = 0; j < row.length; j++) {
            const tile = board[i][j];
            if (tile === 0) {
                const baseIndex = i * 8;
                const itemIndex = baseIndex + j
                const tileElement = document.querySelectorAll(".item")[itemIndex];
                tileElement.classList.remove("highlightedTiles");
            }
        }
    }

}

function highlightTiles() {
    for (let i = 0; i < board.length; i++) {
        const row = board[i];
        for (let j = 0; j < row.length; j++) {
            const tile = board[i][j];
            if (tile === 0) {
                const baseIndex = i * 8;
                const itemIndex = baseIndex + j
                const tileElement = document.querySelectorAll(".item")[itemIndex];
                tileElement.classList.add("highlightedTiles");
            }
        }
    }
}
