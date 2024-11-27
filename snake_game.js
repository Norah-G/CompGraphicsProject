// WebGL setup
const canvas = document.getElementById('webglCanvas');
canvas.width = window.innerWidth;  // Set canvas width
canvas.height = window.innerHeight; // Set canvas height
const gl = canvas.getContext('webgl');
if (!gl) {
    alert("WebGL not supported!");
}

// Shaders for rendering
const vsSource = `
    attribute vec4 a_position;
    uniform mat4 u_modelViewMatrix;
    uniform mat4 u_projectionMatrix;
    void main() {
        gl_Position = u_projectionMatrix * u_modelViewMatrix * a_position;
    }
`;

const fsSource = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
        gl_FragColor = u_color;
    }
`;

// Compile shaders
const compileShader = (source, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling shader: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
};

const vertexShader = compileShader(vsSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(fsSource, gl.FRAGMENT_SHADER);

// Create shader program
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

// Cube vertices for snake and food
const vertices = new Float32Array([
    -0.5, -0.5, 0.0,
     0.5, -0.5, 0.0,
     0.5,  0.5, 0.0,
    -0.5,  0.5, 0.0
]);

// Buffer and attribute locations
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(shaderProgram, 'a_position');
gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aPosition);

// Uniform locations for matrices and color
const uColor = gl.getUniformLocation(shaderProgram, 'u_color');
const uModelViewMatrix = gl.getUniformLocation(shaderProgram, 'u_modelViewMatrix');
const uProjectionMatrix = gl.getUniformLocation(shaderProgram, 'u_projectionMatrix');

// Model-view matrix (for 2D position)
let modelViewMatrix = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, -1, 0,
    0, 0, 0, 1
]);

// Projection matrix (Orthogonal for 2D rendering)
const projectionMatrix = new Float32Array([
    2 / canvas.width, 0, 0, 0,
    0, 2 / canvas.height, 0, 0,
    0, 0, -1, 0,
    -1, -1, 0, 1
]);
gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);

// Game state variables
const cols = 20;
const rows = 15;
const CELL_SIZE = 1;
let snake = [{ x: 5, y: 5 }]; // Ensure snake starts in the middle of the grid
let direction = "RIGHT";
let food = { x: 5, y: 8 }; // Ensure food starts in an open space
let score = 0;
let gameOver = false;

// Maze layout (walls)
const MAZE = Array.from({ length: rows }, () => Array(cols).fill(0));
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        if (row === 0 || col === 0 || row === rows - 1 || col === cols - 1) {
            MAZE[row][col] = 1; // walls
        }
        if (Math.random() < 0.05) { // Random obstacles
            MAZE[row][col] = 1;
        }
    }
}

// Render loop
const render = () => {
    if (gameOver) return;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw snake
    snake.forEach(segment => {
        modelViewMatrix[12] = segment.x * CELL_SIZE;
        modelViewMatrix[13] = segment.y * CELL_SIZE;
        gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);
        gl.uniform4fv(uColor, [0.0, 1.0, 0.0, 1.0]); // Green for snake
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4); // Draw square (quad)
    });

    // Draw food (red)
    modelViewMatrix[12] = food.x * CELL_SIZE;
    modelViewMatrix[13] = food.y * CELL_SIZE;
    gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);
    gl.uniform4fv(uColor, [1.0, 0.0, 0.0, 1.0]); // Red for food
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4); // Draw square (quad)

    // Game logic: Update snake position, check for collisions, etc.
    updateGame();

    requestAnimationFrame(render);
};

// Update game state: snake movement, collision detection, etc.
const updateGame = () => {
    // Move snake
    if (direction === "UP") snake[0].y += 1;
    if (direction === "DOWN") snake[0].y -= 1;
    if (direction === "LEFT") snake[0].x -= 1;
    if (direction === "RIGHT") snake[0].x += 1;

    // Handle wall collision
    if (snake[0].x < 0 || snake[0].x >= cols || snake[0].y < 0 || snake[0].y >= rows || MAZE[snake[0].y][snake[0].x] === 1) {
        handleGameOver();
    }

    // Handle food collision
    if (Math.abs(snake[0].x - food.x) < 0.5 && Math.abs(snake[0].y - food.y) < 0.5) {
        score++;
        snake.push({ x: food.x, y: food.y });
        spawnFood();
    }

    // Handle self-collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            handleGameOver();
        }
    }

    // Check for score 100
    if (score >= 100) {
        alert("Congratulations! You reached a score of 100!");
        handleGameOver();
    }
};

// Handle game over
const handleGameOver = () => {
    gameOver = true;
    alert("Game Over! Final Score: " + score);
    score = 0;
    snake = [{ x: 5, y: 5 }]; // Start the snake in an open space
    spawnFood();
};

// Handle user input for snake direction
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Spawn food at a random location
const spawnFood = () => {
    food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    // Ensure food is placed in an open space
    if (MAZE[food.y][food.x] === 1 || snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        spawnFood();
    }
};

// Start the game loop
spawnFood();
render();
