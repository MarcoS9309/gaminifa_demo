class BreakoutGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreEl = document.getElementById('score');
        this.livesEl = document.getElementById('lives');
        this.levelEl = document.getElementById('level');
        this.gameOverEl = document.getElementById('game-over');
        this.gameOverTextEl = document.getElementById('game-over-text');
        this.finalScoreEl = document.getElementById('final-score');
        this.restartBtn = document.getElementById('restart-btn');

        // Game state
        this.gameRunning = false;
        this.paused = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.ballLaunched = false;

        // Paddle
        this.paddle = {
            x: this.canvas.width / 2 - 50,
            y: this.canvas.height - 30,
            width: 100,
            height: 15,
            speed: 8
        };

        // Ball
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 50,
            radius: 8,
            vx: 5,
            vy: -5,
            speed: 5
        };

        // Bricks
        this.bricks = [];
        this.brickRows = 8;
        this.brickCols = 14;
        this.brickWidth = 50;
        this.brickHeight = 20;
        this.brickPadding = 5;
        this.brickOffsetTop = 60;
        this.brickOffsetLeft = 30;

        // Input handling
        this.keys = {};
        this.mouseX = this.canvas.width / 2;

        // Power-ups
        this.powerUps = [];

        this.setupEventListeners();
        this.init();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'Space') {
                e.preventDefault();
                if (!this.ballLaunched && this.gameRunning && !this.paused) {
                    this.launchBall();
                }
            }
            
            if (e.code === 'KeyP') {
                e.preventDefault();
                this.togglePause();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
        });

        this.restartBtn.addEventListener('click', () => {
            this.restart();
        });
    }

    init() {
        this.createBricks();
        this.resetBall();
        this.gameRunning = true;
        this.gameLoop();
    }

    createBricks() {
        this.bricks = [];
        const colors = ['#ff0000', '#ff8800', '#ffff00', '#88ff00', '#00ff88', '#0088ff', '#8800ff', '#ff0088'];
        
        for (let r = 0; r < this.brickRows; r++) {
            for (let c = 0; c < this.brickCols; c++) {
                this.bricks.push({
                    x: c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft,
                    y: r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop,
                    width: this.brickWidth,
                    height: this.brickHeight,
                    color: colors[r],
                    points: (this.brickRows - r) * 10,
                    visible: true
                });
            }
        }
    }

    resetBall() {
        this.ball.x = this.paddle.x + this.paddle.width / 2;
        this.ball.y = this.paddle.y - this.ball.radius - 5;
        this.ball.vx = 0;
        this.ball.vy = 0;
        this.ballLaunched = false;
    }

    launchBall() {
        const angle = (Math.random() - 0.5) * Math.PI / 3; // -30° to 30°
        this.ball.vx = Math.sin(angle) * this.ball.speed;
        this.ball.vy = -Math.cos(angle) * this.ball.speed;
        this.ballLaunched = true;
        this.playSound(440, 0.1);
    }

    update() {
        if (!this.gameRunning || this.paused) return;

        // Paddle movement
        if (this.keys['ArrowLeft'] && this.paddle.x > 0) {
            this.paddle.x -= this.paddle.speed;
        }
        if (this.keys['ArrowRight'] && this.paddle.x < this.canvas.width - this.paddle.width) {
            this.paddle.x += this.paddle.speed;
        }

        // Mouse control
        if (this.mouseX >= 0 && this.mouseX <= this.canvas.width) {
            this.paddle.x = this.mouseX - this.paddle.width / 2;
            this.paddle.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, this.paddle.x));
        }

        // If ball not launched, keep it attached to paddle
        if (!this.ballLaunched) {
            this.ball.x = this.paddle.x + this.paddle.width / 2;
            return;
        }

        // Ball movement
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;

        // Ball collision with walls
        if (this.ball.x <= this.ball.radius || this.ball.x >= this.canvas.width - this.ball.radius) {
            this.ball.vx = -this.ball.vx;
            this.playSound(220, 0.1);
        }

        if (this.ball.y <= this.ball.radius) {
            this.ball.vy = -this.ball.vy;
            this.playSound(220, 0.1);
        }

        // Ball collision with paddle
        if (this.ball.y + this.ball.radius >= this.paddle.y &&
            this.ball.x >= this.paddle.x &&
            this.ball.x <= this.paddle.x + this.paddle.width &&
            this.ball.vy > 0) {
            
            // Calculate bounce angle based on where ball hits paddle
            const hitPoint = (this.ball.x - this.paddle.x) / this.paddle.width;
            const angle = (hitPoint - 0.5) * Math.PI / 3; // -60° to 60°
            
            const speed = Math.sqrt(this.ball.vx * this.ball.vx + this.ball.vy * this.ball.vy);
            this.ball.vx = Math.sin(angle) * speed;
            this.ball.vy = -Math.abs(Math.cos(angle) * speed);
            
            this.playSound(330, 0.1);
        }

        // Ball collision with bricks
        this.bricks.forEach((brick, index) => {
            if (brick.visible && this.isCollidingWithBrick(this.ball, brick)) {
                brick.visible = false;
                this.score += brick.points;
                this.scoreEl.textContent = this.score;
                
                // Determine collision side and bounce accordingly
                const ballCenterX = this.ball.x;
                const ballCenterY = this.ball.y;
                const brickCenterX = brick.x + brick.width / 2;
                const brickCenterY = brick.y + brick.height / 2;
                
                const dx = ballCenterX - brickCenterX;
                const dy = ballCenterY - brickCenterY;
                
                if (Math.abs(dx / brick.width) > Math.abs(dy / brick.height)) {
                    this.ball.vx = -this.ball.vx;
                } else {
                    this.ball.vy = -this.ball.vy;
                }
                
                this.playSound(550, 0.15);
                
                // Create particle effect
                this.createParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);
                
                // Random power-up chance
                if (Math.random() < 0.1) {
                    this.createPowerUp(brick.x + brick.width / 2, brick.y + brick.height / 2);
                }
            }
        });

        // Update power-ups
        this.powerUps.forEach((powerUp, index) => {
            powerUp.y += 2;
            
            // Check collision with paddle
            if (powerUp.y + powerUp.height >= this.paddle.y &&
                powerUp.x + powerUp.width >= this.paddle.x &&
                powerUp.x <= this.paddle.x + this.paddle.width) {
                
                this.activatePowerUp(powerUp.type);
                this.powerUps.splice(index, 1);
            }
            
            // Remove if off screen
            if (powerUp.y > this.canvas.height) {
                this.powerUps.splice(index, 1);
            }
        });

        // Check if ball is lost
        if (this.ball.y > this.canvas.height) {
            this.lives--;
            this.livesEl.textContent = this.lives;
            this.playSound(150, 0.5);
            
            if (this.lives > 0) {
                this.resetBall();
            } else {
                this.endGame(false);
            }
        }

        // Check if all bricks are destroyed
        const visibleBricks = this.bricks.filter(brick => brick.visible);
        if (visibleBricks.length === 0) {
            this.nextLevel();
        }
    }

    isCollidingWithBrick(ball, brick) {
        if (!brick.visible) return false;
        
        const closestX = Math.max(brick.x, Math.min(ball.x, brick.x + brick.width));
        const closestY = Math.max(brick.y, Math.min(ball.y, brick.y + brick.height));
        
        const dx = ball.x - closestX;
        const dy = ball.y - closestY;
        
        return (dx * dx + dy * dy) < (ball.radius * ball.radius);
    }

    createParticles(x, y, color) {
        // Simple particle effect - could be expanded
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.ctx.fillStyle = color;
                this.ctx.fillRect(
                    x + (Math.random() - 0.5) * 30,
                    y + (Math.random() - 0.5) * 30,
                    3, 3
                );
            }, i * 50);
        }
    }

    createPowerUp(x, y) {
        const types = ['wider', 'faster', 'points'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        this.powerUps.push({
            x: x - 15,
            y: y,
            width: 30,
            height: 15,
            type: type
        });
    }

    activatePowerUp(type) {
        this.playSound(700, 0.3);
        
        switch (type) {
            case 'wider':
                this.paddle.width = Math.min(150, this.paddle.width + 20);
                setTimeout(() => {
                    this.paddle.width = Math.max(80, this.paddle.width - 20);
                }, 10000);
                break;
            case 'faster':
                this.ball.speed += 1;
                break;
            case 'points':
                this.score += 100;
                this.scoreEl.textContent = this.score;
                break;
        }
    }

    nextLevel() {
        this.level++;
        this.levelEl.textContent = this.level;
        this.ball.speed += 0.5;
        this.createBricks();
        this.resetBall();
        this.playSound(800, 0.5);
    }

    togglePause() {
        if (this.gameRunning) {
            this.paused = !this.paused;
        }
    }

    endGame(won) {
        this.gameRunning = false;
        this.gameOverTextEl.textContent = won ? '¡VICTORIA TOTAL!' : 'GAME OVER';
        this.finalScoreEl.textContent = `Puntuación Final: ${this.score}`;
        this.gameOverEl.classList.remove('hidden');
        this.playSound(won ? 1000 : 200, 1);
    }

    restart() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.scoreEl.textContent = '0';
        this.livesEl.textContent = '3';
        this.levelEl.textContent = '1';
        this.gameOverEl.classList.add('hidden');
        
        this.paddle.width = 100;
        this.ball.speed = 5;
        this.powerUps = [];
        
        this.createBricks();
        this.resetBall();
        this.gameRunning = true;
        this.paused = false;
    }

    draw() {
        // Clear canvas with gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#000022');
        gradient.addColorStop(1, '#000044');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw stars
        this.drawStars();

        // Draw bricks
        this.bricks.forEach(brick => {
            if (brick.visible) {
                this.ctx.fillStyle = brick.color;
                this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                
                // Add shine effect
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.fillRect(brick.x, brick.y, brick.width, 3);
            }
        });

        // Draw paddle
        const paddleGradient = this.ctx.createLinearGradient(0, this.paddle.y, 0, this.paddle.y + this.paddle.height);
        paddleGradient.addColorStop(0, '#ffffff');
        paddleGradient.addColorStop(1, '#cccccc');
        this.ctx.fillStyle = paddleGradient;
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);

        // Draw ball
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Ball glow effect
        this.ctx.shadowColor = '#ffffff';
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        // Draw power-ups
        this.powerUps.forEach(powerUp => {
            const colors = {
                wider: '#00ff00',
                faster: '#ff0080',
                points: '#ffff00'
            };
            
            this.ctx.fillStyle = colors[powerUp.type];
            this.ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
            
            // Power-up text
            this.ctx.fillStyle = '#000';
            this.ctx.font = '8px "Press Start 2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(powerUp.type.charAt(0).toUpperCase(), powerUp.x + powerUp.width / 2, powerUp.y + 10);
        });

        // Draw instructions if ball not launched
        if (!this.ballLaunched && this.gameRunning && !this.paused) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.font = '16px "Press Start 2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('ESPACIO PARA LANZAR', this.canvas.width / 2, this.canvas.height / 2);
        }

        // Draw pause message
        if (this.paused && this.gameRunning) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.font = '20px "Press Start 2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSADO', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.fillText('P para continuar', this.canvas.width / 2, this.canvas.height / 2 + 40);
        }
    }

    drawStars() {
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 30; i++) {
            const x = (i * 47) % this.canvas.width;
            const y = (i * 83) % this.canvas.height;
            const size = (i % 3) + 1;
            this.ctx.fillRect(x, y, size, size);
        }
    }

    playSound(frequency, duration) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'square';

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
            // Silent fail if Web Audio API is not available
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BreakoutGame();
});