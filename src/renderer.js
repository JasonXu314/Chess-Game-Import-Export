import { g } from './index.js';

export function render(name, x, y, behavior)
{
    if (name === 'moveLocation')
    {
        if (behavior === undefined)
        {
            console.log('You must provide behavior for the moveLocation');
            return;
        }
        let moveLocation = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        moveLocation.setAttribute('cx', x * 50 + 25);
        moveLocation.setAttribute('cy', y * 50 + 25);
        moveLocation.setAttribute('r', 14);
        moveLocation.setAttribute('class', 'moveLocation');
        moveLocation.setAttribute('onclick', '"event.stopPropogation()"');
        moveLocation.addEventListener('click', behavior);
        g.appendChild(moveLocation);
        return moveLocation;
    }
    else if (name === 'checkCircle')
    {

    }
    else
    {
        if (behavior === undefined)
        {
            console.log('You must provide behavior for the piece!');
            return;
        }
        let piece = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        piece.setAttribute('href', name);
        piece.setAttribute('x', x * 50);
        piece.setAttribute('y', y * 50);
        piece.setAttribute('width', 50);
        piece.setAttribute('height', 50);
        piece.setAttribute('onclick', '"event.stopPropogation()"');
        piece.addEventListener('click', behavior);
        g.appendChild(piece);
        return piece;
    }
}