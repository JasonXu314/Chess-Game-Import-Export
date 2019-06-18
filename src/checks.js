import { board, data, blackKing, whiteKing, epMove } from './index.js';
import * as Utilities from './utility.js';
import * as Control from './control.js';

export function isCheckmate()
{
    for (let x = 0; x < 8; x++)
    {
        for (let y = 0; y < 8; y++)
        {
            if (board[y][x] !== null && Utilities.getColor(board[y][x]) === data.moveColor)
            {
                switch (Utilities.getPiece(board[y][x]))
                {
                    case ('pawn'):
                        if (tryPawn(x, y, data.moveColor))
                        {
                            return false;
                        }
                        break;
                    case ('knight'):
                        if (tryKnight(x, y, data.moveColor))
                        {
                            return false;
                        }
                        break;
                    case ('bishop'):
                        if (tryBishop(x, y, data.moveColor))
                        {
                            return false;
                        }
                        break;
                    case ('rook'):
                        if (tryRook(x, y, data.moveColor))
                        {
                            return false;
                        }
                        break;
                    case ('queen'):
                        if (tryBishop(x, y, data.moveColor) || tryRook(x, y, data.moveColor))
                        {
                            return false;
                        }
                        break;
                    case ('king'):
                        if (tryKing(x, y, data.moveColor))
                        {
                            return false;
                        }
                }
            }
        }
    }
    return true;
}

function tryPawn(x, y, color)
{
    let up = color === 'white';
    if (board[up ? y - 1 : y + 1][x] === null)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[up ? y - 1 : y + 1][x] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (up)
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                console.log('up1', x, y);
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                console.log('up1', x, y);
                return true;
            }
        }
        if (board[up ? y - 2 : y + 2][x] === null)
        {
            boardCopy = Array.from(board, (element) => Array.from(element));
            boardCopy[up ? y - 2 : y + 2][x] = boardCopy[y][x];
            boardCopy[y][x] = null;
            if (up)
            {
                if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                {
                    console.log('up2', x, y);
                    return true;
                }
            }
            else
            {
                if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
                {
                    console.log('up2', x, y);
                    return true;
                }
            }
        }
    }
    if (x + 1 < 8 && board[up ? y - 1 : y + 1][x + 1] !== null && Utilities.getColor(board[up ? y - 1 : y + 1][x + 1]) !== color)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[up ? y - 1 : y + 1][x + 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (up)
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                console.log('up1right1', x, y);
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                console.log('up1right1', x, y);
                return true;
            }
        }
    }
    if (x - 1 >= 0 && board[up ? y - 1 : y + 1][x - 1] !== null && Utilities.getColor(board[up ? y - 1 : y + 1][x - 1]) !== color)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[up ? y - 1 : y + 1][x - 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (up)
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                console.log('up1left1', x, y);
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                console.log('up1left1', x, y);
                return true;
            }
        }
    }
    if (epMove.x === x - 1 && epMove.y === y && board[up ? y - 1 : y + 1][x - 1] === null)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[up ? y - 1 : y + 1][x - 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        boardCopy[y][x - 1] = null;
        if (up)
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                console.log('epleft', x, y);
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                console.log('epleft', x, y);
                return true;
            }
        }
    }
    if (epMove.x === x + 1 && epMove.y === y && board[up ? y - 1 : y + 1][x + 1] == null)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[up ? y - 1 : y + 1][x - 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        boardCopy[y][x + 1] = null;
        if (up)
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                console.log('epright', x, y);
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                console.log('epright', x, y);
                return true;
            }
        }
    }
    return false;
}

function tryKnight(x, y, color)
{
    if ((y <= 5 && x <= 6) && (board[y + 2][x + 1] === null || Utilities.getColor(board[y + 2][x + 1]) !== color))
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 2][x + 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                return true;
            }
        }
    }
    if ((y >= 2 && x >= 1) && (board[y - 2][x - 1] === null || Utilities.getColor(board[y - 2][x - 1]) !== color))
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - 2][x - 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                return true;
            }
        }
    }
    if ((y <= 5 && x >= 1) && (board[y + 2][x - 1] === null || Utilities.getColor(board[y + 2][x - 1]) !== color))
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 2][x - 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                return true;
            }
        }
    }
    if ((y >= 2 && x <= 6) && (board[y - 2][x + 1] === null || Utilities.getColor(board[y - 2][x + 1]) !== color))
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - 2][x + 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                return true;
            }
        }
    }
    if ((y <= 6 && x <= 5) && (board[y + 1][x + 2] === null || Utilities.getColor(board[y + 1][x + 2]) !== color))
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 1][x + 2] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                return true;
            }
        }
    }
    if ((y >= 1 && x >= 2) && (board[y - 1][x - 2] === null || Utilities.getColor(board[y - 1][x - 2]) !== color))
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - 1][x - 2] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                return true;
            }
        }
    }
    if ((y >= 1 && x <= 5) && (board[y - 1][x + 2] === null || Utilities.getColor(board[y - 1][x + 2]) !== color))
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - 1][x + 2] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                return true;
            }
        }
    }
    if ((y <= 6 && x >= 2) && (board[y + 1][x - 2] === null || Utilities.getColor(board[y + 1][x - 2]) !== color))
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 1][x - 2] = boardCopy[y][x];
        boardCopy[y][XMLHttpRequestUpload] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                return true;
            }
        }
    }
    return false;
}

