// 初始化游戏变量
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 蛇的初始设置
let snake = [{x: 10, y: 10}];
let direction = {x: 0, y: 0};
let food = {x: 5, y: 5};
let score = 0;
let gamePaused = false;
let gameLoopTimeout;

// 游戏循环
function gameLoop() {
    if (gamePaused) return;
    update();
    draw();
    gameLoopTimeout = setTimeout(gameLoop, 100);
}

// 更新游戏状态
function update() {
    // 蛇的移动逻辑
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

    // 边界检测
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        gameOver();
        return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        generateFood();
    } else {
        snake.pop();
    }
}

// 游戏结束
function gameOver() {
    clearTimeout(gameLoopTimeout);
    gamePaused = true;
}

// 绘制游戏画面
function draw() {
    // 清空画布
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制蛇
    ctx.fillStyle = 'lime';
    snake.forEach(part => ctx.fillRect(part.x * 20, part.y * 20, 20, 20));

    // 绘制食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);

    // 游戏结束画面
    if (gamePaused) {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束', canvas.width / 2, canvas.height / 2);

        // 添加重新开始按钮
        ctx.fillStyle = 'blue';
        ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 + 30, 100, 30);
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText('重新开始', canvas.width / 2, canvas.height / 2 + 50);
    }
}

// 生成食物
function generateFood() {
    food = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20)
    };
}

// 键盘控制
window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp': direction = {x: 0, y: -1}; break;
        case 'ArrowDown': direction = {x: 0, y: 1}; break;
        case 'ArrowLeft': direction = {x: -1, y: 0}; break;
        case 'ArrowRight': direction = {x: 1, y: 0}; break;
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
    snake = [{x: 10, y: 10}];
    direction = {x: 0, y: 0};
    score = 0;
    gamePaused = false;
    generateFood();
    gameLoop();
}

// 启动游戏
generateFood();
gameLoop();

// 添加点击事件监听器
canvas.addEventListener('click', e => {
    if (gamePaused) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x >= canvas.width / 2 - 50 && x <= canvas.width / 2 + 50 &&
            y >= canvas.height / 2 + 30 && y <= canvas.height / 2 + 60) {
            resetGame();
        }
    }
});