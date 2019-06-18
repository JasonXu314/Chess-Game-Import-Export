const board = [[], [], [], [], [], [], [], []];
var whiteControl = [[], [], [], [], [], [], [], []];
var blackControl = [[], [], [], [], [], [], [], []];
var boardElement;
export var g;
var shownPiece = null;
const shownLocations= [];
var material = 0;
const kingMoved = {
    white: false,
    black: false
}
const rookMoved = {
    bLeft: false,
    bRight: false,
    wLeft: false,
    wRight: false
}
var moveColor = 'white';
const epMove = {
    x: -1,
    y: -1
}
const blackKing = {
    x: 4,
    y: 0
}
const whiteKing = {
    x: 4,
    y: 7
}
var check = null;
var inCheck = false;
let clickEvent = null;
const pieceBehavior = (e) => {
    let x = Number(e.target.getAttribute('x'));
    let y = Number(e.target.getAttribute('y'));
    let piece = Utilities.getPiece(e.target);
    let color = Utilities.getColor(e.target);
    for (let i = 0; i < shownLocations.length;)
    {
        g.removeChild(shownLocations.shift());
    }
    shownPiece = e.target;
    showPlaces(x, y, piece, color);
};
let moveCount = 0;
let prevTR = null;

import { render } from './renderer.js';
import * as Utilities from './utility.js';

window.addEventListener('load', (e) => {
    boardElement = document.getElementById('board');
    g = document.getElementById('g');
    for (let i = 0; i < 64; i++)
    {
        let tile = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        tile.setAttribute('x', Math.floor(i/8) * 50);
        tile.setAttribute('y', (i % 8) * 50);
        tile.setAttribute('width', '50');
        tile.setAttribute('height', '50');
        tile.setAttribute('class', 'tile');
        tile.setAttribute('fill', (Math.floor(i/8) + i % 8) % 2 == 0 ? 'white' : 'black');
        g.appendChild(tile);
    }
    init();
    updateControls();
    let loop = setInterval(() => {
        if (inCheck)
        {
            if (isCheckmate())
            {
                alert('Game Over!\n' + (moveColor === 'white' ? "Black" : "White") + ' wins!');
                clearInterval(loop);
            }
        }
        if (moveColor === 'white')
        {
            if (blackControl[whiteKing.y][whiteKing.x])
            {
                if (check !== null)
                {
                    g.removeChild(check);
                    check = null;
                }
                let checkCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                checkCircle.setAttribute('cx', whiteKing.x * 50 + 25);
                checkCircle.setAttribute('cy', whiteKing.y * 50 + 25);
                checkCircle.setAttribute('r', 25);
                checkCircle.setAttribute('fill', 'url(#grad1)');
                checkCircle.setAttribute('id', 'checkCircle');
                checkCircle.addEventListener('click', (e) => {
                    clickEvent = e;
                });
                g.appendChild(checkCircle);
                check = checkCircle;
                inCheck = true;
            }
            else if (check !== null)
            {
                g.removeChild(check);
                check = null;
                inCheck = false;
            }
            else
            {
                inCheck = false;
            }
        }
        else if (moveColor === 'black')
        {
            if (whiteControl[blackKing.y][blackKing.x])
            {
                if (check !== null)
                {
                    g.removeChild(check);
                    check = null;
                }
                let checkCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                checkCircle.setAttribute('cx', blackKing.x * 50 + 25);
                checkCircle.setAttribute('cy', blackKing.y * 50 + 25);
                checkCircle.setAttribute('r', 25);
                checkCircle.setAttribute('fill', 'url(#grad1)');
                checkCircle.setAttribute('id', 'checkCircle');
                checkCircle.addEventListener('click', (e) => {
                    clickEvent = e;
                });
                g.appendChild(checkCircle);
                check = checkCircle;
                inCheck = true;
            }
            else if (check !== null)
            {
                g.removeChild(check);
                check = null;
                inCheck = false;
            }
            else
            {
                inCheck = false;
            }
        }
        if (clickEvent !== null)
        {
            board[moveColor === 'white' ? whiteKing.y : blackKing.y][moveColor === 'white' ? whiteKing.x : blackKing.x].dispatchEvent(clickEvent);
            clickEvent = null;
        }
        let material = Number(Utilities.countMaterial(board));
        document.getElementById('materialcounter').textContent = 'Material: ' + (material > 0 ? '+' : '') + String(material);
    }, 250);
});

