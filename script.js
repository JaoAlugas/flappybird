// Obtendo o canvas e o contexto
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Definindo as dimensões do canvas
canvas.width = 320;
canvas.height = 480;

// Variáveis do jogo
let birdX = 50;
let birdY = 150;
let birdVelocity = 0;
let birdGravity = 0.6;
let birdLift = -15;
let isGameOver = false;
let pipes = [];
let pipeGap = 100;
let pipeWidth = 50;
let pipeSpeed = 2;
let score = 0;

// Função para desenhar o pássaro
function drawBird() {
  ctx.fillStyle = 'yellow';
  ctx.fillRect(birdX, birdY, 20, 20);
}

// Função para desenhar os canos
function drawPipes() {
  for (let i = 0; i < pipes.length; i++) {
    let pipe = pipes[i];
    ctx.fillStyle = 'green';
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight); // Canos de cima
    ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight); // Canos de baixo
  }
}

// Função para atualizar a posição dos canos
function updatePipes() {
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= pipeSpeed;
  }

  // Remover canos que saíram da tela
  if (pipes.length > 0 && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
    score++;
  }

  // Gerar novos canos
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    pipes.push({
      x: canvas.width,
      topHeight: pipeHeight,
      bottomHeight: canvas.height - pipeHeight - pipeGap
    });
  }
}

// Função para detectar colisões
function detectCollisions() {
  for (let i = 0; i < pipes.length; i++) {
    let pipe = pipes[i];
    if (
      birdX + 20 > pipe.x && birdX < pipe.x + pipeWidth &&
      (birdY < pipe.topHeight || birdY + 20 > canvas.height - pipe.bottomHeight)
    ) {
      isGameOver = true;
    }
  }

  // Verificar se o pássaro atingiu o chão ou o topo
  if (birdY + 20 >= canvas.height || birdY < 0) {
    isGameOver = true;
  }
}

// Função para atualizar a posição do pássaro
function updateBird() {
  birdVelocity += birdGravity;
  birdY += birdVelocity;
}

// Função para desenhar a pontuação
function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Função principal do jogo
function gameLoop() {
  if (isGameOver) {
    ctx.fillStyle = 'red';
    ctx.font = '36px Arial';
    ctx.fillText('Game Over', 90, canvas.height / 2);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpar o canvas

  drawBird();
  drawPipes();
  drawScore();
  
  updateBird();
  updatePipes();
  detectCollisions();

  requestAnimationFrame(gameLoop);
}

// Adicionar eventos de controle (pular)
window.addEventListener('keydown', (e) => {
  if (e.key === ' ' && !isGameOver) { // Space para pular
    birdVelocity = birdLift;
  }
});

// Iniciar o jogo
gameLoop();