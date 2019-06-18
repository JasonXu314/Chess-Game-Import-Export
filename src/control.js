import * as Utilities from './utility.js';

export function updateWhite(board)
{
    let boolBoard = [[], [], [], [], [], [], [], []];
    for (let x = 0; x < 8; x++)
    {
        for (let y = 0; y < 8; y++)
        {
            boolBoard[y][x] = false;
        }
    }
    for (let x = 0; x < 8; x++)
    {
        for (let y = 0; y < 8; y++)
        {
            if (board[y][x] === null)
            {
                continue;
            }
            else if (Utilities.getColor(board[y][x]) === 'black')
            {
                continue;
            }
            switch (Utilities.getPiece(board[y][x]))
            {
                case ('pawn'):
                    updatePawn(x, y, boolBoard, 'white');
                    break;
                case ('knight'):
                    updateKnight(x, y, boolBoard);
                    break;
                case ('bishop'):
                    updateBishop(x, y, boolBoard, board);
                    break;
                case ('rook'):
                    updateRook(x, y, boolBoard, board);
                    break;
                case ('queen'):
                    updateRook(x, y, boolBoard, board);
                    updateBishop(x, y, boolBoard, board);
                case ('king'):
                    updateKing(x, y, boolBoard);
            }
        }
    }
    return boolBoard;
}

export function updateBlack(board)
{
    let boolBoard = [[], [], [], [], [], [], [], []];
    for (let x = 0; x < 8; x++)
    {
        for (let y = 0; y < 8; y++)
        {
            boolBoard[y][x] = false;
        }
    }
    for (let x = 0; x < 8; x++)
    {
        for (let y = 0; y < 8; y++)
        {
            if (board[y][x] === null)
            {
                continue;
            }
            else if (Utilities.getColor(board[y][x]) === 'white')
            {
                continue;
            }
            switch (Utilities.getPiece(board[y][x]))
            {
                case ('pawn'):
                    updatePawn(x, y, boolBoard, 'black');
                    break;
                case ('knight'):
                    updateKnight(x, y, boolBoard);
                    break;
                case ('bishop'):
                    updateBishop(x, y, boolBoard, board);
                    break;
                case ('rook'):
                    updateRook(x, y, boolBoard, board);
                    break;
                case ('queen'):
                    updateRook(x, y, boolBoard, board);
                    updateBishop(x, y, boolBoard, board);
                    break;
                case ('king'):
                    updateKing(x, y, boolBoard);
            }
        }
    }
    return boolBoard;
}

function updatePawn(x, y, boolBoard, color)
{
    if (color === 'white')
    {
        if (x - 1 >= 0)
        {
            boolBoard[y - 1][x - 1] = true;
        }
        if (x + 1 < 8)
        {
            boolBoard[y - 1][x + 1] = true;
        }
    }
    else
    {
        if (x - 1 >= 0)
        {
            boolBoard[y + 1][x - 1] = true;
        }
        if (x + 1 < 8)
        {
            boolBoard[y + 1][x + 1] = true;
        }
    }
}

function updateKnight(x, y, boolBoard)
{
    if (y + 2 < 8 && x + 1 < 8)
    {
        boolBoard[y + 2][x + 1] = true;
    }
    if (y + 2 < 8 && x - 1 >= 0)
    {
        boolBoard[y + 2][x - 1] = true;
    }
    if (y - 2 >= 0 && x + 1 < 8)
    {
        boolBoard[y - 2][x + 1] = true;
    }
    if (y - 2 >= 0 && x - 1 >= 0)
    {
        boolBoard[y - 2][x - 1] = true;
    }
    if (y + 1 < 8 && x + 2 < 8)
    {
        boolBoard[y + 1][x + 2] = true;
    }
    if (y + 1 < 8 && x - 2 >= 0)
    {
        boolBoard[y + 1][x - 2] = true;
    }
    if (y - 1 >= 0 && x + 2 < 8)
    {
        boolBoard[y - 1][x + 2] = true;
    }
    if (y - 1 >= 0 && x - 2 >= 0)
    {
        boolBoard[y - 1][x - 2] = true;
    }
}

function updateBishop(x, y, boolBoard, pieceBoard)
{
    for (let i = 1; x + i < 8 && y + i < 8; i++)
    {
        boolBoard[y + i][x + i] = true;
        if (pieceBoard[y + i][x + i] !== null)
        {
            break;
        }
    }
    for (let i = 1; x - i >= 0 && y - i >= 0; i++)
    {
        boolBoard[y - i][x - i] = true;
        if (pieceBoard[y - i][x - i] !== null)
        {
            break;
        }
    }
    for (let i = 1; x - i >= 0 && y + i < 8; i++)
    {
        boolBoard[y + i][x - i] = true;
        if (pieceBoard[y + i][x - i] !== null)
        {
            break;
        }
    }
    for (let i = 1; x + i < 8 && y - i >= 0; i++)
    {
        boolBoard[y - i][x + i] = true;
        if (pieceBoard[y - i][x + i] !== null)
        {
            break;
        }
    }
}

function updateRook(x, y, boolBoard, pieceBoard)
{
    for (let i = 1; x + i < 8; i++)
    {
        boolBoard[y][x + i] = true;
        if (pieceBoard[y][x + i] !== null)
        {
            break;
        }
    }
    for (let i = 1; x - i >= 0; i++)
    {
        boolBoard[y][x - i] = true;
        if (pieceBoard[y][x - i] !== null)
        {
            break;
        }
    }
    for (let i = 1; y + i < 8; i++)
    {
        boolBoard[y + i][x] = true;
        if (pieceBoard[y + i][x] !== null)
        {
            break;
        }
    }
    for (let i = 1; y - i >= 0; i++)
    {
        boolBoard[y - i][x] = true;
        if (pieceBoard[y - i][x] !== null)
        {
            break;
        }
    }
}

function updateKing(x, y, board)
{
    if (y + 1 < 8 && x + 1 < 8)
    {
        board[y + 1][x + 1] = true;
    }
    if (y + 1 < 8 && x - 1 >= 0)
    {
        board[y + 1][x - 1] = true;
    }
    if (y - 1 >= 0 && x + 1 < 8)
    {
        board[y - 1][x + 1] = true;
    }
    if (y - 1 >= 0 && x - 1 >= 0)
    {
        board[y - 1][x - 1] = true;
    }
    if (y + 1 < 8)
    {
        board[y + 1][x] = true;
    }
    if (y - 1 >= 0)
    {
        board[y - 1][x] = true;
    }
    if (x + 1 < 8)
    {
        board[y][x + 1] = true;
    }
    if (x - 1 >= 0)
    {
        board[y][x - 1] = true;
    }
}