document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const scoreElement = document.getElementById('score');
    const bestScoreElement = document.getElementById('best-score');
    const gameOverMessage = document.getElementById('game-over-message');
    const restartButton = document.getElementById('restart-button');
    const gridSize = 4;
    let grid = [];
    let score = 0;
    let bestScore = localStorage.getItem('2048-bestScore') || 0;

    function init() {
        grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
        score = 0;
        gameOverMessage.classList.add('hidden');
        addRandomTile();
        addRandomTile();
        updateBestScore();
        renderBoard();
    }

    function renderBoard() {
        gridContainer.innerHTML = '';
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                const value = grid[i][j];
                if (value !== 0) {
                    tile.textContent = value;
                    tile.dataset.value = value;
                }
                gridContainer.appendChild(tile);
            }
        }
        scoreElement.textContent = score;
    }

    function addRandomTile() {
        let emptyTiles = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === 0) {
                    emptyTiles.push({ i, j });
                }
            }
        }
        if (emptyTiles.length > 0) {
            const { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            grid[i][j] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function handleInput(e) {
        let moved = false;
        switch (e.key) {
            case 'ArrowUp': moved = moveUp(); break;
            case 'ArrowDown': moved = moveDown(); break;
            case 'ArrowLeft': moved = moveLeft(); break;
            case 'ArrowRight': moved = moveRight(); break;
            default: return;
        }
        if (moved) {
            addRandomTile();
            renderBoard();
            if (isGameOver()) {
                gameOverMessage.classList.remove('hidden');
            }
        }
    }

    function moveLeft() {
        let moved = false;
        for (let i = 0; i < gridSize; i++) {
            const row = grid[i];
            const newRow = slide(row);
            const result = combine(newRow);
            grid[i] = result.row;
            score += result.score;
            if (JSON.stringify(row) !== JSON.stringify(grid[i])) {
                moved = true;
            }
        }
        updateBestScore();
        return moved;
    }

    function moveRight() {
        let moved = false;
        for (let i = 0; i < gridSize; i++) {
            const row = grid[i].slice().reverse();
            const newRow = slide(row);
            const result = combine(newRow);
            grid[i] = result.row.reverse();
            score += result.score;
            if (JSON.stringify(row.reverse()) !== JSON.stringify(grid[i])) {
                moved = true;
            }
        }
        updateBestScore();
        return moved;
    }

    function moveUp() {
        let moved = false;
        const transposed = transpose(grid);
        for (let i = 0; i < gridSize; i++) {
            const row = transposed[i];
            const newRow = slide(row);
            const result = combine(newRow);
            transposed[i] = result.row;
            score += result.score;
            if (JSON.stringify(row) !== JSON.stringify(transposed[i])) {
                moved = true;
            }
        }
        grid = transpose(transposed);
        updateBestScore();
        return moved;
    }

    function moveDown() {
        let moved = false;
        const transposed = transpose(grid);
        for (let i = 0; i < gridSize; i++) {
            const row = transposed[i].slice().reverse();
            const newRow = slide(row);
            const result = combine(newRow);
            transposed[i] = result.row.reverse();
            score += result.score;
            if (JSON.stringify(row.reverse()) !== JSON.stringify(transposed[i])) {
                moved = true;
            }
        }
        grid = transpose(transposed);
        updateBestScore();
        return moved;
    }

    function slide(row) {
        let newRow = row.filter(val => val);
        let zeros = Array(gridSize - newRow.length).fill(0);
        return newRow.concat(zeros);
    }

    function combine(row) {
        let newScore = 0;
        for (let i = 0; i < gridSize - 1; i++) {
            if (row[i] !== 0 && row[i] === row[i + 1]) {
                row[i] *= 2;
                newScore += row[i];
                row[i + 1] = 0;
            }
        }
        return { row: slide(row), score: newScore };
    }

    function transpose(matrix) {
        return matrix[0].map((col, i) => matrix.map(row => row[i]));
    }

    function isGameOver() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === 0) return false; // empty cell
                if (i < gridSize - 1 && grid[i][j] === grid[i + 1][j]) return false; // can merge down
                if (j < gridSize - 1 && grid[i][j] === grid[i][j + 1]) return false; // can merge right
            }
        }
        return true;
    }

    function updateBestScore() {
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('2048-bestScore', bestScore);
        }
        bestScoreElement.textContent = bestScore;
    }

    document.addEventListener('keydown', handleInput);
    restartButton.addEventListener('click', init);

    init();
});