document.addEventListener('click', (e) => {
    if (e.target === document.body || e.target === boardElement || e.target.getAttribute('class') === 'tile')
    {
        shownPiece = null;
        for (let i = 0; i < shownLocations.length;)
        {
            g.removeChild(shownLocations.shift());
        }
    }
});

function showPlaces(x, y, piece, color)
{
    if (color !== moveColor)
    {
        return;
    }
    switch (piece)
    {
        case ('pawn'):
            showPawn(x/50, y/50, color);
            break;
        case ('knight'):
            showKnight(x/50, y/50, color);
            break;
        case ('rook'):
            showRook(x/50, y/50, color, false);
            break;
        case ('bishop'):
            showBishop(x/50, y/50, color, false);
            break;
        case ('queen'):
            showRook(x/50, y/50, color, true);
            showBishop(x/50, y/50, color, true);
            break;
        case ('king'):
           showKing(x/50, y/50, color);
    }
}

function showPawn(x, y, color)
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                    moveColor = moveColor === 'white' ? 'black' : 'white';
                    epMove.x = -1;
                    epMove.y = -1;
                    updateControls();
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
                    moveColor = moveColor === 'white' ? 'black' : 'white';
                    epMove.x = -1;
                    epMove.y = -1;
                    updateControls();
                    if (prevTR === null)
                    {
                        let tr = document.createElement('tr');
                        let td = document.createElement('td');
                        td.textContent = ++moveCount;
                        tr.appendChild(td);
                        td = document.createElement('td');
                        td.textContent = Utilities.getFile(x) + String(8 - (y - 1));
                        tr.appendChild(td);
                        document.getElementById('moveHistory').appendChild(tr);
                        prevTR = tr;
                    }
                    else
                    {
                        let td = document.createElement('td');
                        td = document.createElement('td');
                        td.textContent = Utilities.getFile(x) + String(8 - (y + 1));
                        prevTR.appendChild(td);
                        document.getElementById('moveHistory').appendChild(prevTR);
                        prevTR = null;
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
                if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                {
                    skip = true;
                }
            }
            else
            {
                if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                        moveColor = moveColor === 'white' ? 'black' : 'white';
                        epMove.x = x;
                        epMove.y = up ? y - 2 : y + 2;
                        updateControls();
                        if (prevTR === null)
                        {
                            let tr = document.createElement('tr');
                            let td = document.createElement('td');
                            td.textContent = ++moveCount;
                            tr.appendChild(td);
                            td = document.createElement('td');
                            td.textContent = Utilities.getFile(x) + String(8 - (y - 2));
                            tr.appendChild(td);
                            document.getElementById('moveHistory').appendChild(tr);
                            prevTR = tr;
                        }
                        else
                        {
                            let td = document.createElement('td');
                            td = document.createElement('td');
                            td.textContent = Utilities.getFile(x) + String(8 - (y + 2));
                            prevTR.appendChild(td);
                            document.getElementById('moveHistory').appendChild(prevTR);
                            prevTR = null;
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                    moveColor = moveColor === 'white' ? 'black' : 'white';
                    epMove.x = -1;
                    epMove.y = -1;
                    updateControls();
                    if (prevTR === null)
                    {
                        let tr = document.createElement('tr');
                        let td = document.createElement('td');
                        td.textContent = ++moveCount;
                        tr.appendChild(td);
                        td = document.createElement('td');
                        td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x + 1) +  String(8 - (y - 1) + '=♕');
                        tr.appendChild(td);
                        document.getElementById('moveHistory').appendChild(tr);
                        prevTR = tr;
                    }
                    else
                    {
                        let td = document.createElement('td');
                        td = document.createElement('td');
                        td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x + 1) + String(8 - (y + 1) + '=♛');
                        prevTR.appendChild(td);
                        document.getElementById('moveHistory').appendChild(prevTR);
                        prevTR = null;
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
                    moveColor = moveColor === 'white' ? 'black' : 'white';
                    epMove.x = -1;
                    epMove.y = -1;
                    updateControls();
                    if (prevTR === null)
                    {
                        let tr = document.createElement('tr');
                        let td = document.createElement('td');
                        td.textContent = ++moveCount;
                        tr.appendChild(td);
                        td = document.createElement('td');
                        td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x + 1) + String(8 - (y - 1));
                        tr.appendChild(td);
                        document.getElementById('moveHistory').appendChild(tr);
                        prevTR = tr;
                    }
                    else
                    {
                        let td = document.createElement('td');
                        td = document.createElement('td');
                        td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x + 1) + String(8 - (y + 1));
                        prevTR.appendChild(td);
                        document.getElementById('moveHistory').appendChild(prevTR);
                        prevTR = null;
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                    moveColor = moveColor === 'white' ? 'black' : 'white';
                    epMove.x = -1;
                    epMove.y = -1;
                    updateControls();
                    if (prevTR === null)
                    {
                        let tr = document.createElement('tr');
                        let td = document.createElement('td');
                        td.textContent = ++moveCount;
                        tr.appendChild(td);
                        td = document.createElement('td');
                        td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x - 1) + String(8 - (y - 1) + '=♕');
                        tr.appendChild(td);
                        document.getElementById('moveHistory').appendChild(tr);
                        prevTR = tr;
                    }
                    else
                    {
                        let td = document.createElement('td');
                        td = document.createElement('td');
                        td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x - 1) + String(8 - (y + 1) + '=♛');
                        prevTR.appendChild(td);
                        document.getElementById('moveHistory').appendChild(prevTR);
                        prevTR = null;
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
                    moveColor = moveColor === 'white' ? 'black' : 'white';
                    epMove.x = -1;
                    epMove.y = -1;
                    updateControls();
                    if (prevTR === null)
                    {
                        let tr = document.createElement('tr');
                        let td = document.createElement('td');
                        td.textContent = ++moveCount;
                        tr.appendChild(td);
                        td = document.createElement('td');
                        td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x - 1) + String(8 - (y - 1));
                        tr.appendChild(td);
                        document.getElementById('moveHistory').appendChild(tr);
                        prevTR = tr;
                    }
                    else
                    {
                        let td = document.createElement('td');
                        td = document.createElement('td');
                        td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x - 1) + String(8 - (y + 1));
                        prevTR.appendChild(td);
                        document.getElementById('moveHistory').appendChild(prevTR);
                        prevTR = null;
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x - 1) + String(8 - (y - 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x - 1) + String(8 - (y + 1));
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x + 1) + String(8 - (y - 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = Utilities.getFile(x) + 'x' + Utilities.getFile(x + 1) + String(8 - (y + 1));
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
                }
            };
            shownLocations.push(render('moveLocation', x + 1, up ? y - 1 : y + 1, behavior));
        }
    }
}

