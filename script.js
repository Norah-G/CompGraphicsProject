// script.js - Main game logic

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const CELL_SIZE = 40;
const rows = HEIGHT / CELL_SIZE; // 15
const cols = WIDTH / CELL_SIZE;  // 20

// Maze (15x20), 1=wall, 0=path
const MAZE = [
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,1],
[1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
[1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,1],
[1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1],
[1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0,1],
[1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,0,1],
[1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
[1,0,0,0,1,0,1,1,1,0,1,1,1,0,1,0,0,0,0,1],
[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,0,1],
[1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,1],
[1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Pellets
let pellets = [];

// Pac-Man properties: start in pixels at cell (1,1)
let pacman = {
    x: 1*CELL_SIZE + CELL_SIZE/2,
    y: 1*CELL_SIZE + CELL_SIZE/2,
    radius: CELL_SIZE/2 - 5,
    speed: 2,
    directionX: 0,
    directionY: 0
};

class Ghost {
    constructor(row, col, speed) {
        this.row = row;
        this.col = col;
        this.radius = CELL_SIZE/2 - 5;
        this.speed = speed; 
        this.targetRow = row;
        this.targetCol = col;
        this.x = this.col*CELL_SIZE + CELL_SIZE/2;
        this.y = this.row*CELL_SIZE + CELL_SIZE/2;
    }

    update() {
        let targetX = this.targetCol*CELL_SIZE + CELL_SIZE/2;
        let targetY = this.targetRow*CELL_SIZE + CELL_SIZE/2;

        let dx = targetX - this.x;
        let dy = targetY - this.y;
        let dist = Math.hypot(dx, dy);

        if (dist < this.speed) {
            this.x = targetX;
            this.y = targetY;
            this.row = this.targetRow;
            this.col = this.targetCol;
            this.chooseDirection();
        } else {
            this.x += (dx/dist)*this.speed;
            this.y += (dy/dist)*this.speed;
        }
    }

    chooseDirection() {
        const targetRow = Math.floor(pacman.y / CELL_SIZE);
        const targetCol = Math.floor(pacman.x / CELL_SIZE);

        let directions = [];
        let dRow = targetRow - this.row;
        let dCol = targetCol - this.col;

        // Preferred directions towards pacman
        if (dRow < 0) directions.push({dx:0, dy:-1});
        else if (dRow > 0) directions.push({dx:0, dy:1});
        if (dCol < 0) directions.push({dx:-1, dy:0});
        else if (dCol > 0) directions.push({dx:1,dy:0});

        // Ensure all directions are considered if not included
        let allDirs = [{dx:0,dy:-1},{dx:0,dy:1},{dx:-1,dy:0},{dx:1,dy:0}];
        for (let dir of allDirs) {
            if (!directions.find(d=>d.dx===dir.dx && d.dy===dir.dy))
                directions.push(dir);
        }

        // Try directions in order
        let chosen = false;
        for (let dir of directions) {
            let newR = this.row + dir.dy;
            let newC = this.col + dir.dx;
            if (isValidCell(newR,newC)) {
                this.targetRow = newR;
                this.targetCol = newC;
                chosen = true;
                break;
            }
        }

        // If no direction found, randomly pick any open direction
        if (!chosen) {
            let validDirs = allDirs.filter(dir => {
                let newR = this.row + dir.dy;
                let newC = this.col + dir.dx;
                return isValidCell(newR,newC);
            });

            if (validDirs.length > 0) {
                let randomDir = validDirs[Math.floor(Math.random()*validDirs.length)];
                this.targetRow = this.row + randomDir.dy;
                this.targetCol = this.col + randomDir.dx;
            } else {
                // If absolutely no direction is open, stay put
                this.targetRow = this.row;
                this.targetCol = this.col;
            }
        }
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
    }
}

let score = 0;
let running = false;
let ghostSpeed = 1.5;
let ghosts = [];

function initializePellets() {
    pellets = [];
    for (let r=0; r<rows; r++) {
        for (let c=0; c<cols; c++) {
            if (MAZE[r][c] === 0) {
                pellets.push({
                    x: c*CELL_SIZE + CELL_SIZE/2,
                    y: r*CELL_SIZE + CELL_SIZE/2,
                    radius: 4
                });
            }
        }
    }
}

function drawMaze() {
    let grad = ctx.createLinearGradient(0,0,WIDTH,HEIGHT);
    grad.addColorStop(0, '#00072B');
    grad.addColorStop(1, '#00044A');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,WIDTH,HEIGHT);

    ctx.fillStyle = '#202040';
    for (let r=0; r<rows; r++) {
        for (let c=0; c<cols; c++) {
            if (MAZE[r][c] === 1) {
                ctx.fillRect(c*CELL_SIZE, r*CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    ctx.fillStyle = '#FFC0CB';
    for (let p of pellets) {
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
        ctx.fill();
    }
}

function drawPacman() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, pacman.radius, 0, Math.PI*2);
    ctx.fill();
}

function eatPellets() {
    for (let i=pellets.length-1; i>=0; i--) {
        let p = pellets[i];
        let dist = Math.hypot(pacman.x - p.x, pacman.y - p.y);
        if (dist < pacman.radius + p.radius) {
            pellets.splice(i,1);
            score++;
        }
    }
}

function checkWin() {
    if (pellets.length === 0) {
        running = false;
        stopMusic();
        showEndMessage('You Win! Score: ' + score);
    }
}

function checkGhostCollision() {
    for (let g of ghosts) {
        let dist = Math.hypot(pacman.x - g.x, pacman.y - g.y);
        if (dist < pacman.radius + g.radius) {
            return true;
        }
    }
    return false;
}

function updatePacman() {
    if (pacman.directionX !== 0 || pacman.directionY !== 0) {
        let moveX = pacman.directionX * pacman.speed;
        let moveY = pacman.directionY * pacman.speed;

        let newX = pacman.x + moveX;
        let newY = pacman.y + moveY;

        let newCol = Math.floor(newX / CELL_SIZE);
        let newRow = Math.floor(newY / CELL_SIZE);

        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols || MAZE[newRow][newCol] === 1) {
            // hit wall, don't move
            return;
        }

        pacman.x = newX;
        pacman.y = newY;
    }
}

function isValidCell(r,c) {
    return r>=0 && r<rows && c>=0 && c<cols && MAZE[r][c]===0;
}

function gameLoop() {
    if (!running) return;

    updatePacman();
    eatPellets();

    for (let g of ghosts) {
        g.update();
    }

    ctx.clearRect(0,0,WIDTH,HEIGHT);
    drawMaze();
    drawPacman();
    for (let g of ghosts) {
        g.draw();
    }

    drawScore();

    if (checkGhostCollision()) {
        running = false;
        stopMusic();
        showEndMessage('Game Over! Score: ' + score);
        return;
    }

    checkWin();
    requestAnimationFrame(gameLoop);
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 20,30);
}

function showEndMessage(message) {
    const tryAgainButton = document.getElementById('try-again');
    tryAgainButton.style.display = 'inline-block';

    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.fillText(message, WIDTH/2 - 150, HEIGHT/2);
}

function resetGame(difficulty) {
    score = 0;
    pacman.x = 1*CELL_SIZE + CELL_SIZE/2;
    pacman.y = 1*CELL_SIZE + CELL_SIZE/2;
    pacman.directionX = 0;
    pacman.directionY = 0;

    initializePellets();

    let ghostCount;
    if (difficulty === 'easy') {
        ghostSpeed = 1.0;
        ghostCount = 1;
    } else if (difficulty === 'medium') {
        ghostSpeed = 1.5;
        ghostCount = 2;
    } else {
        ghostSpeed = 2.0;
        ghostCount = 3;
    }

    pacman.speed = ghostSpeed;

    let ghostPositions = [
        {r:5,c:10},
        {r:8,c:15},
        {r:3,c:15}
    ];
    ghosts = [];
    for (let i=0; i<ghostCount; i++) {
        let pos = ghostPositions[i];
        let ghost = new Ghost(pos.r, pos.c, ghostSpeed);
        ghost.targetRow = pos.r;
        ghost.targetCol = pos.c;
        ghosts.push(ghost);
    }

    const tryAgainButton = document.getElementById('try-again');
    tryAgainButton.style.display = 'none';
    running = true;
    startMusic();
    gameLoop();
}

let keysPressed = {};

document.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;

    if (keysPressed['ArrowUp']) {
        pacman.directionX = 0;
        pacman.directionY = -1;
    } else if (keysPressed['ArrowDown']) {
        pacman.directionX = 0;
        pacman.directionY = 1;
    } else if (keysPressed['ArrowLeft']) {
        pacman.directionX = -1;
        pacman.directionY = 0;
    } else if (keysPressed['ArrowRight']) {
        pacman.directionX = 1;
        pacman.directionY = 0;
    }
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;

    // If releasing the key matches the current direction, stop moving
    if ((e.key === 'ArrowUp' && pacman.directionY === -1) ||
        (e.key === 'ArrowDown' && pacman.directionY === 1) ||
        (e.key === 'ArrowLeft' && pacman.directionX === -1) ||
        (e.key === 'ArrowRight' && pacman.directionX === 1)) {
        pacman.directionX = 0;
        pacman.directionY = 0;
    }
});

document.getElementById('start-button').addEventListener('click', () => {
    let difficulty = document.getElementById('difficulty').value;
    resetGame(difficulty);
});

document.getElementById('try-again').addEventListener('click', () => {
    let difficulty = document.getElementById('difficulty').value;
    resetGame(difficulty);
});
