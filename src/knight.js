import { blackKing, whiteKing, epMove, data, shownLocations, shownPiece, g, board, updateControls } from './index.js';
import { render } from './renderer.js';
import * as Control from './control.js';
import * as Utilities from './utility.js';

export function showKnight(x, y, color)
{
    if ((y <= 5 && x <= 6) && (board[y + 2][x + 1] === null || Utilities.getColor(board[y + 2][x + 1]) !== color))
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 2][x + 1] = boardCopy[y][x];
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
            let behavior = (e) => {
                let capture = false;
                shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
                shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
                for (let i = 0; i < shownLocations.length;)
                {
                    g.removeChild(shownLocations.shift());
                }
                if (board[y + 2][x + 1] !== null)
                {
                    capture = true;
                    g.removeChild(board[y + 2][x + 1]);
                }
                board[y + 2][x + 1] = board[y][x];
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
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y + 2));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y + 2));
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
            };
            shownLocations.push(render('moveLocation', x + 1, y + 2, behavior));
        }
    }
    if ((y >= 2 && x >= 1) && (board[y - 2][x - 1] === null || Utilities.getColor(board[y - 2][x - 1]) !== color))
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - 2][x - 1] = boardCopy[y][x];
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
            let behavior = (e) => {
                let capture = false;
                shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
                shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
                for (let i = 0; i < shownLocations.length;)
                {
                    g.removeChild(shownLocations.shift());
                }
                if (board[y - 2][x - 1] !== null)
                {
                    capture = true;
                    g.removeChild(board[y - 2][x - 1]);
                }
                board[y - 2][x - 1] = board[y][x];
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
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y - 2));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y - 2));
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
            };
            shownLocations.push(render('moveLocation', x - 1, y - 2, behavior));
        }
    }
    if ((y <= 5 && x >= 1) && (board[y + 2][x - 1] === null || Utilities.getColor(board[y + 2][x - 1]) !== color))
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 2][x - 1] = boardCopy[y][x];
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
            let behavior = (e) => {
                let capture = false;
                shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
                shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
                for (let i = 0; i < shownLocations.length;)
                {
                    g.removeChild(shownLocations.shift());
                }
                if (board[y + 2][x - 1] !== null)
                {
                    capture = true;
                    g.removeChild(board[y + 2][x - 1]);
                }
                board[y + 2][x - 1] = board[y][x];
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
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y + 2));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y + 2));
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
            };
            shownLocations.push(render('moveLocation', x - 1, y + 2, behavior));
        }
    }
    if ((y >= 2 && x <= 6) && (board[y - 2][x + 1] === null || Utilities.getColor(board[y - 2][x + 1]) !== color))
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - 2][x + 1] = boardCopy[y][x];
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
            let behavior = (e) => {
                let capture = false;
                shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
                shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
                for (let i = 0; i < shownLocations.length;)
                {
                    g.removeChild(shownLocations.shift());
                }
                if (board[y - 2][x + 1] !== null)
                {
                    capture = true;
                    g.removeChild(board[y - 2][x + 1]);
                }
                board[y - 2][x + 1] = board[y][x];
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
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y - 2));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y - 2));
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
            };
            shownLocations.push(render('moveLocation', x + 1, y - 2, behavior));
        }
    }
    if ((y <= 6 && x <=5) && (board[y + 1][x + 2] === null || Utilities.getColor(board[y + 1][x + 2]) !== color))
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 1][x + 2] = boardCopy[y][x];
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
            let behavior = (e) => {
                let capture = false;
                shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
                shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
                for (let i = 0; i < shownLocations.length;)
                {
                    g.removeChild(shownLocations.shift());
                }
                if (board[y + 1][x + 2] !== null)
                {
                    capture = true;
                    g.removeChild(board[y + 1][x + 2]);
                }
                board[y + 1][x + 2] = board[y][x];
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
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x + 2) + String(8 - (y + 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x + 2) + String(8 - (y + 1));
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
            };
            shownLocations.push(render('moveLocation', x + 2, y + 1, behavior));
        }
    }
    if ((y >= 1 && x >= 2) && (board[y - 1][x - 2] === null || Utilities.getColor(board[y - 1][x - 2]) !== color))
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - 1][x - 2] = boardCopy[y][x];
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
            let behavior = (e) => {
                let capture = false;
                shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
                shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
                for (let i = 0; i < shownLocations.length;)
                {
                    g.removeChild(shownLocations.shift());
                }
                if (board[y - 1][x - 2] !== null)
                {
                    capture = true;
                    g.removeChild(board[y - 1][x - 2]);
                }
                board[y - 1][x - 2] = board[y][x];
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
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x - 2) + String(8 - (y - 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x - 2) + String(8 - (y - 1));
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
            };
            shownLocations.push(render('moveLocation', x - 2, y - 1, behavior));
        }
    }
    if ((y >= 1 && x <= 5) && (board[y - 1][x + 2] === null || Utilities.getColor(board[y - 1][x + 2]) !== color))
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - 1][x + 2] = boardCopy[y][x];
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
            let behavior = (e) => {
                let capture = false;
                shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
                shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
                for (let i = 0; i < shownLocations.length;)
                {
                    g.removeChild(shownLocations.shift());
                }
                if (board[y - 1][x + 2] !== null)
                {
                    capture = true;
                    g.removeChild(board[y - 1][x + 2]);
                }
                board[y - 1][x + 2] = board[y][x];
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
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x + 2) + String(8 - (y - 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x + 2) + String(8 - (y - 1));
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
            };
            shownLocations.push(render('moveLocation', x + 2, y - 1, behavior));
        }
    }
    if ((y <= 6 && x >= 2) && (board[y + 1][x - 2] === null || Utilities.getColor(board[y + 1][x - 2]) !== color))
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 1][x - 2] = boardCopy[y][x];
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
            let behavior = (e) => {
                let capture = false;
                shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
                shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
                for (let i = 0; i < shownLocations.length;)
                {
                    g.removeChild(shownLocations.shift());
                }
                if (board[y + 1][x - 2] !== null)
                {
                    capture = true;
                    g.removeChild(board[y + 1][x - 2]);
                }
                board[y + 1][x - 2] = board[y][x];
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
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x - 2) + String(8 - (y + 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x - 2) + String(8 - (y + 1));
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
            };
            shownLocations.push(render('moveLocation', x - 2, y + 1, behavior));
        }
    }
}