function showKnight(x, y, color)
{
    if ((y <= 5 && x <= 6) && (board[y + 2][x + 1] === null || Utilities.getColor(board[y + 2][x + 1]) !== color))
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 2][x + 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y + 2));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y + 2));
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y - 2));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y - 2));
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y + 2));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y + 2));
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y - 2));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y - 2));
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x + 2) + String(8 - (y + 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x + 2) + String(8 - (y + 1));
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x - 2) + String(8 - (y - 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x - 2) + String(8 - (y - 1));
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x + 2) + String(8 - (y - 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x + 2) + String(8 - (y - 1));
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x - 2) + String(8 - (y + 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'N' + (capture ? 'x' : '') + Utilities.getFile(x - 2) + String(8 - (y + 1));
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
                }
            };
            shownLocations.push(render('moveLocation', x - 2, y + 1, behavior));
        }
    }
}

function showRook(x, y, color, queen)
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
            moveColor = moveColor === 'white' ? 'black' : 'white';
            epMove.x = -1;
            epMove.y = -1;
            updateControls();
            if (prevTR === null)
            {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.textContent = ++moveCount;
                tr.appendChild(td);
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'R') + (capture ? 'x' : '') + Utilities.getFile(i) + String(8 - y);
                tr.appendChild(td);
                document.getElementById('moveHistory').appendChild(tr);
                prevTR = tr;
            }
            else
            {
                let td = document.createElement('td');
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'R') + (capture ? 'x' : '') + Utilities.getFile(i) + String(8 - y);
                prevTR.appendChild(td);
                document.getElementById('moveHistory').appendChild(prevTR);
                prevTR = null;
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
                    if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        skip = true;
                    }
                }
                else
                {
                    if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            moveColor = moveColor === 'white' ? 'black' : 'white';
            epMove.x = -1;
            epMove.y = -1;
            updateControls();
            if (prevTR === null)
            {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.textContent = ++moveCount;
                tr.appendChild(td);
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'R') + (capture ? 'x' : '') + Utilities.getFile(i) + String(8 - y);
                tr.appendChild(td);
                document.getElementById('moveHistory').appendChild(tr);
                prevTR = tr;
            }
            else
            {
                let td = document.createElement('td');
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'R') + (capture ? 'x' : '') + Utilities.getFile(i) + String(8 - y);
                prevTR.appendChild(td);
                document.getElementById('moveHistory').appendChild(prevTR);
                prevTR = null;
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
                    if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        skip = true;
                    }
                }
                else
                {
                    if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            moveColor = moveColor === 'white' ? 'black' : 'white';
            epMove.x = -1;
            epMove.y = -1;
            updateControls();
            if (prevTR === null)
            {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.textContent = ++moveCount;
                tr.appendChild(td);
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'R') + (capture ? 'x' : '') + Utilities.getFile(x) + String(8 - i);
                tr.appendChild(td);
                document.getElementById('moveHistory').appendChild(tr);
                prevTR = tr;
            }
            else
            {
                let td = document.createElement('td');
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'R') + (capture ? 'x' : '') + Utilities.getFile(x) + String(8 - i);
                prevTR.appendChild(td);
                document.getElementById('moveHistory').appendChild(prevTR);
                prevTR = null;
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
                    if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        skip = true;
                    }
                }
                else
                {
                    if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            moveColor = moveColor === 'white' ? 'black' : 'white';
            epMove.x = -1;
            epMove.y = -1;
            updateControls();
            if (prevTR === null)
            {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.textContent = ++moveCount;
                tr.appendChild(td);
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'R') + (capture ? 'x' : '') + Utilities.getFile(x) + String(8 - i);
                tr.appendChild(td);
                document.getElementById('moveHistory').appendChild(tr);
                prevTR = tr;
            }
            else
            {
                let td = document.createElement('td');
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'R') + (capture ? 'x' : '') + Utilities.getFile(x) + String(8 - i);
                prevTR.appendChild(td);
                document.getElementById('moveHistory').appendChild(prevTR);
                prevTR = null;
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
                    if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        skip = true;
                    }
                }
                else
                {
                    if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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

function showBishop(x, y, color, queen)
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
            moveColor = moveColor === 'white' ? 'black' : 'white';
            epMove.x = -1;
            epMove.y = -1;
            updateControls();
            if (prevTR === null)
            {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.textContent = ++moveCount;
                tr.appendChild(td);
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'B') + (capture ? 'x' : '') + Utilities.getFile(x + i) + String(8 - (y + i));
                tr.appendChild(td);
                document.getElementById('moveHistory').appendChild(tr);
                prevTR = tr;
            }
            else
            {
                let td = document.createElement('td');
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'B') + (capture ? 'x' : '') + Utilities.getFile(x + i) + String(8 - (y + i));
                prevTR.appendChild(td);
                document.getElementById('moveHistory').appendChild(prevTR);
                prevTR = null;
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
                    if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        skip = true;
                    }
                }
                else
                {
                    if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            moveColor = moveColor === 'white' ? 'black' : 'white';
            epMove.x = -1;
            epMove.y = -1;
            updateControls();
            if (prevTR === null)
            {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.textContent = ++moveCount;
                tr.appendChild(td);
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'B') + (capture ? 'x' : '') + Utilities.getFile(x - i) + String(8 - (y - i));
                tr.appendChild(td);
                document.getElementById('moveHistory').appendChild(tr);
                prevTR = tr;
            }
            else
            {
                let td = document.createElement('td');
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'B') + (capture ? 'x' : '') + Utilities.getFile(x - i) + String(8 - (y - i));
                prevTR.appendChild(td);
                document.getElementById('moveHistory').appendChild(prevTR);
                prevTR = null;
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
                    if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        skip = true;
                    }
                }
                else
                {
                    if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            moveColor = moveColor === 'white' ? 'black' : 'white';
            epMove.x = -1;
            epMove.y = -1;
            updateControls();
            if (prevTR === null)
            {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.textContent = ++moveCount;
                tr.appendChild(td);
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'B') + (capture ? 'x' : '') + Utilities.getFile(x - i) + String(8 - (y + i));
                tr.appendChild(td);
                document.getElementById('moveHistory').appendChild(tr);
                prevTR = tr;
            }
            else
            {
                let td = document.createElement('td');
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'B') + (capture ? 'x' : '') + Utilities.getFile(x - i) + String(8 - (y + i));
                prevTR.appendChild(td);
                document.getElementById('moveHistory').appendChild(prevTR);
                prevTR = null;
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
                    if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        skip = true;
                    }
                }
                else
                {
                    if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            moveColor = moveColor === 'white' ? 'black' : 'white';
            epMove.x = -1;
            epMove.y = -1;
            updateControls();
            if (prevTR === null)
            {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.textContent = ++moveCount;
                tr.appendChild(td);
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'B') + (capture ? 'x' : '') + Utilities.getFile(x + i) + String(8 - (y - i));
                tr.appendChild(td);
                document.getElementById('moveHistory').appendChild(tr);
                prevTR = tr;
            }
            else
            {
                let td = document.createElement('td');
                td = document.createElement('td');
                td.textContent = (queen ? 'Q' : 'B') + (capture ? 'x' : '') + Utilities.getFile(x + i) + String(8 - (y - i));
                prevTR.appendChild(td);
                document.getElementById('moveHistory').appendChild(prevTR);
                prevTR = null;
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
                    if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        skip = true;
                    }
                }
                else
                {
                    if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x])
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

