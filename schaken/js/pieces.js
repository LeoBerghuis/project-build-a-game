const King = `<div class="piece" id="king"><p id="piece"></p></div>`
const Queen = `<div class="piece" id="queen"><p id="piece"></p></div>`
const Bishop = `<div class="piece" id="bishop"><p id="piece"></p></div>`
const Knight = `<div class="piece" id="knight"><p id="piece"></p></div>`
const Rook = `<div class="piece" id="rook"><p id="piece"></p></div>`
const Pawn = `<div class="piece" id="pawn"><p id="piece"></p></div>`

function getLegalMoves(position, piece, board, turn, firstTurn) {
    // Safeguards
    if (!piece || !piece.type) {
        console.error("Invalid piece:", piece);
        return [];
    }

    if (!board[position]) {
        console.error(`No piece found at position ${position}`);
        return [];
    }

    const directions = {
        pawn: [8],  // For pawn, just the single forward move (8 for white, -8 for black)
        bishop: [-9, -7, 7, 9],
        rook: [-8, -1, 1, 8],
        knight: [6, 10, 15, 17, -6, -10, -15, -17],
        queen: [-9, -7, -8, -1, 1, 7, 8, 9],
        king: [-9, -7, -8, -1, 1, 7, 8, 9]
    };

    const moves = [];
    const pieceDirections = directions[piece.type];

    if (!pieceDirections) {
        console.error("No directions for piece type:", piece.type);
        return [];
    }

    // Pawn Movement Logic
    if (piece.type === "pawn") {
        const pawnMove = [];
        const direction = turn === "white" ? -8 : 8;  // White moves up (-8), Black moves down (+8)
    
        // Single forward move
        const singleMove = position + direction;
        if (!board[singleMove]) pawnMove.push(singleMove);
    
        // Double forward move (only if pawn hasn't moved before)
        if (board[position] && !board[position].hasMoved) {
            const doubleMove = position + 2 * direction;
            if (!board[singleMove] && !board[doubleMove]) pawnMove.push(doubleMove);
        }
    
        // Diagonal captures
        const diagonalLeft = position + direction - 1;
        const diagonalRight = position + direction + 1;
    
        if (board[diagonalLeft] && isOpponentPiece(board[diagonalLeft])) {
            pawnMove.push(diagonalLeft);  // Capture on left diagonal
        }
    
        if (board[diagonalRight] && isOpponentPiece(board[diagonalRight])) {
            pawnMove.push(diagonalRight);  // Capture on right diagonal
        }
    
        return pawnMove;
    }

    // Knight logic
    if (piece.type === "knight") {
        pieceDirections.forEach(direction => {
            const currentPos = position + direction;
            
            // Ensure the knight's move is within bounds
            if (isOutOfBounds(currentPos, position, direction)) return;  // Skip invalid moves

            const pieceOnSquare = board[currentPos];
            if (pieceOnSquare) {
                if (isOpponentPiece(pieceOnSquare)) moves.push(currentPos);  // If opponent's piece, add to valid moves
                return;  // Stop checking after finding a piece
            }

            moves.push(currentPos);  // If square is empty, add to valid moves
        });
        return moves;
    }


    // King single movement Logic
    if(piece.type === "king"){
        pieceDirections.forEach(direction =>{
            const currentPos = position + direction;
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

    // Sliding Pieces Logic (Bishop, Rook, Queen)
    pieceDirections.forEach(direction => {
        let currentPos = position;

        while (true) {
            currentPos += direction;
            if (isOutOfBounds(currentPos, position, direction, piece)) break; // Stop if out of bounds

            const pieceOnSquare = board[currentPos];
            if (pieceOnSquare) {
                if (isOpponentPiece(pieceOnSquare)) moves.push(currentPos); // Capture opponent piece
                break; // Stop sliding after hitting a piece
            }
            moves.push(currentPos); // Add empty square to moves
        }
    });

    return moves;
}




function isOutOfBounds(newPos, originalPos, direction, piece) {
    const newRow = Math.floor(newPos / 8);
    const originalRow = Math.floor(originalPos / 8);
    const newCol = newPos % 8;
    const originalCol = originalPos % 8;
    // General board boundaries
    if (newPos < 0 || newPos >= 64) return true;

    // Prevents diagonally wrapping around the sides of the board (queen/bishop)

    if (direction === -9 && newCol === 7) return true; // Left-up
    if (direction === -7 && newCol === 0) return true; // Right-up

    if (direction === 7 && newCol === 7) return true;  // Left-down
    console.log(direction)
    if (direction === 9 && newCol === 7) return true;  // Right-down

    // Prevents direct horizontal wrapping around the board (queen/rook)
    if (direction === -1 && newCol === 7) return true; // Left
    if (direction === 1 && newCol === 0) return true;  // Right

    //Prevents horizontally wrapping around the board(king)
    if (direction === -9 && newCol === 7) return true;


    if (direction < 0 && newCol === 7) return true; 
    if (direction > 0 && newCol === 0) return true;

    // Prevents vertically wrapping around the board (queen/rook)
    if (direction === -8 && newRow === 7) return true; // Up
    if (direction === 8 && newRow === 0) return true;  // Down

    // Knight-specific boundaries (L-shaped movement)
    const knightDirections = [6, 10, 15, 17]; // Valid knight directions in terms of steps
    if (knightDirections.includes(Math.abs(direction))) {
        // For knight moves, we check if the new row and column are within the valid range
        // We only want to block knight's left-moving direction at column 0
        if (newCol < 0 || newCol >= 8 || newRow < 0 || newRow >= 8) {
            console.log("Out of bounds (knight move):", newPos);  // Debug log
            return true;  // Knight move out of bounds
        }

        // Prevent knights from going left on the board (if they cross column 0)
        if (direction === -17 && newCol === 7) return true; // Knights trying to move from column 1 to 0 (leftwards)
        if (direction === -10 && newCol === 7) return true; // Knights trying to move from column 1 to 0 (leftwards)
    }

    return false;
}




function isOpponentPiece(piece) {
    // Check if the piece exists and if it is an opponent piece (not the same color as the player)
    return piece && piece.color !== playerTurn;
}
