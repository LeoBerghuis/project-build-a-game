const King = `<div class="piece" id="king"><p id="piece"></p></div>`
const Queen = `<div class="piece" id="queen"><p id="piece"></p></div>`
const Bishop = `<div class="piece" id="bishop"><p id="piece"></p></div>`
const Knight = `<div class="piece" id="knight"><p id="piece"></p></div>`
const Rook = `<div class="piece" id="rook"><p id="piece"></p></div>`
const Pawn = `<div class="piece" id="pawn"><p id="piece"></p></div>`

function getLegalMoves(position, piece, board, turn, firstTurn, preventCheck = true) {
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

    let moves = [];
    const pieceDirections = directions[piece.type];

    if (!pieceDirections) {
        console.error("No directions for piece type:", piece.type);
        return [];
    }

    // Pawn Movement Logic (same as current)
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

    // Knight logic (same as current)
    if (piece.type === "knight") {
        pieceDirections.forEach(direction => {
            const currentPos = position + direction;

            if (isOutOfBounds(currentPos, position, direction, piece)) return;  // Skip invalid moves

            const pieceOnSquare = board[currentPos];
            if (pieceOnSquare) {
                if (isOpponentPiece(pieceOnSquare)) moves.push(currentPos);  // If opponent's piece, add to valid moves
                return;  // Stop checking after finding a piece
            }

            moves.push(currentPos);  // If square is empty, add to valid moves
        });
    }

    // King single movement Logic (same as current)
    if (piece.type === "king") {
        pieceDirections.forEach(direction => {
            const currentPos = position + direction;
            if (isOutOfBounds(currentPos, position, direction, piece)) return;

            const pieceOnSquare = board[currentPos];
            if (pieceOnSquare) {
                if (isOpponentPiece(pieceOnSquare)) moves.push(currentPos);
                return;
            }
            moves.push(currentPos);

            const castlingMoves = getCastlingMoves(position, piece, board, turn);
        moves = moves.concat(castlingMoves);
        });
    }

    // Sliding Pieces Logic (Bishop, Rook, Queen)
    if (["bishop", "rook", "queen"].includes(piece.type)) {
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
    }

    // Filter moves to prevent leaving the king in check
    if (preventCheck) {
        console.log(moves);
        moves = filterMovesToPreventCheck(board, moves, position, piece, turn);
        console.log("Filtered! moves left are:" + moves);
    }

    return moves;
}


function getCastlingMoves(position, piece, board, turn) {
    const moves = [];
    const kingPosition = position;
    const kingRow = Math.floor(kingPosition / 8);  // Row of the king
    const opponentColor = turn === "white" ? "black" : "white";

    if (piece.hasMoved) return moves;  // King has already moved, no castling possible

    // Check kingside castling
    const kingsideRookPosition = kingRow * 8 + 7;  // Rook at H file (7th column)
    const kingsideRook = board[kingsideRookPosition];

    if (kingsideRook && kingsideRook.type === "rook" && !kingsideRook.hasMoved) {
        // Check if there are no pieces between king and rook
        if (!board[kingPosition + 1] && !board[kingPosition + 2]) {
            // Check if the squares the king moves through are not under attack
            if (!isSquareUnderAttack(board, kingPosition + 1, opponentColor) &&
                !isSquareUnderAttack(board, kingPosition + 2, opponentColor)) {
                // Castling move
                moves.push(kingPosition + 2);
            }
        }
    }
    // Check queenside castling
    const queensideRookPosition = kingRow * 8 + 0;  // Rook at A file (0th column)
    const queensideRook = board[queensideRookPosition];

    if (queensideRook && queensideRook.type === "rook" && !queensideRook.hasMoved) {
        // Check if there are no pieces between king and rook
        if (!board[kingPosition - 1] && !board[kingPosition - 2] && !board[kingPosition - 3]) {
            // Check if the squares the king moves through are not under attack
            if (!isSquareUnderAttack(board, kingPosition - 1, opponentColor) &&
                !isSquareUnderAttack(board, kingPosition - 2, opponentColor)) {
                // Castling move
                moves.push(kingPosition - 2);
            }
        }
    }

    return moves;
}

function isSquareUnderAttack(board, square, opponentColor) {
    const opponentMoves = getAllOpponentMovesWithoutCheck(board, opponentColor, square);
    return opponentMoves.includes(square);
}

