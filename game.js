// 游戏常量
const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const INITIAL_SNAKE = [{x: 10, y: 10}];

// 初始化游戏变量
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏状态
let snake = [...INITIAL_SNAKE];
let direction = {x: 0, y: 0};
let food = {x: 5, y: 5};
let score = 0;
let gamePaused = false;
let gameLoopTimeout;

// 游戏主循环
function gameLoop() {
    if (gamePaused) return;
    update();
    draw();
    gameLoopTimeout = setTimeout(gameLoop, 100);
}

// 更新游戏状态
function update() {
    // 计算新的蛇头位置
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // 碰撞检测
    if (isCollision(head)) {
        gameOver();
        return;
    }

    // 更新蛇的位置
    snake.unshift(head);

    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        generateFood();
    } else {
        snake.pop();
    }
}

// 碰撞检测函数
function isCollision(head) {
    // 边界检测
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return true;
    }

    // 自碰撞检测
    return snake.slice(1).some(part => part.x === head.x && part.y === head.y);
}

// 游戏结束处理
function gameOver() {
    clearTimeout(gameLoopTimeout);
    gamePaused = true;
    drawGameOverScreen();
}

// 绘制游戏画面
function draw() {
    // 清空画布
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // 绘制蛇
    ctx.fillStyle = 'lime';
    snake.forEach(part => ctx.fillRect(part.x * GRID_SIZE, part.y * GRID_SIZE, GRID_SIZE, GRID_SIZE));

    // 绘制食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

// 绘制游戏结束画面
function drawGameOverScreen() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束', CANVAS_SIZE / 2, CANVAS_SIZE / 2);

    // 绘制重新开始按钮
    ctx.fillStyle = 'blue';
    ctx.fillRect(CANVAS_SIZE / 2 - 50, CANVAS_SIZE / 2 + 30, 100, 30);
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText('重新开始', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 50);
}

// 生成食物
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (snake.some(part => part.x === newFood.x && part.y === newFood.y));
    food = newFood;
}

// 键盘控制
window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp': if (direction.y !== 1) direction = {x: 0, y: -1}; break;
        case 'ArrowDown': if (direction.y !== -1) direction = {x: 0, y: 1}; break;
        case 'ArrowLeft': if (direction.x !== 1) direction = {x: -1, y: 0}; break;
        case 'ArrowRight': if (direction.x !== -1) direction = {x: 1, y: 0}; break;
        case ' ': togglePause(); break;
        case 'r': resetGame(); break;
    }
});

// 暂停/继续游戏
function togglePause() {
    gamePaused = !gamePaused;
    if (!gamePaused) {
        gameLoop();
    }
}

// 重置游戏
function resetGame() {
    clearTimeout(gameLoopTimeout);
    snake = [...INITIAL_SNAKE];
    direction = {x: 0, y: 0};
    score = 0;
    gamePaused = false;
    generateFood();
    gameLoop();
}

// 初始化游戏
function initGame() {
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    generateFood();
    gameLoop();
}

// 启动游戏
initGame();

// 添加点击事件监听器
canvas.addEventListener('click', e => {
    if (gamePaused) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x >= CANVAS_SIZE / 2 - 50 && x <= CANVAS_SIZE / 2 + 50 &&
            y >= CANVAS_SIZE / 2 + 30 && y <= CANVAS_SIZE / 2 + 60) {
            resetGame();
        }
    }
});