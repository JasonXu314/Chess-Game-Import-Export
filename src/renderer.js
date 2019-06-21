import { moveLocations, g, data, board, boardElement } from './index.js';
import * as Utilities from './utility.js';

/**
 * 
 * @param {String} name 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Function} behavior 
 * @param {Function} dragBehavior 
 */
export function render(name, x, y, behavior)
{
    if (name === 'moveLocation')
    {
        if (behavior === undefined)
        {
            console.error('You must provide behavior for the moveLocation');
            return;
        }
        let moveLocation = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        moveLocation.setAttribute('cx', x * 50 + 25);
        moveLocation.setAttribute('cy', y * 50 + 25);
        moveLocation.setAttribute('r', 14);
        moveLocation.setAttribute('class', 'moveLocation');
        moveLocation.setAttribute('onclick', '"event.stopPropogation()"');
        moveLocation.addEventListener('click', behavior);
        moveLocation.addEventListener('click', (e) => {
            for (let i = 0; i < 64; i++)
            {
                moveLocations[i % 8][Math.floor(i/8)] = null;
            }
        });
        g.appendChild(moveLocation);
        moveLocations[y][x] = moveLocation;
        return moveLocation;
    }
    else if (name === 'checkCircle')
    {
        let checkCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        checkCircle.setAttribute('cx', x * 50 + 25);
        checkCircle.setAttribute('cy', y * 50 + 25);
        checkCircle.setAttribute('r', 25);
        checkCircle.setAttribute('fill', 'url(#grad1)');
        checkCircle.setAttribute('id', 'checkCircle');
        checkCircle.addEventListener('click', (e) => {
            data.clickEvent = e;
        });
        g.appendChild(checkCircle);
        data.check = checkCircle;
        data.inCheck = true;
        g.removeChild(board[y][x]);
        g.appendChild(board[y][x]);
        return;
    }
    else if (name === 'tile')
    {
        let tile = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        tile.setAttribute('x', x);
        tile.setAttribute('y', y);
        tile.setAttribute('width', '50');
        tile.setAttribute('height', '50');
        tile.setAttribute('class', 'tile');
        tile.setAttribute('fill', (x/50 + y/50) % 2 == 0 ? 'white' : 'black');
        tile.addEventListener('mouseover', (e) => {
            data.hoverTile = tile;
        });
        tile.addEventListener('mouseout', (e) => {
            data.hoverTile = null;
        });
        g.appendChild(tile);
        return tile;
    }
    else
    {
        if (behavior === undefined)
        {
            console.error('You must provide behavior for the piece!');
            return;
        }
        let piece = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        let test = (e) => {
            piece.setAttribute('x', e.clientX - 75);
            piece.setAttribute('y', e.clientY - 75);
        };
        let startx = -1;
        let dragging = false;
        let starty = -1;
        piece.setAttribute('href', name);
        piece.setAttribute('x', x * 50);
        piece.setAttribute('y', y * 50);
        piece.setAttribute('width', 50);
        piece.setAttribute('height', 50);
        piece.setAttribute('onclick', '"event.stopPropogation()"');
        piece.addEventListener('mousedown', behavior);
        piece.addEventListener('mousedown', (e) => {
            if (data.moveColor === Utilities.getColor(piece) && !dragging)
            {
                dragging = true;
                g.removeChild(piece);
                g.appendChild(piece);
                boardElement.addEventListener('mousemove', test);
                startx = piece.getAttribute('x');
                starty = piece.getAttribute('y');
            }
        });
        boardElement.addEventListener('mouseup', (e) => {
            if (dragging)
            {
                boardElement.removeEventListener('mousemove', test);
                if (moveLocations[Math.floor(e.clientY/50 - 1)][Math.floor(e.clientX/50 - 1)] !== null)
                {
                    moveLocations[Math.floor(e.clientY/50 - 1)][Math.floor(e.clientX/50 - 1)].dispatchEvent(new MouseEvent('click'));
                    for (let i = 0; i < 64; i++)
                    {
                        moveLocations[i % 8][Math.floor(i/8)] = null;
                    }
                }
                else
                {
                    piece.setAttribute('x', startx);
                    piece.setAttribute('y', starty);
                    for (let i = 0; i < 64; i++)
                    {
                        moveLocations[i % 8][Math.floor(i/8)] = null;
                    }
                }
                dragging = false;
            }
        });
        g.appendChild(piece);
        return piece;
    }
}