function isOutOfBounds(newPos, originalPos, direction, piece) {
    const newRow = Math.floor(newPos / 8);
    const originalRow = Math.floor(originalPos / 8);
    const newCol = newPos % 8;
    const originalCol = originalPos % 8;

    if (!piece || !piece.type) {
        console.error("Invalid piece passed to isOutOfBounds:", piece);
        return true;
    }

    // General board boundaries
    if (newPos < 0 || newPos >= 64) return true;

    // Sliding piece boundary checks
    if (["bishop", "queen"].includes(piece.type)) {
        if (direction === -9 && newCol === 7) return true; // Left-up
        if (direction === -7 && newCol === 0) return true; // Right-up
        if (direction === 7 && newCol === 7) return true;  // Left-down
        if (direction === 9 && newCol === 0) return true;  // Right-down
    }

    if (["rook", "queen"].includes(piece.type)) {
        if ((direction === -1 && newCol === 7) || (direction === 1 && newCol === 0)) return true;
    }

    // Knight-specific boundary checks
    if (piece.type === "knight") {
        // Validate L-shaped movement
        const rowDiff = Math.abs(newRow - originalRow);
        const colDiff = Math.abs(newCol - originalCol);
        if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
            return false; // Valid knight move
        }
        return true; // Invalid knight move
    }

    return false;
}





function isOpponentPiece(piece) {
    // Check if the piece exists and if it is an opponent piece (not the same color as the player)
    return piece && piece.color !== playerTurn;
}



function findKing(board, color) {
    for (let i = 0; i < board.length; i++) {
        const piece = board[i];
        if (piece && piece.type === "king" && piece.color === color) {
            return i; // Return the king's position
        }
    }
    return -1; // King not found (should not happen in a valid game)
}


function getAllOpponentMovesWithoutCheck(board, opponentColor, kingPos) {
    let opponentMoves = [];
    
    // Loop through all opponent pieces and gather their valid moves
    for (let i = 0; i < board.length; i++) {
        const piece = board[i];
        if (piece && piece.color === opponentColor) {
            const legalMoves = getLegalMoves(i, piece, board, opponentColor, false, false); // Get legal moves without recursion
            opponentMoves = opponentMoves.concat(legalMoves);
        }
    }

    return opponentMoves;
}


function isKingInCheck(board, kingColor) {
    // Find the king's position
    const kingPos = findKing(board, kingColor);
    if (kingPos === -1) {
        console.error("King not found on the board!");
        return false;
    }

    // Determine the opponent's color
    const opponentColor = kingColor === "white" ? "black" : "white";
    
    // Get all moves of the opponent, ensuring no recursive check for the king
    const opponentMoves = getAllOpponentMovesWithoutCheck(board, opponentColor, kingPos);

    // The king is in check if any of the opponent's moves can land on the king's position
    return opponentMoves.includes(kingPos);
}



function filterMovesToPreventCheck(board, moves, position, piece, turn) {
    const opponentColor = turn === "white" ? "black" : "white";
    const kingPos = findKing(board, turn);

    return moves.filter(move => {
        // Simulate the move
        const simulatedBoard = simulateMove(board, position, move);

        // Check if the opponent's move would leave the king in check
        const opponentMoves = getAllOpponentMovesWithoutCheck(simulatedBoard, opponentColor, kingPos);

        // If the move causes check, discard it
        if (opponentMoves.includes(kingPos)) {
            return false;
        }

        // Now check if the move blocks the check or captures the threatening piece
        const attackingPieces = getAllOpponentMovesWithoutCheck(board, opponentColor, kingPos);
        
        // If this move captures or blocks a piece that is attacking the king, prioritize it
        const pieceOnTargetSquare = board[move];
        if (attackingPieces.includes(move)) {
            // The move is an attack that resolves the check (either by capture or blocking the attack)
            return true;
        }

        return true; // Otherwise, allow the move if it's not causing check
    });
}





function simulateMove(board, from, to) {
    const newBoard = [...board];
    newBoard[to] = newBoard[from]; // Move the piece to the new position
    newBoard[from] = null; // Clear the original position
    return newBoard;
}

function isCheckmate(board, kingColor) {
    // Check if the king is in check
    if (!isKingInCheck(board, kingColor)) {
        return false; // Not checkmate if the king is not in check
    }

    // Get the position of the king
    const kingPos = findKing(board, kingColor);
    if (kingPos === -1) {
        console.error("King not found on the board!");
        return false; // Invalid game state
    }

    // Check if the king has any legal moves
    const kingPiece = board[kingPos];
    const kingMoves = getLegalMoves(kingPos, kingPiece, board, kingColor, false); // Don't prevent check

    if (kingMoves.length > 0) {
        return false; // King can escape
    }

    // Check if any other piece can block or capture the threat
    const opponentColor = kingColor === "white" ? "black" : "white";
    const opponentMoves = getAllOpponentMovesWithoutCheck(board, opponentColor, kingPos);
    
    for (let i = 0; i < board.length; i++) {
        const piece = board[i];
        if (piece && piece.color === kingColor) {
            const legalMoves = getLegalMoves(i, piece, board, kingColor, false, false);
            for (const move of legalMoves) {
                const simulatedBoard = simulateMove(board, i, move);
                // Check if after the move, the king is still in check
                if (!isKingInCheck(simulatedBoard, kingColor)) {
                    return false; // Another piece can block or capture the threat
                }
            }
        }
    }

    // If no moves can save the king, it's checkmate
    return true;
}