const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const GRID_SIZE = 20;
const SNAKE_COLOR = '#4caf50';
const FOOD_COLOR = '#f44336';

let snake = [{ x: 10, y: 10 }];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameOver = false;

// --- Game Setup ---
function initializeGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    gameOver = false;
    generateFood();
    main();
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / GRID_SIZE));
    food.y = Math.floor(Math.random() * (canvas.height / GRID_SIZE));
    // Ensure food doesn't spawn on the snake
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            generateFood();
        }
    });
}

// --- Game Loop ---
function main() {
    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '40px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '20px "Press Start 2P"';
        ctx.fillText('Press Enter to Restart', canvas.width / 2, canvas.height / 2 + 20);
        return;
    }

    setTimeout(() => {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        main();
    }, 100);
}

// --- Drawing ---
function clearCanvas() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = SNAKE_COLOR;
    snake.forEach(part => {
        ctx.fillRect(part.x * GRID_SIZE, part.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    });
}

function drawFood() {
    ctx.fillStyle = FOOD_COLOR;
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

// --- Game Logic ---
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (checkCollision()) {
        gameOver = true;
        return;
    }

    const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
    if (hasEatenFood) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    // Wall collision
    if (head.x < 0 || head.x * GRID_SIZE >= canvas.width || head.y < 0 || head.y * GRID_SIZE >= canvas.height) {
        return true;
    }
    // Self collision
    for (let i = 4; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// --- Input Handling ---
document.addEventListener('keydown', e => {
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    switch (e.key) {
        case 'ArrowUp':
            if (!goingDown) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (!goingUp) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (!goingRight) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (!goingLeft) { dx = 1; dy = 0; }
            break;
        case 'Enter':
            if (gameOver) {
                initializeGame();
            }
            break;
    }
});

// --- Start Game ---
initializeGame();
