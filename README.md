# Jogo da Velha Online 🎮

Este é um projeto de **Jogo da Velha Online** desenvolvido com **HTML**, **CSS**, **JavaScript** e **Node.js**. O jogo permite que dois jogadores joguem de forma online, conectando-se a uma sala via WebSocket. O projeto oferece uma experiência dinâmica e interativa, com um placar atualizado e a possibilidade de alternar entre temas claro e escuro.

## Funcionalidades 🌟

- **Jogo online**: Permite que dois jogadores joguem o jogo da velha em tempo real, utilizando WebSockets para comunicação entre os jogadores.
- **Placar**: O placar é mantido para contar vitórias de 'X', 'O' e empates.
- **Tema claro/escuro**: Alternância entre tema claro e escuro, permitindo personalizar a aparência do jogo.
- **Responsividade**: O design é responsivo, adaptando-se a diferentes dispositivos e tamanhos de tela.

## Tecnologias 🚀

- **HTML**: Estrutura da página e interação com o usuário.
- **CSS**: Estilos visuais, incluindo temas claros e escuros, e layout responsivo.
- **JavaScript**: Lógica do jogo, interatividade e controle de jogadas dos jogadores.
- **Node.js**: Backend para gerenciamento da sala de jogo e comunicação entre os jogadores via WebSocket.
- **Socket.IO**: Utilizado para permitir a comunicação em tempo real entre os jogadores.

## Como jogar ⚙️

1. **Conectar ao jogo**: Ao acessar a página, você será automaticamente conectado ao jogo. Você será atribuído a um dos jogadores: 'X' ou 'O'.
2. **Fazer jogadas**: Clique nas células do tabuleiro para fazer suas jogadas. O jogo alterna entre os jogadores 'X' e 'O'. 
3. **Vencedor**: O jogo detecta o vencedor ou empate automaticamente após cada jogada. O vencedor é anunciado e o placar é atualizado.
4. **Reiniciar o jogo**: Clique no botão "Reiniciar" para reiniciar o jogo. O placar também será reiniciado se necessário.

## Como rodar localmente 💻

1. Clone o repositório com o comando: git clone https://github.com/seu-usuario/jogo-da-velha-online.git
2.  Navegue até o diretório do projeto e instale as dependências com: cd jogo-da-velha-online | npm install
3. Inicie o servidor com o comando: npm start
4. Por fim, abra o navegador e acesse: http://localhost:3000
