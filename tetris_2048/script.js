const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-canvas');
const nextCtx = nextCanvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverMessage = document.getElementById('game-over-message');
const restartButton = document.getElementById('restart-button');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
nextCtx.scale(BLOCK_SIZE, BLOCK_SIZE);

const COLORS = {
    2: '#4a2e00', 4: '#6e4500', 8: '#915c00', 16: '#b57300',
    32: '#d88a00', 64: '#fb9f00', 128: '#ffac1e', 256: '#ffba3c',
    512: '#ffc85b', 1024: '#ffd679', 2048: '#ffe498'
};

const PIECES = [
    [[1, 1], [1, 1]], // O
    [[0, 2, 0], [2, 2, 2]], // T
    [[0, 3, 3], [3, 3, 0]], // S
    [[4, 4, 0], [0, 4, 4]], // Z
    [[5, 5, 5, 5]], // I
    [[6, 0, 0], [6, 6, 6]], // L
    [[0, 0, 7], [7, 7, 7]]  // J
];

let board = createBoard();
let player = newPlayer();
let nextPiece = newPlayer();
let score = 0;
let gameOver = false;

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function newPlayer() {
    const type = PIECES[Math.floor(Math.random() * PIECES.length)];
    const value = 2;
    const matrix = type.map(row => row.map(cell => (cell !== 0 ? value : 0)));
    return {
        pos: { x: Math.floor(COLS / 2) - Math.floor(matrix[0].length / 2), y: 0 },
        matrix: matrix,
    };
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(board, { x: 0, y: 0 }, ctx);
    drawMatrix(player.matrix, player.pos, ctx);
    drawNextPiece();
}

function drawMatrix(matrix, offset, context) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = COLORS[value] || '#ccc';
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
                context.fillStyle = '#000';
                context.font = '0.5px "Press Start 2P"';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(value, x + offset.x + 0.5, y + offset.y + 0.5);
            }
        });
    });
}

function drawNextPiece() {
    nextCtx.fillStyle = '#000';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    const offset = { x: (nextCanvas.width / BLOCK_SIZE - nextPiece.matrix[0].length) / 2, y: (nextCanvas.height / BLOCK_SIZE - nextPiece.matrix.length) / 2 };
    drawMatrix(nextPiece.matrix, offset, nextCtx);
}

function update(time = 0) {
    if (gameOver) return;
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}

function playerDrop() {
    player.pos.y++;
    if (collide(board, player)) {
        player.pos.y--;
        lockPiece();
        resetPlayer();
    }
    dropCounter = 0;
}

function collide(board, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && (board[y + o.y] && board[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function lockPiece() {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                if (player.pos.y + y < 0) return; // Should not happen
                board[player.pos.y + y][player.pos.x + x] = value;
            }
        });
    });
    handleMerges();
}

function handleMerges() {
    let merged = true;
    while(merged) {
        merged = false;
        for (let y = ROWS - 1; y >= 0; y--) {
            for (let x = 0; x < COLS; x++) {
                const val = board[y][x];
                if (val === 0) continue;
                // Check below
                if (y < ROWS - 1 && board[y + 1][x] === val) {
                    board[y + 1][x] *= 2;
                    score += board[y+1][x];
                    board[y][x] = 0;
                    merged = true;
                }
            }
        }
        // Gravity after vertical merge
        if(merged) {
             for (let x = 0; x < COLS; x++) {
                let empty = -1;
                for (let y = ROWS - 1; y >= 0; y--) {
                    if(board[y][x] === 0 && empty === -1) empty = y;
                    if(board[y][x] !== 0 && empty !== -1) {
                        board[empty][x] = board[y][x];
                        board[y][x] = 0;
                        empty--;
                    }
                }
            }
        }
    }
    scoreElement.textContent = score;
}

function resetPlayer() {
    player = nextPiece;
    nextPiece = newPlayer();
    if (collide(board, player)) {
        gameOver = true;
        gameOverMessage.classList.remove('hidden');
    }
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(board, player)) {
        player.pos.x -= dir;
    }
}

function rotate(matrix) {
    const N = matrix.length;
    const result = matrix.map((row, i) => row.map((val, j) => matrix[N - 1 - j][i]));
    return result;
}

function playerRotate() {
    const pos = player.pos.x;
    let offset = 1;
    const rotated = rotate(player.matrix);
    player.matrix = rotated;
    while (collide(board, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            player.matrix = rotate(player.matrix); // rotate back
            player.pos.x = pos;
            return;
        }
    }
}

document.addEventListener('keydown', event => {
    if (gameOver) return;
    if (event.key === 'ArrowLeft') playerMove(-1);
    else if (event.key === 'ArrowRight') playerMove(1);
    else if (event.key === 'ArrowDown') playerDrop();
    else if (event.key === 'ArrowUp') playerRotate();
});

restartButton.addEventListener('click', () => {
    board = createBoard();
    player = newPlayer();
    nextPiece = newPlayer();
    score = 0;
    scoreElement.textContent = score;
    gameOver = false;
    gameOverMessage.classList.add('hidden');
    update();
});

update();
