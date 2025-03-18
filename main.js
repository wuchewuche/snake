const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let food = {x: 5, y: 5};
let direction = {x: 0, y: 0};
let score = 0;
let isPaused = false;
let gameLoopId = null;

function gameLoop() {
  if (isPaused) return;
  
  update();
  draw();
  gameLoopId = setTimeout(gameLoop, 100);
}

function update() {
  const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || 
      snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    resetGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').textContent = score;
    placeFood();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.fillStyle = '#f8f8f8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'green';
  snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize));

  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };

  if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    placeFood();
  }
}

function resetGame() {
  snake = [{x: 10, y: 10}];
  direction = {x: 0, y: 0};
  score = 0;
  document.getElementById('score').textContent = score;
  placeFood();
}

// Pause/Resume functionality
document.getElementById('pause-btn').addEventListener('click', () => {
  isPaused = true;
  clearTimeout(gameLoopId);
});

document.getElementById('resume-btn').addEventListener('click', () => {
  if (isPaused) {
    isPaused = false;
    gameLoop();
  }
});

window.addEventListener('keydown', e => {
  if (isPaused) return;
  
  switch (e.key) {
    case 'ArrowUp':
      if (direction.y === 0) direction = {x: 0, y: -1};
      break;
    case 'ArrowDown':
      if (direction.y === 0) direction = {x: 0, y: 1};
      break;
    case 'ArrowLeft':
      if (direction.x === 0) direction = {x: -1, y: 0};
      break;
    case 'ArrowRight':
      if (direction.x === 0) direction = {x: 1, y: 0};
      break;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  placeFood();
  gameLoop();
});
