const King = `<div class="piece" id="king"><p id="piece"></p></div>`
const Queen = `<div class="piece" id="queen"><p id="piece"></p></div>`
const Bishop = `<div class="piece" id="bishop"><p id="piece"></p></div>`
const Knight = `<div class="piece" id="knight"><p id="piece"></p></div>`
const Rook = `<div class="piece" id="rook"><p id="piece"></p></div>`
const Pawn = `<div class="piece" id="pawn"><p id="piece"></p></div>`

function getLegalMoves(position, pieceType, board, turn, firstTurn) {
    const directions = {
        pawn: [8],
        bishop: [-9, -7, 7, 9],
        rook: [-8, -1, 1, 8],
        knight: [-17, -15, -10, -6, 6, 10, 15, 17],
        queen: [-9, -7, -8, -1, 1, 7, 8, 9],
        king: [-9, -7, -8, -1, 1, 7, 8, 9]
    };

    const moves = [];
    const pieceDirections = directions[pieceType];

    // Pawn moves
    if (pieceType === "pawn") {
        const pawnMove = [];
        const direction = turn === "white" ? -8 : 8;
        const startingRow = turn === "white" ? 6 : 1;

        const singleMove = position + direction;
        if (!board[singleMove]) pawnMove.push(singleMove);

        if (firstTurn && Math.floor(position / 8) === startingRow) {
            const doubleMove = position + 2 * direction;
            if (!board[singleMove] && !board[doubleMove]) pawnMove.push(doubleMove);
        }

        const captureDirections = [direction - 1, direction + 1];
        captureDirections.forEach(captureDir => {
            const capturePos = position + captureDir;
            if (!isOutOfBounds(capturePos, position, captureDir)) {
                if (board[capturePos] && isOpponentPiece(board[capturePos])) {
                    pawnMove.push(capturePos);
                }
            }
        });

        return pawnMove;
    }

    // Knight moves
    if (pieceType === "knight") {
        pieceDirections.forEach(direction => {
            let currentPos = position + direction;
            if (isOutOfBounds(currentPos, position, direction)) return;

            const pieceOnSquare = board[currentPos];
            if (pieceOnSquare) {
                if (isOpponentPiece(pieceOnSquare)) moves.push(currentPos);
                return;
            }

            moves.push(currentPos);
        });
        return moves;
    }

    // Sliding pieces (Bishop, Rook, Queen, etc.)
    pieceDirections.forEach(direction => {
        let currentPos = position;

        while (true) {
            currentPos += direction;
            if (isOutOfBounds(currentPos, position, direction)) break;

            const pieceOnSquare = board[currentPos];
            if (pieceOnSquare) {
                if (isOpponentPiece(pieceOnSquare)) moves.push(currentPos);
                break;
            }

            moves.push(currentPos);
        }
    });

    return moves;
}




function isOutOfBounds(newPos, originalPos, direction) {
    const newRow = Math.floor(newPos / 8);
    const originalRow = Math.floor(originalPos / 8);

    // Left/right boundary check for horizontal movement
    if (direction === -1 && newRow !== originalRow) return true;
    if (direction === 1 && newRow !== originalRow) return true;

    // Top/bottom boundary check for vertical or diagonal movement
    return newPos < 0 || newPos >= 64;
}



function isOpponentPiece(piece) {
    // Replace this with your logic to check if the piece belongs to the opponent
    return piece && piece.color !== playerTurn;
    return piece
}