import { blackKing, whiteKing, epMove, data, shownLocations, shownPiece, g, board, updateControls } from './index.js';
import { render } from './renderer.js';
import * as Control from './control.js';
import * as Utilities from './utility.js';

export function showBishop(x, y, color, queen)
{
    for (let i = 1; y + i < 8 && x + i < 8; i++)
    {
        let behavior = (e) => {
            let capture = false;
            shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
            shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
            for (let i = 0; i < shownLocations.length;)
            {
                g.removeChild(shownLocations.shift());
            }
            if (board[y + i][x + i] !== null)
            {
                capture = true;
                g.removeChild(board[y + i][x + i]);
            }
            board[y + i][x + i] = board[y][x];
            board[y][x] = null;
            data.moveColor = data.moveColor === 'white' ? 'black' : 'white';
            epMove.x = -1;
            epMove.y = -1;
            updateControls();
            if (data.prevTR === null)
            {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.textContent = ++data.moveCount;
                tr.appendChild(td);
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'B') + (capture ? 'x' : '') + Utilities.getFile(x + i) + String(8 - (y + i));
                tr.appendChild(td);
                document.getElementById('moveHistory').appendChild(tr);
                data.prevTR = tr;
            }
            else
            {
                let td = document.createElement('td');
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'B') + (capture ? 'x' : '') + Utilities.getFile(x + i) + String(8 - (y + i));
                data.prevTR.appendChild(td);
                document.getElementById('moveHistory').appendChild(data.prevTR);
                data.prevTR = null;
            }
        };
        if (board[y + i][x + i] !== null)
        {
            if (Utilities.getColor(board[y + i][x + i]) !== color)
            {
                let skip = false;
                let boardCopy = Array.from(board, (element) => Array.from(element));
                boardCopy[y + i][x + i] = boardCopy[y][x];
                boardCopy[y][x] = null;
                if (color === 'white')
                {
                    if (Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        skip = true;
                    }
                }
                else
                {
                    if (Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
                    {
                        skip = true;
                    }
                }
                if (!skip)
                {
                    shownLocations.push(render('moveLocation', x + i, y + i, behavior));
                }
            }
            break;
        }
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + i][x + i] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                skip = true;
            }
        }
        if (!skip)
        {
            shownLocations.push(render('moveLocation', x + i, y + i, behavior));
        }
    }
    for (let i = 1; y - i >= 0 && x - i >= 0; i++)
    {
        let behavior = (e) => {
            let capture = false;
            shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
            shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
            for (let i = 0; i < shownLocations.length;)
            {
                g.removeChild(shownLocations.shift());
            }
            if (board[y - i][x - i] !== null)
            {
                capture = true;
                g.removeChild(board[y - i][x - i]);
            }
            board[y - i][x - i] = board[y][x];
            board[y][x] = null;
            data.moveColor = data.moveColor === 'white' ? 'black' : 'white';
            epMove.x = -1;
            epMove.y = -1;
            updateControls();
            if (data.prevTR === null)
            {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.textContent = ++data.moveCount;
                tr.appendChild(td);
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'B') + (capture ? 'x' : '') + Utilities.getFile(x - i) + String(8 - (y - i));
                tr.appendChild(td);
                document.getElementById('moveHistory').appendChild(tr);
                data.prevTR = tr;
            }
            else
            {
                let td = document.createElement('td');
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'B') + (capture ? 'x' : '') + Utilities.getFile(x - i) + String(8 - (y - i));
                data.prevTR.appendChild(td);
                document.getElementById('moveHistory').appendChild(data.prevTR);
                data.prevTR = null;
            }
        };
        if (board[y - i][x - i] !== null)
        {
            if (Utilities.getColor(board[y - i][x - i]) !== color)
            {
                let skip = false;
                let boardCopy = Array.from(board, (element) => Array.from(element));
                boardCopy[y - i][x - i] = boardCopy[y][x];
                boardCopy[y][x] = null;
                if (color === 'white')
                {
                    if (Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        skip = true;
                    }
                }
                else
                {
                    if (Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
                    {
                        skip = true;
                    }
                }
                if (!skip)
                {
                    shownLocations.push(render('moveLocation', x - i, y - i, behavior));
                }
            }
            break;
        }
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - i][x - i] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                skip = true;
            }
        }
        if (!skip)
        {
            shownLocations.push(render('moveLocation', x - i, y - i, behavior));
        }
    }
    for (let i = 1; y + i < 8 && x - i >= 0; i++)
    {
        let behavior = (e) => {
            let capture = false;
            shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
            shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
            for (let i = 0; i < shownLocations.length;)
            {
                g.removeChild(shownLocations.shift());
            }
            if (board[y + i][x - i] !== null)
            {
                capture = true;
                g.removeChild(board[y + i][x - i]);
            }
            board[y + i][x - i] = board[y][x];
            board[y][x] = null;
            data.moveColor = data.moveColor === 'white' ? 'black' : 'white';
            epMove.x = -1;
            epMove.y = -1;
            updateControls();
            if (data.prevTR === null)
            {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.textContent = ++data.moveCount;
                tr.appendChild(td);
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'B') + (capture ? 'x' : '') + Utilities.getFile(x - i) + String(8 - (y + i));
                tr.appendChild(td);
                document.getElementById('moveHistory').appendChild(tr);
                data.prevTR = tr;
            }
            else
            {
                let td = document.createElement('td');
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'B') + (capture ? 'x' : '') + Utilities.getFile(x - i) + String(8 - (y + i));
                data.prevTR.appendChild(td);
                document.getElementById('moveHistory').appendChild(data.prevTR);
                data.prevTR = null;
            }
        }
        if (board[y + i][x - i] !== null)
        {
            if (Utilities.getColor(board[y + i][x - i]) !== color)
            {
                let skip = false;
                let boardCopy = Array.from(board, (element) => Array.from(element));
                boardCopy[y + i][x - i] = boardCopy[y][x];
                boardCopy[y][x] = null;
                if (color === 'white')
                {
                    if (Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        skip = true;
                    }
                }
                else
                {
                    if (Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
                    {
                        skip = true;
                    }
                }
                if (!skip)
                {
                    shownLocations.push(render('moveLocation', x - i, y + i, behavior));
                }
            }
            break;
        }
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + i][x - i] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                skip = true;
            }
        }
        if (!skip)
        {
            shownLocations.push(render('moveLocation', x - i, y + i, behavior));
        }
    }
    for (let i = 1; y - i >= 0 && x + i < 8; i++)
    {
        let behavior = (e) => {
            let capture = false;
            shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
            shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
            for (let i = 0; i < shownLocations.length;)
            {
                g.removeChild(shownLocations.shift());
            }
            if (board[y - i][x + i] !== null)
            {
                capture = true;
                g.removeChild(board[y - i][x + i]);
            }
            board[y - i][x + i] = board[y][x];
            board[y][x] = null;
            data.moveColor = data.moveColor === 'white' ? 'black' : 'white';
            epMove.x = -1;
            epMove.y = -1;
            updateControls();
            if (data.prevTR === null)
            {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.textContent = ++data.moveCount;
                tr.appendChild(td);
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'B') + (capture ? 'x' : '') + Utilities.getFile(x + i) + String(8 - (y - i));
                tr.appendChild(td);
                document.getElementById('moveHistory').appendChild(tr);
                data.prevTR = tr;
            }
            else
            {
                let td = document.createElement('td');
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'B') + (capture ? 'x' : '') + Utilities.getFile(x + i) + String(8 - (y - i));
                data.prevTR.appendChild(td);
                document.getElementById('moveHistory').appendChild(data.prevTR);
                data.prevTR = null;
            }
        };
        if (board[y - i][x + i] !== null)
        {
            if (Utilities.getColor(board[y - i][x + i]) !== color)
            {
                let skip = false;
                let boardCopy = Array.from(board, (element) => Array.from(element));
                boardCopy[y - i][x + i] = boardCopy[y][x];
                boardCopy[y][x] = null;
                if (color === 'white')
                {
                    if (Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        skip = true;
                    }
                }
                else
                {
                    if (Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
                    {
                        skip = true;
                    }
                }
                if (!skip)
                {
                    shownLocations.push(render('moveLocation', x + i, y - i, behavior));
                }
            }
            break;
        }
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - i][x + i] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (Control.updateWhite(boardCopy)[blackKing.y][blackKing.x])
            {
                skip = true;
            }
        }
        if (!skip)
        {
            shownLocations.push(render('moveLocation', x + i, y - i, behavior));
        }
    }
}