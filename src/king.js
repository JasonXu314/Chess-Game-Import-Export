import { blackKing, whiteKing, epMove, data, shownLocations, shownPiece, g, board, updateControls, kingMoved, rookMoved } from './index.js';
import { render } from './renderer.js';
import * as Control from './control.js';
import * as Utilities from './utility.js';

export function showKing(x, y, color)
{
    if (y + 1 < 8 && x + 1 < 8 && ((board[y + 1][x + 1] !== null && Utilities.getColor(board[y + 1][x + 1]) !== color) || board[y + 1][x + 1] === null))
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 1][x + 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (Control.updateBlack(boardCopy)[whiteKing.y + 1][whiteKing.x + 1])
            {
                skip = true;
            }
        }
        else
        {
            if (Control.updateWhite(boardCopy)[blackKing.y + 1][blackKing.x + 1])
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
                if (board[y + 1][x + 1] !== null)
                {
                    capture = true;
                    g.removeChild(board[y + 1][x + 1]);
                }
                board[y + 1][x + 1] = board[y][x];
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
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y + 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y + 1));
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
                if (color === 'white')
                {
                    kingMoved.white = true;
                    whiteKing.x = x + 1;
                    whiteKing.y = y + 1;
                }
                else
                {
                    kingMoved.black = true;
                    blackKing.x = x + 1;
                    blackKing.y = y + 1;
                }
            };
            shownLocations.push(render('moveLocation', x + 1, y + 1, behavior));
        }
    }
    if (y - 1 >= 0 && x - 1 >= 0 && ((board[y - 1][x - 1] !== null && Utilities.getColor(board[y - 1][x - 1]) !== color) || board[y - 1][x - 1] === null))
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - 1][x - 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (Control.updateBlack(boardCopy)[whiteKing.y - 1][whiteKing.x - 1])
            {
                skip = true;
            }
        }
        else
        {
            if (Control.updateWhite(boardCopy)[blackKing.y - 1][blackKing.x - 1])
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
                if (board[y - 1][x - 1] !== null)
                {
                    capture = true;
                    g.removeChild(board[y - 1][x - 1]);
                }
                board[y - 1][x - 1] = board[y][x];
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
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y - 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y - 1));
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
                if (color === 'white')
                {
                    kingMoved.white = true;
                    whiteKing.x = x - 1;
                    whiteKing.y = y - 1;
                }
                else
                {
                    kingMoved.black = true;
                    blackKing.x = x - 1;
                    blackKing.y = y - 1;
                }
            };
            shownLocations.push(render('moveLocation', x - 1, y - 1, behavior));
        }
    }
    if (y - 1 >= 0 && x + 1 < 8 && ((board[y - 1][x + 1] !== null && Utilities.getColor(board[y - 1][x + 1]) !== color) || board[y - 1][x + 1] === null))
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - 1][x + 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (Control.updateBlack(boardCopy)[whiteKing.y - 1][whiteKing.x - 1])
            {
                skip = true;
            }
        }
        else
        {
            if (Control.updateWhite(boardCopy)[blackKing.y - 1][blackKing.x - 1])
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
                if (board[y - 1][x + 1] !== null)
                {
                    capture = true;
                    g.removeChild(board[y - 1][x + 1]);
                }
                board[y - 1][x + 1] = board[y][x];
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
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y - 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y - 1));
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
                if (color === 'white')
                {
                    kingMoved.white = true;
                    whiteKing.x = x + 1;
                    whiteKing.y = y - 1;
                }
                else
                {
                    kingMoved.black = true;
                    blackKing.x = x + 1;
                    blackKing.y = y - 1;
                }
            };
            shownLocations.push(render('moveLocation', x + 1, y - 1, behavior));
        }
    }
    if (y + 1 < 8 && x - 1 >= 0 && ((board[y + 1][x - 1] !== null && Utilities.getColor(board[y + 1][x - 1]) !== color) || board[y + 1][x - 1] === null))
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 1][x - 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (Control.updateBlack(boardCopy)[whiteKing.y + 1][whiteKing.x - 1])
            {
                skip = true;
            }
        }
        else
        {
            if (Control.updateWhite(boardCopy)[blackKing.y + 1][blackKing.x - 1])
            {
                skip = true;
            }
        }
        if (!skip)
        {
            let behavior = (e) => {
                let capture = true;
                shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
                shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
                for (let i = 0; i < shownLocations.length;)
                {
                    g.removeChild(shownLocations.shift());
                }
                if (board[y + 1][x - 1] !== null)
                {
                    capture = false;
                    g.removeChild(board[y + 1][x - 1]);
                }
                board[y + 1][x - 1] = board[y][x];
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
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y + 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y + 1));
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
                if (color === 'white')
                {
                    kingMoved.white = true;
                    whiteKing.x = x - 1;
                    whiteKing.y = y + 1;
                }
                else
                {
                    kingMoved.black = true;
                    blackKing.x = x - 1;
                    blackKing.y = y + 1;
                }
            };
            shownLocations.push(render('moveLocation', x - 1, y + 1, behavior));
        }
    }
    if (y + 1 < 8 && ((board[y + 1][x] !== null && Utilities.getColor(board[y + 1][x]) !== color) || board[y + 1][x] === null))
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 1][x] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (Control.updateBlack(boardCopy)[whiteKing.y + 1][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (Control.updateWhite(boardCopy)[blackKing.y + 1][blackKing.x])
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
                if (board[y + 1][x] !== null)
                {
                    capture = true;
                    g.removeChild(board[y + 1][x]);
                }
                board[y + 1][x] = board[y][x];
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
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x) + String(8 - (y + 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x) + String(8 - (y + 1));
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
                if (color === 'white')
                {
                    kingMoved.white = true;
                    whiteKing.x = x;
                    whiteKing.y = y + 1;
                }
                else
                {
                    kingMoved.black = true;
                    blackKing.x = x;
                    blackKing.y = y + 1;
                }
            };
            shownLocations.push(render('moveLocation', x, y + 1, behavior));
        }
    }
    if (y - 1 >= 0 && ((board[y - 1][x] !== null && Utilities.getColor(board[y - 1][x]) !== color) || board[y - 1][x] === null))
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y - 1][x] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (Control.updateBlack(boardCopy)[whiteKing.y - 1][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (Control.updateWhite(boardCopy)[blackKing.y - 1][blackKing.x])
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
                if (board[y - 1][x] !== null)
                {
                    capture = true;
                    g.removeChild(board[y - 1][x]);
                }
                board[y - 1][x] = board[y][x];
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
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x) + String(8 - (y - 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x) + String(8 - (y - 1));
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
                if (color === 'white')
                {
                    kingMoved.white = true;
                    whiteKing.x = x;
                    whiteKing.y = y - 1;
                }
                else
                {
                    kingMoved.black = true;
                    blackKing.x = x;
                    blackKing.y = y - 1;
                }
            };
            shownLocations.push(render('moveLocation', x, y - 1, behavior));
        }
    }
    if (x + 1 < 8 && ((board[y][x + 1] !== null && Utilities.getColor(board[y][x + 1]) !== color) || board[y][x + 1] === null))
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y][x + 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x + 1])
            {
                skip = true;
            }
        }
        else
        {
            if (Control.updateWhite(boardCopy)[blackKing.y][blackKing.x + 1])
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
                if (board[y][x + 1] !== null)
                {
                    capture = true;
                    g.removeChild(board[y][x + 1]);
                }
                board[y][x + 1] = board[y][x];
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
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y));
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
                if (color === 'white')
                {
                    kingMoved.white = true;
                    whiteKing.x = x + 1;
                    whiteKing.y = y;
                }
                else
                {
                    kingMoved.black = true;
                    blackKing.x = x + 1;
                    blackKing.y = y;
                }
            };
            shownLocations.push(render('moveLocation', x + 1, y, behavior));
        }
    }
    if (x - 1 >= 0 && ((board[y][x - 1] !== null && Utilities.getColor(board[y][x - 1]) !== color) || board[y][x - 1] === null))
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y][x - 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (Control.updateBlack(boardCopy)[whiteKing.y][whiteKing.x - 1])
            {
                skip = true;
            }
        }
        else
        {
            if (Control.updateWhite(boardCopy)[blackKing.y][blackKing.x - 1])
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
                if (board[y][x - 1] !== null)
                {
                    capture = true;
                    g.removeChild(board[y][x - 1]);
                }
                board[y][x - 1] = board[y][x];
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
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y));
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
                if (color === 'white')
                {
                    kingMoved.white = true;
                    whiteKing.x = x - 1;
                    whiteKing.y = y;
                }
                else
                {
                    kingMoved.black = true;
                    blackKing.x = x - 1;
                    blackKing.y = y;
                }
            };
            shownLocations.push(render('moveLocation', x - 1, y, behavior));
        }
    }
    let moved = color === 'white' ? kingMoved.white : kingMoved.black;
    if (!moved && !data.inCheck)
    {
        moved = color === 'white' ? rookMoved.wLeft : rookMoved.bLeft;
        if (!moved && board[color === 'white' ? 7 : 0][1] === null && board[color === 'white' ? 7 : 0][2] === null && board[color === 'white' ? 7 : 0][3] === null)
        {
            let behavior = (e) => {
                shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
                shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
                for (let i = 0; i < shownLocations.length;)
                {
                    g.removeChild(shownLocations.shift());
                }
                let rook = board[color === 'white' ? 7 : 0][0];
                rook.setAttribute('x', (x - 1) * 50);
                board[y][x - 2] = board[y][x];
                board[y][x - 1] = rook;
                board[y][x] = null;
                board[color === 'white' ? 7 : 0][0] = null;
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
                    td.textContent = 'O-O-O';
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'O-O-O';
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
                if (color === 'white')
                {
                    kingMoved.white = true;
                    whiteKing.x = x - 2;
                    whiteKing.y = y;
                    rookMoved.wLeft = true;
                }
                else
                {
                    kingMoved.black = true;
                    blackKing.x = x - 2;
                    blackKing.y = y;
                    rookMoved.bLeft = true;
                }
            };
            shownLocations.push(render('moveLocation', x - 2, y, behavior));
        }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
        moved = (color === 'white' ? rookMoved.wRight : rookMoved.bRight) || (color === 'white' ? kingMoved.white : kingMoved.black);
        if (!moved && board[color === 'white' ? 7 : 0][5] === null && board[color === 'white' ? 7 : 0][6] === null)
        {
            let behavior = (e) => {
                shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);x
                shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
                for (let i = 0; i < shownLocations.length;)
                {
                    g.removeChild(shownLocations.shift());
                }
                let rook = board[color === 'white' ? 7 : 0][7];
                rook.setAttribute('x', (x + 1) * 50);
                board[y][x + 2] = board[y][x];
                board[y][x + 1] = rook;
                board[y][x] = null;
                board[color === 'white' ? 7 : 0][7] = null;
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
                    td.textContent = 'O-O';
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'O-O';
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
                if (color === 'white')
                {
                    kingMoved.white = true;
                    whiteKing.x = x + 2;
                    whiteKing.y = y;
                    rookMoved.wRight = true;
                }
                else
                {
                    kingMoved.black = true;
                    blackKing.x = x + 2;
                    blackKing.y = y;
                    rookMoved.bRight = true;
                }
            };
            shownLocations.push(render('moveLocation', x + 2, y, behavior));
        }
    }
}