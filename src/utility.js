export function getColor(piece)
{
    return piece.getAttribute('href').slice(0, piece.getAttribute('href').length - 4).toLowerCase().split('_')[1];
}

export function getPiece(piece)
{
    return piece.getAttribute('href').slice(0, piece.getAttribute('href').length - 4).toLowerCase().split('_')[0];
}

export function getFile(fileNum)
{
    switch (fileNum)
    {
        case (0):
            return 'a';
        case (1):
            return 'b';
        case (2):
            return 'c';
        case (3):
            return 'd';
        case (4):
            return 'e';
        case (5):
            return 'f';
        case (6):
            return 'g';
        case (7):
            return 'h';
    }
}

export function countMaterial(board)
{
    let total = 0;
    board.forEach(element => {
        element.forEach(piece => {
            if (piece !== null)
            {
                total += (getColor(piece) === 'white' ? 1 : -1) * getValue(getPiece(piece));
            }
        });
    });
    return total;
}

function getValue(piece)
{
    switch (piece)
    {
        case ('pawn'):
            return 1;
        case ('bishop'):
        case ('knight'):
            return 3;
        case ('rook'):
            return 5;
        case ('queen'):
            return 9;
        default:
            return 100000;
    }
}