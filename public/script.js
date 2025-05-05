// Estabelecendo a conexão com o servidor WebSocket
const socket = io(); 

// Selecionando os elementos do DOM para manipulação
const boardEl = document.getElementById('board');  // Tabuleiro
const infoEl = document.getElementById('info');  // Status do jogo
const restartBtn = document.getElementById('restart');  // Botão de reinício
const scoreXEl = document.getElementById('scoreX');  // Placar do X
const scoreOEl = document.getElementById('scoreO');  // Placar do O
const scoreDrawsEl = document.getElementById('scoreDraws');  // Placar de empates

// Variáveis do jogo
let playerSymbol = null;  // Símbolo do jogador atual (X ou O)
let currentTurn = 'X';  // Turno atual
let board = Array(9).fill(null);  // Estado do tabuleiro
let scoreX = 0;  // Placar de X
let scoreO = 0;  // Placar de O
let scoreDraws = 0;  // Contagem de empates
let gameOver = false;  // Indica se o jogo acabou

// Recebe o símbolo do jogador assim que ele se conecta ao servidor
socket.on('playerData', symbol => {
    playerSymbol = symbol;
    infoEl.textContent = `Você é o jogador ${symbol}`;
});

// Evento para quando a sala estiver cheia
socket.on('roomFull', () => {
    infoEl.textContent = 'Sala cheia. Tente novamente mais tarde.';
});

// Evento para atualizar o tabuleiro
socket.on('updateBoard', data => {
    board = data.board;  
    currentTurn = data.currentTurn;  
    renderBoard(); 

    const winner = checkWinner();  // Verifica se há um vencedor
    if (winner) {
        infoEl.textContent = `Jogador ${winner} venceu!`;  // Exibe vencedor
        highlightWinningCells();
        updateScore(winner); 
        gameOver = true;  
        setTimeout(() => {
            socket.emit('restartGame');
            gameOver = false; 
        }, 3000);
    } else if (board.every(cell => cell)) {
        infoEl.textContent = 'Empate!';
        scoreDraws++;
        scoreDrawsEl.textContent = `Empates: ${scoreDraws}`; 
        gameOver = true;
        setTimeout(() => {
            socket.emit('restartGame');  // Reinicia o jogo após 3 segundos
            gameOver = false; 
        }, 3000);
    } else {
        infoEl.textContent = `Vez do jogador ${currentTurn}`; 
    }
});

// Evento para quando o outro jogador desconectar
socket.on('playerLeft', () => {
    infoEl.textContent = 'O outro jogador saiu. Aguarde novo oponente.';
    boardEl.innerHTML = ''; 
});

// Evento para atualizar o placar
socket.on('updateScore', data => {
    scoreX = data.scoreX;
    scoreO = data.scoreO;
    scoreDraws = data.scoreDraws;

    // Atualiza o placar no cliente
    scoreXEl.textContent = `X: ${scoreX}`;
    scoreOEl.textContent = `O: ${scoreO}`;
    scoreDrawsEl.textContent = `Empates: ${scoreDraws}`;
});

// Evento do botão de reiniciar o jogo
restartBtn.addEventListener('click', () => {
    socket.emit('restartGame');  // Envia evento para reiniciar o jogo no servidor
    // Zera o placar no cliente
    scoreX = 0;
    scoreO = 0;
    scoreDraws = 0;  
    scoreXEl.textContent = `X: ${scoreX}`;
    scoreOEl.textContent = `O: ${scoreO}`;
    scoreDrawsEl.textContent = `Empates: ${scoreDraws}`;
    // Envia evento para reiniciar o placar no servidor
    socket.emit('resetScore');
});

// Função para renderizar o tabuleiro na tela
function renderBoard() {
    boardEl.innerHTML = '';
    board.forEach((val, i) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i); 
        cell.tabIndex = 0; 

        if (val) {  // Se já houver um valor (X ou O) na célula
            cell.textContent = val;
            cell.classList.add(val === 'X' ? 'x' : 'o');
        }

        // Se a célula estiver vazia e for a vez do jogador, adiciona evento de clique
        if (!val && playerSymbol === currentTurn && !gameOver) {
            cell.addEventListener('click', () => {
                socket.emit('makeMove', { index: i, symbol: playerSymbol });  // Envia o movimento para o servidor
            });
            cell.addEventListener('keypress', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    socket.emit('makeMove', { index: i, symbol: playerSymbol });
                }
            });
        }

        boardEl.appendChild(cell);  // Adiciona a célula ao tabuleiro
    });
}

// Função para verificar se há um vencedor
function checkWinner() {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for (const [a,b,c] of winPatterns) {  // Verifica os padrões de vitória
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];  // Retorna o vencedor (X ou O)
        }
    }
    return null;  // Se não houver vencedor
}

// Função para destacar as células vencedoras
function highlightWinningCells() {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for (const [a,b,c] of winPatterns) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            const cells = document.querySelectorAll('.cell');
            [a, b, c].forEach(index => cells[index].classList.add('win'));  // Destaca as células vencedoras
        }
    }
}

// Função para atualizar o placar
function updateScore(winner) {
    if (winner === 'X') {
        scoreX++;  // Incrementa o placar do X
        scoreXEl.textContent = `X: ${scoreX}`;
    } else if (winner === 'O') {
        scoreO++;  // Incrementa o placar do O
        scoreOEl.textContent = `O: ${scoreO}`;
    }
}