function tryBishop(x, y, color)
{
    for (let i = 1; y + i < 8 && x + i < 8; i++)
    {
        if (board[y + i][x + i] === null || Utilities.getColor(board[y + i][x + i]) !== color)
        {
            let boardCopy = Array.from(board, (element) => Array.from(element));
            boardCopy[y + i][x + i] = boardCopy[y][x];
            boardCopy[y][x] = null;
            if (color === 'white')
            {
                if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                {
                    return true;
                }
            }
            else
            {
                if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
                {
                    return true;
                }
            }
        }
        if (board[y+ i][x + 1] !== null)
        {
            break;
        }
    }
    for (let i = 1; y - i >= 0 && x - i >= 0; i++)
    {
        if (board[y - i][x - i] === null || Utilities.getColor(board[y - i][x - i]) !== color)
        {
            let boardCopy = Array.from(board, (element) => Array.from(element));
            boardCopy[y - i][x - i] = boardCopy[y][x];
            boardCopy[y][x] = null;
            if (color === 'white')
            {
                if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                {
                    return true;
                }
            }
            else
            {
                if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
                {
                    return true;
                }
            }
        }
        if (board[y - i][x - i] !== null)
        {
            break;
        }
    }
    for (let i = 1; y + i < 8 && x - i >= 0; i++)
    {
        if (board[y + i][x - i] === null || Utilities.getColor(board[y + i][x - i]) !== color)
        {
            let boardCopy = Array.from(board, (element) => Array.from(element));
            boardCopy[y + i][x - i] = boardCopy[y][x];
            boardCopy[y][x] = null;
            if (color === 'white')
            {
                if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                {
                    return true;
                }
            }
            else
            {
                if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
                {
                    return true;
                }
            }
        }
        if (board[y + i][x - i] === null)
        {
            break;
        }
    }
    for (let i = 1; y - i >= 0 && x + i < 8; i++)
    {
        if (board[y - i][x + i] === null || Utilities.getColor(board[y - i][x + i]) !== color)
        {
            let boardCopy = Array.from(board, (element) => Array.from(element));
            boardCopy[y - i][x + i] = boardCopy[y][x];
            boardCopy[y][x] = null;
            if (color === 'white')
            {
                if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                {
                    return true;
                }
            }
            else
            {
                if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
                {
                    return true;
                }
            }
        }
        if (board[y - i][x - i] !== null)
        {
            break;
        }
    }
    return false;
}

function tryRook(x, y, color)
{
    for (let i = x + 1; i < 8; i++)
    {
        if (board[y][i] !== null)
        {
            if (Utilities.getColor(board[y][i]) !== color)
            {
                let boardCopy = Array.from(board, (element) => Array.from(element));
                boardCopy[y][i] = boardCopy[y][x];
                boardCopy[y][x] = null;
                if (color === 'white')
                {
                    if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        return true;
                    }
                }
                else
                {
                    if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
                    {
                        return true;
                    }
                }
            }
            break;
        }
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y][i] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                return true;
            }
        }
    }
    for (let i = x - 1; i >= 0; i--)
    {
        if (board[y][i] !== null)
        {
            if (Utilities.getColor(board[y][i]) !== color)
            {
                let boardCopy = Array.from(board, (element) => Array.from(element));
                boardCopy[y][i] = boardCopy[y][x];
                boardCopy[y][x] = null;
                if (color === 'white')
                {
                    if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        return true;
                    }
                }
                else
                {
                    if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
                    {
                        return true;
                    }
                }
            }
            break;
        }
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y][i] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                return true;
            }
        }
    }
    for (let i = y + 1; i < 8; i++)
    {
        if (board[i][x] !== null)
        {
            if (Utilities.getColor(board[i][x]) !== color)
            {
                let boardCopy = Array.from(board, (element) => Array.from(element));
                boardCopy[i][x] = boardCopy[y][x];
                boardCopy[y][x] = null;
                if (color === 'white')
                {
                    if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        return true;
                    }
                }
                else
                {
                    if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
                    {
                        return true;
                    }
                }
            }
            break;
        }
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[i][x] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                return true;
            }
        }
    }
    for (let i = y - 1; i >= 0; i--)
    {
        if (board[i][x] !== null)
        {
            if (Utilities.getColor(board[i][x]) !== color)
            {
                let boardCopy = Array.from(board, (element) => Array.from(element));
                boardCopy[i][x] = boardCopy[y][x];
                boardCopy[y][x] = null;
                if (color === 'white')
                {
                    if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        return true;
                    }
                }
                else
                {
                    if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
                    {
                        return true;
                    }
                }
            }
            break;
        }
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[i][x] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                return true;
            }
        }
    }
    return false;
}

