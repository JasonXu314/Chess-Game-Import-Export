import { blackKing, whiteKing, epMove, data, shownLocations, shownPiece, g, board, updateControls, pieceBehavior } from './index.js';
import { render } from './renderer.js';
import * as Control from './control.js';
import * as Utilities from './utility.js';

export function showPawn(x, y, color)
{
    let up = color === 'white';
    if (board[up ? y - 1 : y + 1][x] === null)
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[up ? y - 1 : y + 1][x] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (up)
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
            if (y === (up ? 1 : 6))
            {
                let behavior = (e) => {
                    for (let i = 0; i < shownLocations.length;)
                    {
                        g.removeChild(shownLocations.shift());
                    }
                    g.removeChild(board[y][x]);
                    board[y][x] = null;
                    board[up? y - 1 : y + 1][x] = render(up ? 'Queen_White.png' : 'Queen_Black.png', x, up ? y - 1 : y + 1, pieceBehavior);
                    data.moveColor = (data.moveColor === 'white' ? 'black' : 'white');
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
                        td.textContent = Utilities.getFile(x) + String(8 - (y - 1)) + '=Q';
                        tr.appendChild(td);
                        document.getElementById('moveHistory').appendChild(tr);
                        data.prevTR = tr;
                    }
                    else
                    {
                        let td = document.createElement('td');
                        td = document.createElement('td');
                        td.textContent = Utilities.getFile(x) + String(8 - (y + 1)) + '=Q';
                        data.prevTR.appendChild(td);
                        document.getElementById('moveHistory').appendChild(data.prevTR);
                        data.prevTR = null;
                    }
                };
                shownLocations.push(render('moveLocation', x, y, behavior));
            }
            else
            {
                let behavior = (e) => {
                    shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
                    shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
                    for (let i = 0; i < shownLocations.length;)
                    {
                        g.removeChild(shownLocations.shift());
                    }
                    board[up ? y - 1 : y + 1][x] = board[y][x];
                    board[y][x] = null;
                    data.moveColor = (data.moveColor === 'white' ? 'black' : 'white');
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
                        td.textContent = Utilities.getFile(x) + String(8 - (y - 1));
                        tr.appendChild(td);
                        document.getElementById('moveHistory').appendChild(tr);
                        data.prevTR = tr;
                    }
                    else
                    {
                        let td = document.createElement('td');
                        td = document.createElement('td');
                        td.textContent = Utilities.getFile(x) + String(8 - (y + 1));
                        data.prevTR.appendChild(td);
                        document.getElementById('moveHistory').appendChild(data.prevTR);
                        data.prevTR = null;
                    }
                };
                shownLocations.push(render('moveLocation', x, up ? y - 1 : y + 1, behavior));
            }
        }
        if (y === up ? 6 : 1)
        {
            skip = false;
            boardCopy = Array.from(board, (element) => Array.from(element));
            boardCopy[up ? y - 2 : y + 2][x] = boardCopy[y][x];
            boardCopy[y][x] = null;
            if (up)
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
                if (y === (up ? 6 : 1) && board[up ? y - 2 : y + 2][x] === null)
                {
                    let behavior = (e) => {
                        shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
                        shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
                        for (let i = 0; i < shownLocations.length;)
                        {
                            g.removeChild(shownLocations.shift());
                        }
                        board[up ? y - 2 : y + 2][x] = board[y][x];
                        board[y][x] = null;
                        data.moveColor = (data.moveColor === 'white' ? 'black' : 'white');
                        epMove.x = x;
                        epMove.y = up ? y - 2 : y + 2;
                        updateControls();
                        if (data.prevTR === null)
                        {
                            let tr = document.createElement('tr');
                            let td = document.createElement('td');
                            td.textContent = ++data.moveCount;
                            tr.appendChild(td);
                            td = document.createElement('td');
                            td.textContent = Utilities.getFile(x) + String(8 - (y - 2));
                            tr.appendChild(td);
                            document.getElementById('moveHistory').appendChild(tr);
                            data.prevTR = tr;
                        }
                        else
                        {
                            let td = document.createElement('td');
                            td = document.createElement('td');
                            td.textContent = Utilities.getFile(x) + String(8 - (y + 2));
                            data.prevTR.appendChild(td);
                            document.getElementById('moveHistory').appendChild(data.prevTR);
                            data.prevTR = null;
                        }
                    }
                    shownLocations.push(render('moveLocation', x, up ? y - 2 : y + 2, behavior));
                }
            }
        }
    }
    if (x + 1 < 8 && board[up ? y - 1 : y + 1][x + 1] !== null && Utilities.getColor(board[up ? y - 1 : y + 1][x + 1]) !== color)
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[up ? y - 1 : y + 1][x + 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (up)
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
            if (y === (up ? 1 : 6))
            {
                let behavior = (e) => {
                    for (let i = 0; i < shownLocations.length;)
                    {
                        g.removeChild(shownLocations.shift());
                    }
                    g.removeChild(board[y][x]);
                    board[y][x] = null;
                    let newPiece = render(up ? 'Queen_White.png' : 'Queen_Black.png', x + 1, up ? y - 1 : y + 1, pieceBehavior);
                    g.appendChild(newPiece);
                    g.removeChild(board[up? y - 1 : y + 1][x + 1]);
                    board[up? y - 1 : y + 1][x + 1] = newPiece;
                    data.moveColor = (data.moveColor === 'white' ? 'black' : 'white');
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
                        td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x + 1) +  String(8 - (y - 1) + '=Q');
                        tr.appendChild(td);
                        document.getElementById('moveHistory').appendChild(tr);
                        data.prevTR = tr;
                    }
                    else
                    {
                        let td = document.createElement('td');
                        td = document.createElement('td');
                        td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x + 1) + String(8 - (y + 1) + '=Q');
                        data.prevTR.appendChild(td);
                        document.getElementById('moveHistory').appendChild(data.prevTR);
                        data.prevTR = null;
                    }
                }
                shownLocations.push(render('moveLocation', x + 1, up ? y - 1 : y + 1, behavior));
            }
            else
            {
                let behavior = (e) => {
                    shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
                    shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
                    for (let i = 0; i < shownLocations.length;)
                    {
                        g.removeChild(shownLocations.shift());
                    }
                    let removeLocation = board[up ? y - 1 : y + 1][x + 1];
                    g.removeChild(removeLocation);
                    board[up ? y - 1 : y + 1][x + 1] = null;
                    board[up ? y - 1 : y + 1][x + 1] = board[y][x];
                    board[y][x] = null;
                    data.moveColor = (data.moveColor === 'white' ? 'black' : 'white');
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
                        td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x + 1) + String(8 - (y - 1));
                        tr.appendChild(td);
                        document.getElementById('moveHistory').appendChild(tr);
                        data.prevTR = tr;
                    }
                    else
                    {
                        let td = document.createElement('td');
                        td = document.createElement('td');
                        td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x + 1) + String(8 - (y + 1));
                        data.prevTR.appendChild(td);
                        document.getElementById('moveHistory').appendChild(data.prevTR);
                        data.prevTR = null;
                    }
                };
                shownLocations.push(render('moveLocation', x + 1, up ? y - 1 : y + 1, behavior));
            }
        }
    }
    if (x - 1 >= 0 && board[up ? y - 1 : y + 1][x - 1] !== null && Utilities.getColor(board[up ? y - 1 : y + 1][x - 1]) !== color)
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[up ? y - 1 : y + 1][x - 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (up)
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
            if (y === (up ? 1 : 6))
            {
                let behavior = (e) => {
                    for (let i = 0; i < shownLocations.length;)
                    {
                        g.removeChild(shownLocations.shift());
                    }
                    g.removeChild(board[y][x]);
                    board[y][x] = null;
                    let newPiece = render(up ? 'Queen_White.png': 'Queen_Black.png', x - 1, up ? y - 1 : y + 1, pieceBehavior);
                    g.appendChild(newPiece);
                    g.removeChild(board[up ? y - 1 : y + 1][x - 1]);
                    board[up? y - 1 : y + 1][x - 1] = newPiece;
                    data.moveColor = (data.moveColor === 'white' ? 'black' : 'white');
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
                        td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x - 1) + String(8 - (y - 1) + '=Q');
                        tr.appendChild(td);
                        document.getElementById('moveHistory').appendChild(tr);
                        data.prevTR = tr;
                    }
                    else
                    {
                        let td = document.createElement('td');
                        td = document.createElement('td');
                        td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x - 1) + String(8 - (y + 1) + '=Q');
                        data.prevTR.appendChild(td);
                        document.getElementById('moveHistory').appendChild(data.prevTR);
                        data.prevTR = null;
                    }
                };
                shownLocations.push(render('moveLocation', x - 1, up ? y - 1 : y + 1, behavior));
            }
            else
            {
                let behavior = (e) => {
                    shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
                    shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
                    for (let i = 0; i < shownLocations.length;)
                    {
                        g.removeChild(shownLocations.shift());
                    }
                    g.removeChild(board[up ? y - 1 : y + 1][x - 1]);
                    board[up ? y - 1 : y + 1][x - 1] = null;
                    board[up ? y - 1 : y + 1][x - 1] = board[y][x];
                    board[y][x] = null;
                    data.moveColor = (data.moveColor === 'white' ? 'black' : 'white');
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
                        td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x - 1) + String(8 - (y - 1));
                        tr.appendChild(td);
                        document.getElementById('moveHistory').appendChild(tr);
                        data.prevTR = tr;
                    }
                    else
                    {
                        let td = document.createElement('td');
                        td = document.createElement('td');
                        td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x - 1) + String(8 - (y + 1));
                        data.prevTR.appendChild(td);
                        document.getElementById('moveHistory').appendChild(data.prevTR);
                        data.prevTR = null;
                    }
                };
                shownLocations.push(render('moveLocation', x - 1, up ? y - 1 : y + 1, behavior));
            }
        }
    }
    if (epMove.x === x - 1 && epMove.y === y && board[up ? y - 1 : y + 1][x - 1] === null)
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[up ? y - 1 : y + 1][x - 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        boardCopy[y][x - 1] = null;
        if (up)
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
                shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
                shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
                for (let i = 0; i < shownLocations.length;)
                {
                    g.removeChild(shownLocations.shift());
                }
                g.removeChild(board[y][x - 1]);
                board[y][x - 1] = null;
                board[up ? y - 1 : y + 1][x - 1] = board[y][x];
                board[y][x] = null;
                data.moveColor = (data.moveColor === 'white' ? 'black' : 'white');
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
                    td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x - 1) + String(8 - (y - 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x - 1) + String(8 - (y + 1));
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
            };
            shownLocations.push(render('moveLocation', x - 1, up ? y - 1 : y + 1, behavior));
        }
    }
    if (epMove.x === x + 1 && epMove.y === y && board[up ? y - 1 : y + 1][x + 1] == null)
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[up ? y - 1 : y + 1][x - 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        boardCopy[y][x + 1] = null;
        if (up)
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
                shownPiece.setAttribute('x', e.target.getAttribute('cx') - 25);
                shownPiece.setAttribute('y', e.target.getAttribute('cy') - 25);
                for (let i = 0; i < shownLocations.length;)
                {
                    g.removeChild(shownLocations.shift());
                }
                g.removeChild(board[y][x + 1]);
                board[y][x + 1] = null;
                board[up ? y - 1 : y + 1][x + 1] = board[y][x];
                board[y][x] = null;
                data.moveColor = (data.moveColor === 'white' ? 'black' : 'white');
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
                    td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x + 1) + String(8 - (y - 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    data.prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x + 1) + String(8 - (y + 1));
                    data.prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(data.prevTR);
                    data.prevTR = null;
                }
            };
            shownLocations.push(render('moveLocation', x + 1, up ? y - 1 : y + 1, behavior));
        }
    }
}