const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const CELL_SIZE = 40;
const cols = Math.floor(WIDTH / CELL_SIZE);
const rows = Math.floor(HEIGHT / CELL_SIZE);

const WHITE = 'rgb(255, 255, 255)';
const BLACK = 'rgb(0, 0, 0)';
const WALL_COLOR = 'rgb(50, 50, 50)';  // Dark Gray for walls

let score = 0;
let running = true;
let direction = "RIGHT";  // Initial direction

// Maze Layout (1 = wall, 0 = open space)
let MAZE = Array.from({ length: rows }, () => Array(cols).fill(0));

// Add walls (1) around the border of the maze and create random obstacles inside
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        if (row === 0 || col === 0 || row === rows - 1 || col === cols - 1) {
            MAZE[row][col] = 1;  // Border walls
        } else if (Math.random() < 0.15) {
            MAZE[row][col] = 1;  // Random wall density (15%)
        }
    }
}

// Function to create gradient background
function createGradient() {
    let gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, 'rgb(135, 206, 250)');  // Light Sky Blue
    gradient.addColorStop(1, 'rgb(25, 25, 112)');  // Midnight Blue
    return gradient;
}

// Draw the maze layout
function drawMaze() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (MAZE[row][col] === 1) {
                ctx.fillStyle = WALL_COLOR;
                ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            } else {
                ctx.strokeStyle = BLACK;
                ctx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
}

// Class for Snake
class Snake {
    constructor(x, y, radius, velocity) {
        this.radius = radius;
        this.velocity = velocity;
        this.body = [{ x, y }];
        this.length = 1;
    }

    update() {
        let head = this.body[0];
        let newHead;

        if (direction === "UP") newHead = { x: head.x, y: head.y - this.velocity };
        if (direction === "DOWN") newHead = { x: head.x, y: head.y + this.velocity };
        if (direction === "LEFT") newHead = { x: head.x - this.velocity, y: head.y };
        if (direction === "RIGHT") newHead = { x: head.x + this.velocity, y: head.y };

        this.body.unshift(newHead);
        if (this.body.length > this.length) {
            this.body.pop();
        }
    }

    draw() {
        for (let segment of this.body) {
            ctx.fillStyle = 'green';
            ctx.beginPath();
            ctx.arc(segment.x, segment.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    checkWallCollision() {
        let head = this.body[0];
        let row = Math.floor(head.y / CELL_SIZE);
        let col = Math.floor(head.x / CELL_SIZE);

        if (row < 0 || row >= rows || col < 0 || col >= cols || MAZE[row][col] === 1) {
            return true;  // Snake collided with a wall or out of bounds
        }
        return false;
    }

    checkSelfCollision() {
        const [head, ...body] = this.body;
        return body.some(segment => segment.x === head.x && segment.y === head.y);
    }
}

// Class for Food
class Food {
    constructor(radius) {
        this.radius = radius;
        this.position = this.spawn();
    }

    spawn() {
        while (true) {
            let x = Math.floor(Math.random() * (cols - 2)) * CELL_SIZE + CELL_SIZE / 2;
            let y = Math.floor(Math.random() * (rows - 2)) * CELL_SIZE + CELL_SIZE / 2;

            let row = Math.floor(y / CELL_SIZE);
            let col = Math.floor(x / CELL_SIZE);

            if (MAZE[row][col] === 0) {
                return { x, y };  // Food placed in an open space
            }
        }
    }

    draw() {
        ctx.fillStyle = 'purple';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize the snake, food, and ghosts
let snake = new Snake(100, 100, 15, 2);  // Initial snake position and velocity
let food = new Food(10);  // Initial food size

// Draw text function
function drawText(text, x, y, color = 'white') {
    ctx.fillStyle = color;
    ctx.font = "36px Arial";
    ctx.fillText(text, x, y);
}

// Main game loop
function gameLoop() {
    if (!running) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = createGradient();
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    drawMaze();
    snake.update();
    snake.draw();
    food.draw();

    if (snake.checkWallCollision() || snake.checkSelfCollision()) {
        running = false;
        drawText("Game Over!", WIDTH / 2 - 100, HEIGHT / 2 - 50);
        return;
    }

    // Check for food collision
    let head = snake.body[0];
    let distance = Math.hypot(head.x - food.position.x, head.y - food.position.y);
    if (distance < snake.radius + food.radius) {
        score++;
        snake.length++;
        food.position = food.spawn();  // Spawn new food
    }

    document.getElementById("score").textContent = score;

    requestAnimationFrame(gameLoop);  // Loop the game
}

// Key event listener for controlling the snake
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== "DOWN") {
        direction = "UP";
    } else if (e.key === 'ArrowDown' && direction !== "UP") {
        direction = "DOWN";
    } else if (e.key === 'ArrowLeft' && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (e.key === 'ArrowRight' && direction !== "LEFT") {
        direction = "RIGHT";
    }
});

// Ensure snake starts in a valid position
function startGame() {
    // Ensure the snake starts in an open space
    let startX = Math.floor(cols / 2) * CELL_SIZE + CELL_SIZE / 2;
    let startY = Math.floor(rows / 2) * CELL_SIZE + CELL_SIZE / 2;

    snake = new Snake(startX, startY, 15, 2);  // Reinitialize snake in the middle of the screen

    running = true;
    score = 0;
    document.getElementById("score").textContent = score;
    gameLoop();
}

// Start the game on page load
startGame();
