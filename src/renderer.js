import { moveLocations, g, data, board } from './index.js';
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
            piece.setAttribute('x', e.offsetX - 25);
            piece.setAttribute('y', e.offsetY - 25);
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
                piece.addEventListener('mousemove', test);
                startx = piece.getAttribute('x');
                starty = piece.getAttribute('y');
            }
        });
        piece.addEventListener('mouseup', (e) => {
            if (dragging)
            {
                piece.removeEventListener('mousemove', test);
                if (moveLocations[Math.floor(e.offsetY/50)][Math.floor(e.offsetX/50)] !== null)
                {
                    moveLocations[Math.floor(e.offsetY/50)][Math.floor(e.offsetX/50)].dispatchEvent(new MouseEvent('click'));
                }
                else
                {
                    piece.setAttribute('x', startx);
                    piece.setAttribute('y', starty);
                }
                dragging = false;
            }
        });
        g.appendChild(piece);
        return piece;
    }
}