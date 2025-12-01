// 游戏变量
let board = [];
const boardSize = 15;
let currentPlayer = 'black'; // 'black' 或 'white'
let gameOver = false;

// 获取DOM元素
const mainBox = document.getElementById('main-box');
const currentPlayerElement = document.getElementById('current-player');
const playerIndicatorElement = document.getElementById('player-indicator');
const gameStatusElement = document.getElementById('game-status');
const restartBtn = document.getElementById('restart-btn');
const winMessageElement = document.getElementById('win-message');
const winnerTextElement = document.getElementById('winner-text');
const playAgainBtn = document.getElementById('play-again-btn');

// 初始化游戏
function initGame() {
  // 重置游戏状态
  board = [];
  currentPlayer = 'black';
  gameOver = false;

  // 清空棋盘
  const existingIntersections = document.querySelectorAll('.intersection');
  existingIntersections.forEach(el => el.remove());

  // 清空获胜消息
  winMessageElement.classList.remove('show');

  // 创建棋盘数组
  for (let i = 0; i < boardSize; i++) {
    board[i] = [];
    for (let j = 0; j < boardSize; j++) {
      board[i][j] = null; // null 表示空位置

      // 创建交叉点DOM元素
      const intersection = document.createElement('div');
      intersection.className = 'intersection';
      intersection.dataset.row = i;
      intersection.dataset.col = j;

      // 设置交叉点位置
      intersection.style.left = `${(j / boardSize) * 100}%`;
      intersection.style.top = `${(i / boardSize) * 100}%`;

      // 添加点击事件
      intersection.addEventListener('click', () => makeMove(i, j));

      mainBox.appendChild(intersection);
    }
  }

  // 添加星位标记
  addBoardMarkers();

  // 更新游戏状态显示
  updateGameStatus();
}

// 添加棋盘星位标记
function addBoardMarkers() {
  // 星位坐标
  const starPoints = [
    [3, 3], [3, 7], [3, 11],
    [7, 3], [7, 7], [7, 11],
    [11, 3], [11, 7], [11, 11]
  ];

  starPoints.forEach(([row, col]) => {
    const intersections = document.querySelectorAll('.intersection');
    intersections.forEach(intersection => {
      if (parseInt(intersection.dataset.row) === row &&
        parseInt(intersection.dataset.col) === col) {
        const marker = document.createElement('div');
        marker.className = 'marker';
        intersection.appendChild(marker);
      }
    });
  });
}

// 落子
function makeMove(row, col) {
  // 如果游戏结束或该位置已有棋子，则不允许落子
  if (gameOver || board[row][col] !== null) return;

  // 更新棋盘数组
  board[row][col] = currentPlayer;

  // 在棋盘上显示棋子
  const intersections = document.querySelectorAll('.intersection');
  intersections.forEach(intersection => {
    if (parseInt(intersection.dataset.row) === row &&
      parseInt(intersection.dataset.col) === col) {
      // 清空交叉点内容
      intersection.innerHTML = '';

      // 添加星位标记（如果有）
      const marker = intersection.querySelector('.marker');
      if (marker) {
        intersection.appendChild(marker);
      }

      // 创建棋子
      const piece = document.createElement('div');
      piece.className = `piece ${currentPlayer}`;
      intersection.appendChild(piece);
    }
  });

  // 检查是否获胜
  if (checkWin(row, col, currentPlayer)) {
    gameOver = true;
    showWinner(currentPlayer);
    return;
  }

  // 检查是否平局（棋盘已满）
  if (isBoardFull()) {
    gameOver = true;
    showWinner('draw');
    return;
  }

  // 切换玩家
  currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
  updateGameStatus();
}

// 检查是否获胜
function checkWin(row, col, player) {
  // 检查方向: 水平、垂直、左上到右下、右上到左下
  const directions = [
    [0, 1],  // 水平
    [1, 0],  // 垂直
    [1, 1],  // 左上到右下
    [1, -1]  // 右上到左下
  ];

  for (const [dx, dy] of directions) {
    let count = 1; // 当前位置已经有一个棋子

    // 正向检查
    for (let i = 1; i < 5; i++) {
      const newRow = row + i * dx;
      const newCol = col + i * dy;

      if (newRow >= 0 && newRow < boardSize &&
        newCol >= 0 && newCol < boardSize &&
        board[newRow][newCol] === player) {
        count++;
      } else {
        break;
      }
    }

    // 反向检查
    for (let i = 1; i < 5; i++) {
      const newRow = row - i * dx;
      const newCol = col - i * dy;

      if (newRow >= 0 && newRow < boardSize &&
        newCol >= 0 && newCol < boardSize &&
        board[newRow][newCol] === player) {
        count++;
      } else {
        break;
      }
    }

    // 如果有5个或更多连续棋子，则获胜
    if (count >= 5) {
      return true;
    }
  }

  return false;
}

// 检查棋盘是否已满
function isBoardFull() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === null) {
        return false;
      }
    }
  }
  return true;
}

// 更新游戏状态显示
function updateGameStatus() {
  currentPlayerElement.textContent = currentPlayer === 'black' ? '黑方' : '白方';
  playerIndicatorElement.className = `player-indicator ${currentPlayer}`;

  if (!gameOver) {
    gameStatusElement.textContent = `轮到 ${currentPlayer === 'black' ? '黑方' : '白方'} 落子`;
  }
}

// 显示获胜者
function showWinner(winner) {
  if (winner === 'draw') {
    winnerTextElement.textContent = '平局！';
  } else {
    winnerTextElement.textContent = `${winner === 'black' ? '黑方' : '白方'} 获胜！`;
  }
  winMessageElement.classList.add('show');
}

// 事件监听
restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// 初始化游戏
initGame();