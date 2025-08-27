class PongGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.playerScoreEl = document.getElementById('player-score');
        this.computerScoreEl = document.getElementById('computer-score');
        this.gameOverEl = document.getElementById('game-over');
        this.winnerTextEl = document.getElementById('winner-text');
        this.restartBtn = document.getElementById('restart-btn');

        // Game state
        this.gameRunning = false;
        this.paused = false;
        this.playerScore = 0;
        this.computerScore = 0;
        this.winningScore = 10;

        // Ball properties
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            vx: 5,
            vy: 3,
            radius: 8,
            speed: 5
        };

        // Paddle properties
        this.paddleHeight = 80;
        this.paddleWidth = 10;
        
        this.playerPaddle = {
            x: 20,
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            width: this.paddleWidth,
            height: this.paddleHeight,
            speed: 6
        };

        this.computerPaddle = {
            x: this.canvas.width - 30,
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            width: this.paddleWidth,
            height: this.paddleHeight,
            speed: 4
        };

        // Input handling
        this.keys = {};
        this.setupEventListeners();
        this.init();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePause();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        this.restartBtn.addEventListener('click', () => {
            this.restart();
        });
    }

    init() {
        this.resetBall();
        this.gameRunning = true;
        this.gameLoop();
    }

    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        
        // Random direction
        const angle = (Math.random() - 0.5) * Math.PI / 3; // -30° to 30°
        const direction = Math.random() > 0.5 ? 1 : -1;
        
        this.ball.vx = Math.cos(angle) * this.ball.speed * direction;
        this.ball.vy = Math.sin(angle) * this.ball.speed;
    }

    update() {
        if (!this.gameRunning || this.paused) return;

        // Player paddle movement
        if (this.keys['ArrowUp'] && this.playerPaddle.y > 0) {
            this.playerPaddle.y -= this.playerPaddle.speed;
        }
        if (this.keys['ArrowDown'] && this.playerPaddle.y < this.canvas.height - this.paddleHeight) {
            this.playerPaddle.y += this.playerPaddle.speed;
        }

        // Computer AI
        const paddleCenter = this.computerPaddle.y + this.paddleHeight / 2;
        const ballY = this.ball.y;
        
        if (paddleCenter < ballY - 35) {
            this.computerPaddle.y += this.computerPaddle.speed;
        } else if (paddleCenter > ballY + 35) {
            this.computerPaddle.y -= this.computerPaddle.speed;
        }

        // Keep computer paddle in bounds
        this.computerPaddle.y = Math.max(0, Math.min(this.canvas.height - this.paddleHeight, this.computerPaddle.y));

        // Ball movement
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;

        // Ball collision with top/bottom walls
        if (this.ball.y <= this.ball.radius || this.ball.y >= this.canvas.height - this.ball.radius) {
            this.ball.vy = -this.ball.vy;
            this.playSound(220, 0.1);
        }

        // Ball collision with player paddle
        if (this.ball.x <= this.playerPaddle.x + this.playerPaddle.width + this.ball.radius &&
            this.ball.y >= this.playerPaddle.y &&
            this.ball.y <= this.playerPaddle.y + this.playerPaddle.height &&
            this.ball.vx < 0) {
            
            this.ball.vx = -this.ball.vx;
            
            // Add spin based on where the ball hits the paddle
            const hitPoint = (this.ball.y - this.playerPaddle.y) / this.playerPaddle.height;
            this.ball.vy = (hitPoint - 0.5) * 8;
            
            // Increase speed slightly
            this.ball.vx *= 1.05;
            this.ball.vy *= 1.05;
            
            this.playSound(440, 0.1);
        }

        // Ball collision with computer paddle
        if (this.ball.x >= this.computerPaddle.x - this.ball.radius &&
            this.ball.y >= this.computerPaddle.y &&
            this.ball.y <= this.computerPaddle.y + this.computerPaddle.height &&
            this.ball.vx > 0) {
            
            this.ball.vx = -this.ball.vx;
            
            // Add spin
            const hitPoint = (this.ball.y - this.computerPaddle.y) / this.computerPaddle.height;
            this.ball.vy = (hitPoint - 0.5) * 8;
            
            // Increase speed slightly
            this.ball.vx *= 1.05;
            this.ball.vy *= 1.05;
            
            this.playSound(440, 0.1);
        }

        // Scoring
        if (this.ball.x < 0) {
            this.computerScore++;
            this.computerScoreEl.textContent = this.computerScore;
            this.playSound(150, 0.3);
            this.resetBall();
            this.checkGameEnd();
        } else if (this.ball.x > this.canvas.width) {
            this.playerScore++;
            this.playerScoreEl.textContent = this.playerScore;
            this.playSound(600, 0.3);
            this.resetBall();
            this.checkGameEnd();
        }
    }

    checkGameEnd() {
        if (this.playerScore >= this.winningScore) {
            this.endGame('¡GANASTE!');
        } else if (this.computerScore >= this.winningScore) {
            this.endGame('¡PERDISTE!');
        }
    }

    endGame(message) {
        this.gameRunning = false;
        this.winnerTextEl.textContent = message;
        this.gameOverEl.classList.remove('hidden');
        this.playSound(message.includes('GANASTE') ? 800 : 200, 0.5);
    }

    togglePause() {
        if (this.gameRunning) {
            this.paused = !this.paused;
        }
    }

    restart() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.playerScoreEl.textContent = '0';
        this.computerScoreEl.textContent = '0';
        this.gameOverEl.classList.add('hidden');
        this.ball.speed = 5;
        this.resetBall();
        this.gameRunning = true;
        this.paused = false;
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw center line
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Draw paddles
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(this.playerPaddle.x, this.playerPaddle.y, this.playerPaddle.width, this.playerPaddle.height);
        this.ctx.fillRect(this.computerPaddle.x, this.computerPaddle.y, this.computerPaddle.width, this.computerPaddle.height);

        // Draw ball
        this.ctx.fillStyle = '#00ff00';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw ball trail
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x - this.ball.vx, this.ball.y - this.ball.vy, this.ball.radius * 0.7, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw pause message
        if (this.paused) {
            this.ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
            this.ctx.font = '20px "Press Start 2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSADO', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.fillText('ESPACIO para continuar', this.canvas.width / 2, this.canvas.height / 2 + 40);
        }
    }

    playSound(frequency, duration) {
        // Simple Web Audio API sound generation
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
    new PongGame();
});