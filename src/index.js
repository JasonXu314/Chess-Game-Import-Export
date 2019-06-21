export const board = [[], [], [], [], [], [], [], []];

/**
 * The 2D array containing all of the displayed possible move locations
 * @type {Array<Array<SVGCircleElement>>}
 */
export const moveLocations = [[], [], [], [], [], [], [], []];

/**
 * The 2D array representing white's zone of control
 * @type {Array<Array<boolean>>}
 */
var whiteControl = [[], [], [], [], [], [], [], []];

/**
 * The 2D array representing black's zone of control
 * @type {Array<Array<boolean>>}
 */
var blackControl = [[], [], [], [], [], [], [], []];

/**
 * The SVG Element representing the board
 * @type {HTMLElement}
 */
export var boardElement;

/**
 * The Element representing the graphics in the SVG
 * @type {HTMLElement}
 */
export var g;
export var shownPiece = null;
export const shownLocations= [];
export const kingMoved = {
    white: false,
    black: false
}
export const rookMoved = {
    bLeft: false,
    bRight: false,
    wLeft: false,
    wRight: false
}
export const epMove = {
    x: -1,
    y: -1
}
export const blackKing = {
    x: 4,
    y: 0
}
export const whiteKing = {
    x: 4,
    y: 7
}

/**
 * Governs the behavior of a piece
 * @param {MouseEvent} e 
 */
export const pieceBehavior = (e) => {
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
export const data = {
    moveCount: 0,
    prevTR: null,
    moveColor: 'white',
    inCheck: false,
    clickEvent: null,
    check: null,
    hoverTile: null,
    tiles: []
};
// try
// {
//     const connection = new WebSocket('wss://localhost:8080');
//     var myMoveColor = '';

//     connection.onopen = (evt) => {
//         connection.send('confirm');
//     };

//     connection.onmessage = (evt) => {
//         if (evt.data === 'confirm')
//         {
//             const color = 'white';
//             myMoveColor = color;
//             connection.send('confirmed');
//         }
//         if (evt.data === 'confirmed')
//         {
//             const color = 'black';
//             myMoveColor = color;
//         }
//     };
// }
// catch (err)
// {
//     let items = Array.from(document.body.children);
//     items.forEach(item => {
//         document.body.removeChild(item);
//     });
//     document.write('Connection Refused. Please check your internet connection.');
// }

import { render } from './renderer.js';
import { showPawn } from './pawn.js';
import { showKnight } from './knight.js';
import  { showRook } from './rook.js';
import { showBishop } from './bishop.js';
import { showKing } from './king.js';
import * as Utilities from './utility.js';
import * as Control from './control.js';
import * as Checks from './checks.js';

window.addEventListener('load', (e) => {
    boardElement = document.getElementById('board');
    g = document.getElementById('g');
    for (let i = 0; i < 64; i++)
    {
        data.tiles.push(render('tile', Math.floor(i/8) * 50, (i % 8) * 50));
        moveLocations[i % 8][Math.floor(i/8)] = null;
    }
    init();
    updateControls();
    let daemon = setInterval(() => {
        if (data.clickEvent !== null)
        {
            board[data.moveColor === 'white' ? whiteKing.y : blackKing.y][data.moveColor === 'white' ? whiteKing.x : blackKing.x].dispatchEvent(data.clickEvent);
            data.clickEvent = null;
        }
        if (data.moveColor === 'white')
        {
            if (blackControl[whiteKing.y][whiteKing.x])
            {
                if (data.check !== null)
                {
                    return;
                }
                render('checkCircle', whiteKing.x, whiteKing.y);
            }
            else if (data.check !== null)
            {
                g.removeChild(data.check);
                data.check = null;
                data.inCheck = false;
            }
            else
            {
                data.inCheck = false;
            }
        }
        else if (data.moveColor === 'black')
        {
            if (whiteControl[blackKing.y][blackKing.x])
            {
                if (data.check !== null)
                {
                    return;
                }
                render('checkCircle', blackKing.x, blackKing.y);
            }
            else if (data.check !== null)
            {
                g.removeChild(data.check);
                data.check = null;
                data.inCheck = false;
            }
            else
            {
                data.inCheck = false;
            }
        }
        if (data.inCheck)
        {
            let lastTD = document.getElementById('moveHistory').lastChild.lastChild;
            if (Checks.isCheckmate())
            {
                lastTD.textContent += '#';
                alert('Game Over!\n' + (data.moveColor === 'white' ? "Black" : "White") + ' wins!');
                clearInterval(daemon);
                return;
            }
            if (lastTD.textContent.slice(lastTD.textContent.length - 1) !== '+')
            {
                lastTD.textContent += '+';
            }
        }
        let material = Number(Utilities.countMaterial(board));
        document.getElementById('materialcounter').textContent = 'Material: ' + (material > 0 ? '+' : '') + String(material);
    }, 50);
});

window.addEventListener('click', (e) => {
    if (e.target === document.body || e.target === boardElement || e.target.getAttribute('class') === 'tile' || e.target === document.getElementsByName('html')[0])
    {
        shownPiece = null;
        for (let i = 0; i < shownLocations.length;)
        {
            g.removeChild(shownLocations.shift());
        }
        for (let i = 0; i < 64; i++)
        {
            moveLocations[i % 8][Math.floor(i/8)] = null;
        }
    }
});

/**
 * Displays the move options of the given piece
 * 
 * @param {Number} x the x value of the piece
 * @param {Number} y the y value of the piece
 * @param {String} piece the type of piece (pawn, bishop, etc.)
 * @param {String} color the color of the piece
 */
function showPlaces(x, y, piece, color)
{
    if (color !== data.moveColor)
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

export function updateControls()
{
    whiteControl = Control.updateWhite(board);
    blackControl = Control.updateBlack(board);
}

/**
 * Initializes the board
 */
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