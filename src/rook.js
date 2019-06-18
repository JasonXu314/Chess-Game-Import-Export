import { blackKing, whiteKing, epMove, data, shownLocations, shownPiece, g, board, updateControls, rookMoved } from './index.js';
import { render } from './renderer.js';
import * as Control from './control.js';
import * as Utilities from './utility.js';

export function showRook(x, y, color, queen)
{
    for (let i = x + 1; i < 8; i++)
    {
        let behavior = (e) => {
            let capture = false;
            shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
            shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
            for (let i = 0; i < shownLocations.length;)
            {
                g.removeChild(shownLocations.shift());
            }
            if (board[y][i] !== null)
            {
                capture = true;
                g.removeChild(board[y][i]);
            }
            board[y][i] = board[y][x];
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
                td.textContent = (queen ? 'Q' : 'R') + (capture ? 'x' : '') + Utilities.getFile(i) + String(8 - y);
                tr.appendChild(td);
                document.getElementById('moveHistory').appendChild(tr);
                data.prevTR = tr;
            }
            else
            {
                let td = document.createElement('td');
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'R') + (capture ? 'x' : '') + Utilities.getFile(i) + String(8 - y);
                data.prevTR.appendChild(td);
                document.getElementById('moveHistory').appendChild(data.prevTR);
                data.prevTR = null;
            }
            if (color === 'white')
            {
                if (x === 0)
                {
                    rookMoved.wLeft = true;
                }
                else
                {
                    rookMoved.wRight = true;
                }
            }
            else
            {
                if (x === 0)
                {
                    rookMoved.bLeft = true;
                }
                else
                {
                    rookMoved.bRight = true;
                }
            }
        };
        if (board[y][i] !== null)
        {
            if (Utilities.getColor(board[y][i]) !== color)
            {
                let skip = false;
                let boardCopy = Array.from(board, (element) => Array.from(element));
                boardCopy[y][i] = boardCopy[y][x];
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
                    shownLocations.push(render('moveLocation', i, y, behavior));
                }
            }
            break;
        }
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y][i] = boardCopy[y][x];
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
            shownLocations.push(render('moveLocation', i, y, behavior));
        }
    }
    for (let i = x - 1; i >= 0; i--)
    {
        let behavior = (e) => {
            let capture = false;
            shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
            shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
            for (let i = 0; i < shownLocations.length;)
            {
                g.removeChild(shownLocations.shift());
            }
            if (board[y][i] !== null)
            {
                capture = true;
                g.removeChild(board[y][i]);
            }
            board[y][i] = board[y][x];
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
                td.textContent = (queen ? 'Q' : 'R') + (capture ? 'x' : '') + Utilities.getFile(i) + String(8 - y);
                tr.appendChild(td);
                document.getElementById('moveHistory').appendChild(tr);
                data.prevTR = tr;
            }
            else
            {
                let td = document.createElement('td');
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'R') + (capture ? 'x' : '') + Utilities.getFile(i) + String(8 - y);
                data.prevTR.appendChild(td);
                document.getElementById('moveHistory').appendChild(data.prevTR);
                data.prevTR = null;
            }
            if (color === 'white')
            {
                if (x === 0)
                {
                    rookMoved.wLeft = true;
                }
                else
                {
                    rookMoved.wRight = true;
                }
            }
            else
            {
                if (x === 0)
                {
                    rookMoved.bLeft = true;
                }
                else
                {
                    rookMoved.bRight = true;
                }
            }
        };
        if (board[y][i] !== null)
        {
            if (Utilities.getColor(board[y][i]) !== color)
            {
                let skip = false;
                let boardCopy = Array.from(board, (element) => Array.from(element));
                boardCopy[y][i] = boardCopy[y][x];
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
                    shownLocations.push(render('moveLocation', i, y, behavior));
                }
            }
            break;
        }
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y][i] = boardCopy[y][x];
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
            shownLocations.push(render('moveLocation', i, y, behavior));
        }
    }
    for (let i = y + 1; i < 8; i++)
    {
        let behavior = (e) => {
            let capture = false;
            shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
            shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
            for (let i = 0; i < shownLocations.length;)
            {
                g.removeChild(shownLocations.shift());
            }
            if (board[i][x] !== null)
            {
                capture = true;
                g.removeChild(board[i][x]);
            }
            board[i][x] = board[y][x];
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
                td.textContent = (queen ? 'Q' : 'R') + (capture ? 'x' : '') + Utilities.getFile(x) + String(8 - i);
                tr.appendChild(td);
                document.getElementById('moveHistory').appendChild(tr);
                data.prevTR = tr;
            }
            else
            {
                let td = document.createElement('td');
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'R') + (capture ? 'x' : '') + Utilities.getFile(x) + String(8 - i);
                data.prevTR.appendChild(td);
                document.getElementById('moveHistory').appendChild(data.prevTR);
                data.prevTR = null;
            }
            if (color === 'white')
            {
                if (x === 0)
                {
                    rookMoved.wLeft = true;
                }
                else
                {
                    rookMoved.wRight = true;
                }
            }
            else
            {
                if (x === 0)
                {
                    rookMoved.bLeft = true;
                }
                else
                {
                    rookMoved.bRight = true;
                }
            }
        };
        if (board[i][x] !== null)
        {
            if (Utilities.getColor(board[i][x]) !== color)
            {
                let skip = false;
                let boardCopy = Array.from(board, (element) => Array.from(element));
                boardCopy[i][x] = boardCopy[y][x];
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
                    shownLocations.push(render('moveLocation', x, i, behavior));
                }
            }
            break;
        }
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[i][x] = boardCopy[y][x];
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
            shownLocations.push(render('moveLocation', x, i, behavior));
        }
    }
    for (let i = y - 1; i >= 0; i--)
    {
        let behavior = (e) => {
            let capture = false;
            shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
            shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
            for (let i = 0; i < shownLocations.length;)
            {
                g.removeChild(shownLocations.shift());
            }
            if (board[i][x] !== null)
            {
                capture = true;
                g.removeChild(board[i][x]);
            }
            board[i][x] = board[y][x];
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
                td.textContent = (queen ? 'Q' : 'R') + (capture ? 'x' : '') + Utilities.getFile(x) + String(8 - i);
                tr.appendChild(td);
                document.getElementById('moveHistory').appendChild(tr);
                data.prevTR = tr;
            }
            else
            {
                let td = document.createElement('td');
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'R') + (capture ? 'x' : '') + Utilities.getFile(x) + String(8 - i);
                data.prevTR.appendChild(td);
                document.getElementById('moveHistory').appendChild(data.prevTR);
                data.prevTR = null;
            }
            if (color === 'white')
            {
                if (x === 0)
                {
                    rookMoved.wLeft = true;
                }
                else
                {
                    rookMoved.wRight = true;
                }
            }
            else
            {
                if (x === 0)
                {
                    rookMoved.bLeft = true;
                }
                else
                {
                    rookMoved.bRight = true;
                }
            }
        };
        if (board[i][x] !== null)
        {
            if (Utilities.getColor(board[i][x]) !== color)
            {
                let skip = false;
                let boardCopy = Array.from(board, (element) => Array.from(element));
                boardCopy[i][x] = boardCopy[y][x];
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
                    shownLocations.push(render('moveLocation', x, i, behavior));
                }
            }
            break;
        }
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[i][x] = boardCopy[y][x];
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
            shownLocations.push(render('moveLocation', x, i, behavior));
        }
    }
}