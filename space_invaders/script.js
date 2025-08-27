class SpaceInvadersGame {
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

        // Player
        this.player = {
            x: this.canvas.width / 2 - 20,
            y: this.canvas.height - 60,
            width: 40,
            height: 30,
            speed: 5
        };

        // Bullets
        this.bullets = [];
        this.enemyBullets = [];
        this.bulletSpeed = 7;
        this.enemyBulletSpeed = 3;

        // Invaders
        this.invaders = [];
        this.invaderSpeed = 1;
        this.invaderDirection = 1;
        this.invaderDropDistance = 20;

        // Input handling
        this.keys = {};
        this.canShoot = true;
        this.shootCooldown = 250; // milliseconds

        // Game timing
        this.lastTime = 0;
        this.invaderMoveTimer = 0;
        this.invaderMoveInterval = 500; // milliseconds
        this.enemyShootTimer = 0;
        this.enemyShootInterval = 1000;

        this.setupEventListeners();
        this.init();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.gameRunning && !this.paused) {
                    this.shoot();
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

        this.restartBtn.addEventListener('click', () => {
            this.restart();
        });
    }

    init() {
        this.createInvaders();
        this.gameRunning = true;
        this.gameLoop();
    }

    createInvaders() {
        this.invaders = [];
        const rows = 5;
        const cols = 10;
        const invaderWidth = 30;
        const invaderHeight = 20;
        const spacing = 10;
        const startX = 50;
        const startY = 50;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                this.invaders.push({
                    x: startX + col * (invaderWidth + spacing),
                    y: startY + row * (invaderHeight + spacing),
                    width: invaderWidth,
                    height: invaderHeight,
                    type: row < 2 ? 'small' : row < 4 ? 'medium' : 'large',
                    points: row < 2 ? 30 : row < 4 ? 20 : 10
                });
            }
        }
    }

    update(deltaTime) {
        if (!this.gameRunning || this.paused) return;

        // Player movement
        if (this.keys['ArrowLeft'] && this.player.x > 0) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['ArrowRight'] && this.player.x < this.canvas.width - this.player.width) {
            this.player.x += this.player.speed;
        }

        // Update bullets
        this.bullets.forEach((bullet, index) => {
            bullet.y -= this.bulletSpeed;
            if (bullet.y < 0) {
                this.bullets.splice(index, 1);
            }
        });

        // Update enemy bullets
        this.enemyBullets.forEach((bullet, index) => {
            bullet.y += this.enemyBulletSpeed;
            if (bullet.y > this.canvas.height) {
                this.enemyBullets.splice(index, 1);
            }
        });

        // Move invaders
        this.invaderMoveTimer += deltaTime;
        if (this.invaderMoveTimer >= this.invaderMoveInterval) {
            this.moveInvaders();
            this.invaderMoveTimer = 0;
        }

        // Enemy shooting
        this.enemyShootTimer += deltaTime;
        if (this.enemyShootTimer >= this.enemyShootInterval) {
            this.enemyShoot();
            this.enemyShootTimer = 0;
        }

        // Collision detection
        this.checkCollisions();

        // Check win/lose conditions
        if (this.invaders.length === 0) {
            this.nextLevel();
        }

        if (this.lives <= 0) {
            this.endGame(false);
        }

        // Check if invaders reached the bottom
        const lowestInvader = Math.max(...this.invaders.map(inv => inv.y));
        if (lowestInvader + 20 >= this.player.y) {
            this.endGame(false);
        }
    }

    moveInvaders() {
        let shouldDrop = false;
        
        // Check if any invader hits the edge
        for (let invader of this.invaders) {
            if ((invader.x <= 0 && this.invaderDirection < 0) || 
                (invader.x >= this.canvas.width - invader.width && this.invaderDirection > 0)) {
                shouldDrop = true;
                break;
            }
        }

        if (shouldDrop) {
            // Drop down and change direction
            this.invaders.forEach(invader => {
                invader.y += this.invaderDropDistance;
            });
            this.invaderDirection *= -1;
            
            // Increase speed slightly
            this.invaderMoveInterval = Math.max(100, this.invaderMoveInterval - 10);
        } else {
            // Move horizontally
            this.invaders.forEach(invader => {
                invader.x += this.invaderSpeed * this.invaderDirection;
            });
        }
    }

    enemyShoot() {
        if (this.invaders.length === 0) return;

        // Get bottom row invaders
        const bottomInvaders = this.invaders.filter(invader => {
            return !this.invaders.some(other => 
                other.x === invader.x && other.y > invader.y
            );
        });

        if (bottomInvaders.length > 0) {
            const shooter = bottomInvaders[Math.floor(Math.random() * bottomInvaders.length)];
            this.enemyBullets.push({
                x: shooter.x + shooter.width / 2 - 2,
                y: shooter.y + shooter.height,
                width: 4,
                height: 8
            });
        }
    }

    shoot() {
        if (this.canShoot) {
            this.bullets.push({
                x: this.player.x + this.player.width / 2 - 2,
                y: this.player.y,
                width: 4,
                height: 8
            });
            
            this.playSound(800, 0.1);
            this.canShoot = false;
            
            setTimeout(() => {
                this.canShoot = true;
            }, this.shootCooldown);
        }
    }

    checkCollisions() {
        // Bullet vs Invaders
        this.bullets.forEach((bullet, bulletIndex) => {
            this.invaders.forEach((invader, invaderIndex) => {
                if (this.isColliding(bullet, invader)) {
                    this.score += invader.points;
                    this.scoreEl.textContent = this.score;
                    this.playSound(400, 0.2);
                    
                    this.bullets.splice(bulletIndex, 1);
                    this.invaders.splice(invaderIndex, 1);
                }
            });
        });

        // Enemy bullets vs Player
        this.enemyBullets.forEach((bullet, bulletIndex) => {
            if (this.isColliding(bullet, this.player)) {
                this.lives--;
                this.livesEl.textContent = this.lives;
                this.playSound(200, 0.3);
                
                this.enemyBullets.splice(bulletIndex, 1);
                
                if (this.lives > 0) {
                    // Brief invincibility
                    this.paused = true;
                    setTimeout(() => {
                        this.paused = false;
                    }, 1000);
                }
            }
        });
    }

    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    nextLevel() {
        this.level++;
        this.levelEl.textContent = this.level;
        this.createInvaders();
        this.invaderMoveInterval = Math.max(200, 500 - (this.level * 50));
        this.enemyShootInterval = Math.max(500, 1000 - (this.level * 100));
        this.playSound(600, 0.5);
    }

    togglePause() {
        if (this.gameRunning) {
            this.paused = !this.paused;
        }
    }

    endGame(won) {
        this.gameRunning = false;
        this.gameOverTextEl.textContent = won ? '¡VICTORIA!' : 'GAME OVER';
        this.finalScoreEl.textContent = `Puntuación Final: ${this.score}`;
        this.gameOverEl.classList.remove('hidden');
        this.playSound(won ? 800 : 200, 0.8);
    }

    restart() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.scoreEl.textContent = '0';
        this.livesEl.textContent = '3';
        this.levelEl.textContent = '1';
        this.gameOverEl.classList.add('hidden');
        
        this.player.x = this.canvas.width / 2 - 20;
        this.bullets = [];
        this.enemyBullets = [];
        this.invaderSpeed = 1;
        this.invaderDirection = 1;
        this.invaderMoveInterval = 500;
        this.enemyShootInterval = 1000;
        
        this.createInvaders();
        this.gameRunning = true;
        this.paused = false;
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw stars
        this.drawStars();

        // Draw player
        this.ctx.fillStyle = '#00ff00';
        this.drawPlayer();

        // Draw bullets
        this.ctx.fillStyle = '#ffff00';
        this.bullets.forEach(bullet => {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        // Draw enemy bullets
        this.ctx.fillStyle = '#ff0000';
        this.enemyBullets.forEach(bullet => {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        // Draw invaders
        this.invaders.forEach(invader => {
            this.drawInvader(invader);
        });

        // Draw pause message
        if (this.paused && this.gameRunning) {
            this.ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
            this.ctx.font = '20px "Press Start 2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSADO', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.fillText('P para continuar', this.canvas.width / 2, this.canvas.height / 2 + 40);
        }
    }

    drawStars() {
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) {
            const x = (i * 37) % this.canvas.width;
            const y = (i * 73) % this.canvas.height;
            this.ctx.fillRect(x, y, 1, 1);
        }
    }

    drawPlayer() {
        const p = this.player;
        this.ctx.fillRect(p.x + 10, p.y, 20, 10);
        this.ctx.fillRect(p.x, p.y + 10, 40, 20);
        this.ctx.fillRect(p.x + 15, p.y - 5, 10, 5);
    }

    drawInvader(invader) {
        const colors = {
            small: '#ff00ff',
            medium: '#00ffff',
            large: '#ffff00'
        };
        
        this.ctx.fillStyle = colors[invader.type];
        
        // Simple invader shape
        const x = invader.x;
        const y = invader.y;
        const w = invader.width;
        const h = invader.height;
        
        // Body
        this.ctx.fillRect(x + 5, y, w - 10, h - 5);
        this.ctx.fillRect(x, y + 5, w, h - 10);
        
        // Antennae
        this.ctx.fillRect(x + 2, y - 2, 3, 7);
        this.ctx.fillRect(x + w - 5, y - 2, 3, 7);
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

    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpaceInvadersGame();
});