//Start of JS

const rows = document.querySelectorAll(".row");

const board = [
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["r", "n", "b", "q", "k", "b", "n", "r"]
];


//initialize board
for(let i=0; i<board.length; i++){
    for(let j=0; j<board[i].length;j++){
        console.log(board[i][j])
        rows[i].innerHTML += `<td>${board[i][j].toString()}</td>`
        console
    }
}
//----------------