function tryKing(x, y, color)
{
    if (y + 1 < 8 && x + 1 < 8 && board[y + 1][x + 1] !== null && Utilities.getColor(board[y + 1][x + 1]) !== color)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 1][x + 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y + 1][whiteKing.x + 1])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y + 1][blackKing.x + 1])
            {
                return true;
            }
        }
    }
    else if (y + 1 < 8 && x + 1 < 8 && board[y + 1][x + 1] === null)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 1][x + 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y + 1][whiteKing.x + 1])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y + 1][blackKing.x + 1])
            {
                return true;
            }
        }
    }
    if (y - 1 >= 0 && x - 1 >= 0 && board[y - 1][x - 1] !== null && Utilities.getColor(board[y - 1][x - 1]) !== color)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - 1][x - 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y - 1][whiteKing.x - 1])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y - 1][blackKing.x - 1])
            {
                return true;
            }
        }
    }
    else if (y - 1 >= 0 && x - 1 >= 0 && board[y - 1][x - 1] === null)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - 1][x - 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y - 1][whiteKing.x - 1])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y - 1][blackKing.x - 1])
            {
                return true;
            }
        }
    }
    if (y - 1 >= 0 && x + 1 < 8 && board[y - 1][x + 1] !== null && Utilities.getColor(board[y - 1][x + 1]) !== color)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - 1][x - 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y - 1][whiteKing.x - 1])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y - 1][blackKing.x - 1])
            {
                return true;
            }
        }
    }
    else if (y - 1 >= 0 && x + 1 < 8 && board[y - 1][x + 1] === null)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - 1][x + 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y - 1][whiteKing.x + 1])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y - 1][blackKing.x + 1])
            {
                return true;
            }
        }
    }
    if (y + 1 < 8 && x - 1 >= 0 && board[y + 1][x - 1] !== null && Utilities.getColor(board[y + 1][x - 1]) !== color)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 1][x - 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y + 1][whiteKing.x - 1])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y + 1][blackKing.x - 1])
            {
                return true;
            }
        }
    }
    else if (y + 1 < 8 && x - 1 >= 0 && board[y + 1][x - 1] === null)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 1][x - 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y + 1][whiteKing.x - 1])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y + 1][blackKing.x - 1])
            {
                return true;
            }
        }
    }
    if (y + 1 < 8 && board[y + 1][x] !== null && Utilities.getColor(board[y + 1][x]) !== color)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 1][x] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y + 1][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y + 1][blackKing.x])
            {
                return true;
            }
        }
    }
    else if (y + 1 < 8 && board[y + 1][x] === null)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 1][x] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y + 1][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y + 1][blackKing.x])
            {
                return true;
            }
        }
    }
    if (y - 1 >= 0 && board[y - 1][x] !== null && Utilities.getColor(board[y - 1][x]) !== color)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - 1][x] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y - 1][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y - 1][blackKing.x])
            {
                return true;
            }
        }
    }
    else if (y - 1 >= 0 && board[y - 1][x] === null)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - 1][x] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y - 1][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y - 1][blackKing.x])
            {
                return true;
            }
        }
    }
    if (x + 1 < 8 && board[y][x + 1] !== null && Utilities.getColor(board[y][x + 1]) !== color)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y][x + 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x + 1])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x + 1])
            {
                return true;
            }
        }
    }
    else if (x + 1 < 8 && board[y][x + 1] === null)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y][x + 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x + 1])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x + 1])
            {
                return true;
            }
        }
    }
    if (x - 1 >= 0 && board[y][x - 1] !== null && Utilities.getColor(board[y][x - 1]) !== color)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y][x - 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x - 1])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x - 1])
            {
                return true;
            }
        }
    }
    else if (x - 1 >= 0 && board[y][x - 1] === null)
    {
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y][x - 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (!Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x - 1])
            {
                return true;
            }
        }
        else
        {
            if (!Control.updateWhite(boardCopy)[blackKing.y][blackKing.x - 1])
            {
                return true;
            }
        }
    }
    return false;
}