// Importa as dependências necessárias
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Criação do aplicativo Express e do servidor HTTP
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configura o diretório 'public' para servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Declaração das variáveis do jogo (estado do tabuleiro, jogadores, placar)
let players = [];
let board = Array(9).fill(null);
let currentTurn = 'X';
let scoreX = 0;
let scoreO = 0;
let scoreDraws = 0;

// Quando um novo jogador se conecta ao servidor
io.on('connection', socket => {
    // Verifica se já há dois jogadores na partida. Se sim, emite 'roomFull' para o novo jogador
    if (players.length >= 2) {
        socket.emit('roomFull');
        return;
    }

    // Define o símbolo do jogador (X ou O) e adiciona ele à lista de jogadores
    const symbol = players.length === 0 ? 'X' : 'O';
    players.push({ id: socket.id, symbol });
    socket.emit('playerData', symbol);  // Envia o símbolo do jogador para o cliente
    io.emit('updateBoard', { board, currentTurn });  // Atualiza todos os jogadores com o estado atual do jogo

    console.log(`Jogador ${symbol} conectado (ID: ${socket.id})`);  // Exibe no terminal que um jogador se conectou

    // Evento que lida com a jogada de um jogador
    socket.on('makeMove', ({ index, symbol }) => {
        if (symbol === currentTurn && !board[index]) {  // Verifica se é a vez do jogador e se a célula está vazia
            board[index] = symbol;  // Marca a célula com o símbolo do jogador
            currentTurn = currentTurn === 'X' ? 'O' : 'X';  // Alterna a vez entre os jogadores
            io.emit('updateBoard', { board, currentTurn });  // Atualiza todos os jogadores com o novo estado do tabuleiro
        }
    });

    // Evento que reinicia o jogo
    socket.on('restartGame', () => {
        board = Array(9).fill(null);  // Limpa o tabuleiro
        currentTurn = 'X';  // Reseta a vez do jogo para X
        io.emit('updateBoard', { board, currentTurn });  // Atualiza todos os jogadores com o novo estado do tabuleiro
    });

    // Evento que reseta o placar (vitórias de X, O e empates)
    socket.on('resetScore', () => {
        scoreX = 0;  // Reseta a pontuação de X
        scoreO = 0;  // Reseta a pontuação de O
        scoreDraws = 0;  // Reseta os empates
        io.emit('updateScore', { scoreX, scoreO, scoreDraws });  // Envia o novo placar para todos os jogadores
    });

    // Evento quando um jogador se desconecta
    socket.on('disconnect', () => {
        players = players.filter(p => p.id !== socket.id);  // Remove o jogador desconectado da lista de jogadores
        board = Array(9).fill(null);  // Limpa o tabuleiro
        currentTurn = 'X';  // Reseta a vez para X
        io.emit('playerLeft');  // Notifica todos os jogadores que um jogador saiu
        console.log(`Jogador (ID: ${socket.id}) desconectado`);  // Exibe no terminal que um jogador se desconectou
    });
});

// Inicia o servidor na porta 3000
server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
