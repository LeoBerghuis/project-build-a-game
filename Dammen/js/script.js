console.log("main loaded")
const checkersBoard = document.querySelector(".board");
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
    const row = board[i]
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

