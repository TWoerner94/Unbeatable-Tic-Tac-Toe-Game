$(document).ready(function() {
  
  let isMultiplayer;
  let humanPlayer;
  let aiPlayer;
  let isPlayerOnesTurn = true;
  
  let squares = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  let player = 'X';
  
  $('.restartBtn').click(function() {
    window.location.href = window.location.href;
  });
  
  $('.singlePlayerBtn').click(function() {
    isMultiplayer = false;
    $('.selectModeScreen').css('display', 'none');
    $('.selectXOScreen').css('display', 'inline-block');
  });  
  $('.multiplayerBtn').click(function() {
    isMultiplayer = true;
    addGameInfoCaption();
    $('.selectModeScreen').css('display', 'none');
    $('.gameScreen').css('display', 'inline-block');
    $('.restartBtn').css('display', 'inline-block');
  });
  $('.playXBtn').click(function() {
    humanPlayer = 'X';
    aiPlayer = 'O';
    addGameInfoCaption();
    $('.selectXOScreen').css('display', 'none');
    $('.gameScreen').css('display', 'inline-block');
    $('.restartBtn').css('display', 'inline-block');
  });
  $('.playOBtn').click(function() {
    humanPlayer = 'O';
    player = 'O';
    aiPlayer = 'X';
    addGameInfoCaption();
    $('.selectXOScreen').css('display', 'none');
    $('.gameScreen').css('display', 'inline-block');
    $('.restartBtn').css('display', 'inline-block');
  });
  
  const addGameInfoCaption = () => {
    if (!isMultiplayer) {
      $('.gameInfoCaption').text(`You are playing as: ${humanPlayer}`);
    } else if (player === 'X') {
      $('.gameInfoCaption').text('Player One, it\'s your turn!');
    } else {
      $('.gameInfoCaption').text('Player Two, it\'s your turn!');
    }
  };
  
  const clickSquare = (e) => {
    if (!isMultiplayer && humanPlayer === 'X') {
      addSymbol(e, 'X');
    } else if (!isMultiplayer && humanPlayer === 'O') {
      addSymbol(e, 'O');
    } else if (isMultiplayer && isPlayerOnesTurn) {
      addSymbol(e, 'X');
      player = 'O';
      isPlayerOnesTurn = false;
      addGameInfoCaption();
    } else {
      addSymbol(e, 'O');
      player = 'X';
      isPlayerOnesTurn = true;
      addGameInfoCaption();
    }
  };
  
  const addSymbol = (e, symbol) => {
    $(e.target).text(symbol);
    $(e.target).css('pointer-events', 'none');
    $(e.target).hover(function() {
      $(this).css('background', '#eee');
    });
    squares[e.target.classList[1]] = symbol;
  };
  
  const getEmptySquares = (board) => {
    return board.filter(square => square !== 'X' && square !== 'O');
  }
  
  const hasWon = (board, player) => {
    if (
      (board[0] == player && board[1] == player && board[2] == player) ||
      (board[0] == player && board[3] == player && board[6] == player) ||
      (board[0] == player && board[4] == player && board[8] == player) ||
      (board[1] == player && board[4] == player && board[7] == player) ||
      (board[2] == player && board[4] == player && board[6] == player) ||
      (board[2] == player && board[5] == player && board[8] == player) ||
      (board[3] == player && board[4] == player && board[5] == player) ||
      (board[6] == player && board[7] == player && board[8] == player)
    ) {
      return true;
    } else {
      return false;
    }
  };
  
  const minimax = (newBoard, player) => {
    let availableSquares = getEmptySquares(newBoard);
    
    if (hasWon(newBoard, humanPlayer)) {
      return {score: -1};
    } else if (hasWon(newBoard, aiPlayer)) {
      return {score: 1};
    } else if (availableSquares.length === 0) {
      return {score: 0};
    };
    
    let moves = [];
    
    availableSquares.map(square => {
      let move = {};
      move.index = newBoard[square];
      
      newBoard[square] = player;
      
      if (player === aiPlayer) {
        let result = minimax(newBoard, humanPlayer);
        move.score = result.score;
      } else {
        let result = minimax(newBoard, aiPlayer);
        move.score = result.score;
      }
      
      newBoard[square] = move.index;
      moves.push(move);
    });
    
    let bestMove;
    if (player === aiPlayer) {
      let bestScore = -10000;
      moves.forEach((move, index) => {
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = index;
        }
      });
    } else {
      let bestScore = 10000;
      moves.forEach((move, index) => {
        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = index;
        }
      });
    }
    return moves[bestMove];
  };
  
  $('.square').click(function(e) {
    clickSquare(e);
    player = player === 'X' ? 'O' : 'X';
    if (!isMultiplayer) {
      aiClick();
    } else {
      if (hasWon(squares, 'X')) {
      $('.gameInfoCaption').text('X won!');
      squares.forEach(square => {
        $(`.${square}`).css('pointer-events', 'none');
      });
    } else if (hasWon(squares, 'O')) {
      $('.gameInfoCaption').text('O won!');
      squares.forEach(square => {
        $(`.${square}`).css('pointer-events', 'none');
      });
    } else if (squares.every(elem => typeof elem === 'string')) {
      $('.gameInfoCaption').text('It\'s a tie!');
    }
    }
  });
  
  const aiClick = () => {
    let bestSpot = minimax(squares, aiPlayer);
    $(`.${bestSpot.index}`).text(player);
    $(`.${bestSpot.index}`).css('pointer-events', 'none');
    $(`.${bestSpot.index}`).hover(function() {
      $(this).css('background', '#eee');
    });
    squares[bestSpot.index] = player;
    player = player === 'X' ? 'O' : 'X';
    
    
    if (hasWon(squares, aiPlayer)) {
      $('.gameInfoCaption').text('AI won!');
      squares.forEach(square => {
        $(`.${square}`).css('pointer-events', 'none');
      });
    } else if (hasWon(squares, humanPlayer)) {
      $('.gameInfoCaption').text('You broke the system! Please send me an Email to tell me you how you did it ;)');
      squares.forEach(square => {
        $(`.${square}`).css('pointer-events', 'none');
      });
    } else if (squares.every(elem => typeof elem === 'string')) {
      $('.gameInfoCaption').text('It\'s a tie!');
    }
  }
});