function showKing(x, y, color)
{
    if (y + 1 < 8 && x + 1 < 8 && ((board[y + 1][x + 1] !== null && Utilities.getColor(board[y + 1][x + 1]) !== color) || board[y + 1][x + 1] === null))
    {
        let skip = false;
        let boardCopy = Array.from(board, (element) => Array.from(element));
        boardCopy[y + 1][x + 1] = boardCopy[y][x];
        boardCopy[y][x] = null;
        if (color === 'white')
        {
            if (updateBlack(boardCopy)[whiteKing.y + 1][whiteKing.x + 1])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y + 1][blackKing.x + 1])
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
                if (board[y + 1][x + 1] !== null)
                {
                    g.removeChild(board[y + 1][x + 1]);
                }
                board[y + 1][x + 1] = board[y][x];
                board[y][x] = null;
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y + 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y + 1));
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
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
            if (updateBlack(boardCopy)[whiteKing.y - 1][whiteKing.x - 1])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y - 1][blackKing.x - 1])
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y - 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y - 1));
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
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
            if (updateBlack(boardCopy)[whiteKing.y - 1][whiteKing.x - 1])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y - 1][blackKing.x - 1])
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y - 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y - 1));
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
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
            if (updateBlack(boardCopy)[whiteKing.y + 1][whiteKing.x - 1])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y + 1][blackKing.x - 1])
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y + 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y + 1));
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
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
            if (updateBlack(boardCopy)[whiteKing.y + 1][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y + 1][blackKing.x])
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x) + String(8 - (y + 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x) + String(8 - (y + 1));
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
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
            if (updateBlack(boardCopy)[whiteKing.y - 1][whiteKing.x])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y - 1][blackKing.x])
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x) + String(8 - (y - 1));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x) + String(8 - (y - 1));
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x + 1])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x + 1])
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x + 1) + String(8 - (y));
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
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
            if (updateBlack(boardCopy)[whiteKing.y][whiteKing.x - 1])
            {
                skip = true;
            }
        }
        else
        {
            if (updateWhite(boardCopy)[blackKing.y][blackKing.x - 1])
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y));
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'K' + (capture ? 'x' : '') + Utilities.getFile(x - 1) + String(8 - (y));
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
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
    if (!moved && !inCheck)
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = 'O-O-O';
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'O-O-O';
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
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
                moveColor = moveColor === 'white' ? 'black' : 'white';
                epMove.x = -1;
                epMove.y = -1;
                updateControls();
                if (prevTR === null)
                {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.textContent = ++moveCount;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.textContent = 'O-O';
                    tr.appendChild(td);
                    document.getElementById('moveHistory').appendChild(tr);
                    prevTR = tr;
                }
                else
                {
                    let td = document.createElement('td');
                    td = document.createElement('td');
                    td.textContent = 'O-O';
                    prevTR.appendChild(td);
                    document.getElementById('moveHistory').appendChild(prevTR);
                    prevTR = null;
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

function updateControls()
{
    whiteControl = updateWhite(board);
    blackControl = updateBlack(board);
}

function updateWhite(board)
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

function updateBlack(board)
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

function init()
{
    for (let i = 0; i < 8; i++)
    {
        board[6][i] = render('Pawn_White.png', i, 6, pieceBehavior);
        board[1][i] = render('Pawn_Black.png', i, 1, pieceBehavior);
    }
    for (let i = 0; i < 8; i++)
    {
        board[2][i] = null;
        board[3][i] = null;
        board[4][i] = null;
        board[5][i] = null;
    }
    board[0][0] = render('Rook_Black.png', 0, 0, pieceBehavior);
    board[7][0] = render('Rook_White.png', 0, 7, pieceBehavior);
    board[0][7] = render('Rook_Black.png', 7, 0, pieceBehavior);
    board[7][7] = render('Rook_White.png', 7, 7, pieceBehavior);
    board[0][6] = render('Knight_Black.png', 6, 0, pieceBehavior);
    board[7][6] = render('Knight_White.png', 6, 7, pieceBehavior);
    board[0][1] = render('Knight_Black.png', 1, 0, pieceBehavior);
    board[7][1] = render('Knight_White.png', 1, 7, pieceBehavior);
    board[0][5] = render('Bishop_Black.png', 5, 0, pieceBehavior);
    board[7][5] = render('Bishop_White.png', 5, 7, pieceBehavior);
    board[0][2] = render('Bishop_Black.png', 2, 0, pieceBehavior);
    board[7][2] = render('Bishop_White.png', 2, 7, pieceBehavior);
    board[0][4] = render('King_Black.png', 4, 0, pieceBehavior);
    board[7][4] = render('King_White.png', 4, 7, pieceBehavior);
    board[0][3] = render('Queen_Black.png', 3, 0, pieceBehavior);
    board[7][3] = render('Queen_White.png', 3, 7, pieceBehavior);
}

function isCheckmate()
{
    for (let x = 0; x < 8; x++)
    {
        for (let y = 0; y < 8; y++)
        {
            if (board[y][x] !== null && Utilities.getColor(board[y][x]) === moveColor)
            {
                switch (Utilities.getPiece(board[y][x]))
                {
                    case ('pawn'):
                        if (tryPawn(x, y, moveColor))
                        {
                            return false;
                        }
                        break;
                    case ('knight'):
                        if (tryKnight(x, y, moveColor))
                        {
                            return false;
                        }
                        break;
                    case ('bishop'):
                        if (tryBishop(x, y, moveColor))
                        {
                            return false;
                        }
                        break;
                    case ('rook'):
                        if (tryRook(x, y, moveColor))
                        {
                            return false;
                        }
                        break;
                    case ('queen'):
                        if (tryBishop(x, y, moveColor) || tryRook(x, y, moveColor))
                        {
                            return false;
                        }
                        break;
                    case ('king'):
                        if (tryKing(x, y, moveColor))
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                console.log('up1', x, y);
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                {
                    console.log('up2', x, y);
                    return true;
                }
            }
            else
            {
                if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                console.log('up1right1', x, y);
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                console.log('up1left1', x, y);
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                console.log('epleft', x, y);
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                console.log('epright', x, y);
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                {
                    return true;
                }
            }
            else
            {
                if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                {
                    return true;
                }
            }
            else
            {
                if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                {
                    return true;
                }
            }
            else
            {
                if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                {
                    return true;
                }
            }
            else
            {
                if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                    if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        return true;
                    }
                }
                else
                {
                    if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                    if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        return true;
                    }
                }
                else
                {
                    if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                    if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        return true;
                    }
                }
                else
                {
                    if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
                    if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
                    {
                        return true;
                    }
                }
                else
                {
                    if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y + 1][whiteKing.x + 1])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y + 1][blackKing.x + 1])
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
            if (!updateBlack(boardCopy)[whiteKing.y + 1][whiteKing.x + 1])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y + 1][blackKing.x + 1])
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
            if (!updateBlack(boardCopy)[whiteKing.y - 1][whiteKing.x - 1])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y - 1][blackKing.x - 1])
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
            if (!updateBlack(boardCopy)[whiteKing.y - 1][whiteKing.x - 1])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y - 1][blackKing.x - 1])
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
            if (!updateBlack(boardCopy)[whiteKing.y - 1][whiteKing.x - 1])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y - 1][blackKing.x - 1])
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
            if (!updateBlack(boardCopy)[whiteKing.y - 1][whiteKing.x + 1])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y - 1][blackKing.x + 1])
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
            if (!updateBlack(boardCopy)[whiteKing.y + 1][whiteKing.x - 1])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y + 1][blackKing.x - 1])
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
            if (!updateBlack(boardCopy)[whiteKing.y + 1][whiteKing.x - 1])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y + 1][blackKing.x - 1])
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
            if (!updateBlack(boardCopy)[whiteKing.y + 1][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y + 1][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y + 1][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y + 1][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y - 1][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y - 1][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y - 1][whiteKing.x])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y - 1][blackKing.x])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x + 1])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x + 1])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x + 1])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x + 1])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x - 1])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x - 1])
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
            if (!updateBlack(boardCopy)[whiteKing.y][whiteKing.x - 1])
            {
                return true;
            }
        }
        else
        {
            if (!updateWhite(boardCopy)[blackKing.y][blackKing.x - 1])
            {
                return true;
            }
        }
    }
    return false;
}