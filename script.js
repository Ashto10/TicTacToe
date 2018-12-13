var boxArray = [];
var state = new Object({
  PENDING : 0,
  WIN: 1,
  DRAW: 2
});

var vsAI = true;

var currentTurn = 0;
var players = [
  new Player(),
  new Player()
]
var game = new Object({
  state : state.PENDING
});

function box (tag) {
  this.tag = tag;
  this.ownership = "";

  this.setOwnership = function(owner) {
    this.ownership = owner;
    this.tag.firstElementChild.innerHTML = this.ownership;
    this.tag.firstElementChild.className = "owned";
  }

  this.reset = function() {
    this.ownership = "";
    this.tag.firstElementChild.innerHTML = this.ownership;
    this.tag.firstElementChild.className = "free";
  }

}

function Player () {
  this.score = 0;
  this.piece = "";
}

function initializeGame() {
  var elements = document.getElementsByClassName('boardCell');
  for(var i = 0; i < elements.length; i++) {
    var newBox = new box(elements[i]);

    newBox.tag.addEventListener('click', selectBox(newBox));
    boxArray.push(newBox);
  }
  document.getElementById('gameBoard').className = "";
  document.getElementById('options').className = "hidden";
  resetGame();
}

function resetGame() {
  for(var i = 0; i < boxArray.length;i++) {
    boxArray[i].reset();
  }
  game.state = state.PENDING;
  currentTurn = 0;
  updateDisplay(false);
}

function switchTurn() {
  if (currentTurn === 0) {
    currentTurn = 1;
  } else {
    currentTurn = 0;
  }
}

function choosePiece(pieceNum) {
  if (pieceNum == "X") {
    players[0].piece = "X";
    players[1].piece = "O";
  } else {
    players[0].piece = "O";
    players[1].piece = "X";
  }
  initializeGame();
}

function choosePlayers(num) {
  if (num == 1) {
    vsAI = true;
  } else {
    vsAI = false;
  }
  document.getElementById('players').className = "hidden";
  document.getElementById('piece').className = "";
}

function selectBox(box) {
  return function() {
    if(box.ownership === "" && game.state == state.PENDING) {
      box.setOwnership(players[currentTurn].piece);
      handleEndOfTurn();
      if (vsAI && game.state ==state.PENDING) {
        doAITurn();
      }
    }
  }
}

function handleEndOfTurn() {
  if(isGameOver()) {
    if (game.state === state.WIN) {
      players[currentTurn].score += 1;
      updateDisplay(true);
    } else if (game.state === state.DRAW) {
      updateDisplay(true);
    }
  } else {
    switchTurn();
  }
}

function doAITurn() {
  easyMove();
  handleEndOfTurn();
}

function easyMove() {
  var possibleMoves = [];
  for (var i = 0; i < boxArray.length; i++) {
    if (boxArray[i].ownership === "") {
      possibleMoves.push(i);
    }
  }
  var randomNum = Math.floor(Math.random() * possibleMoves.length);
  boxArray[possibleMoves[randomNum]].setOwnership(players[1].piece);
}

function isGameOver() {
  //Check rows
  for(var i = 0; i <= 6; i+=3) {
    if (boxArray[i].ownership !== "" && boxArray[i].ownership === boxArray[i+1].ownership && boxArray[i+1].ownership === boxArray[i+2].ownership) {
      game.state = state.WIN;
      return true;
    }
  }
  //Check columns
  for(var i = 0; i <= 2; i++) {
    if (boxArray[i].ownership !== "" && boxArray[i].ownership === boxArray[i+3].ownership && boxArray[i+3].ownership === boxArray[i+6].ownership) {
      game.state = state.WIN;
      return true;
    }
  }
  //Check diagonals
  for(var i = 0, j = 4; i <= 2; i+=2, j-=2) {
    if (boxArray[i].ownership !== "" && boxArray[i].ownership === boxArray[i+j].ownership && boxArray[i+j].ownership === boxArray[i + (2*j)].ownership) {
      game.state = state.WIN;
      return true
    }
  }

  for(var i = 0; i < boxArray.length;i++) {
    if (boxArray[i].ownership === "") {
      game.state = state.PENDING;
      return false
    }
  }

  game.state = state.DRAW;
  return true;
}

function updateDisplay(displayWinner) {
  if (displayWinner) {
    document.getElementById('displayArea').className = "";
    var results = "";
    if (game.state == state.WIN) {
      results = "Player " + (currentTurn+1).toString() + " Wins!";
    } else if (game.state = state.DRAW) {
      results = "It's a draw...";
    }
    document.getElementById('results').innerHTML = results;
  } else {
    document.getElementById('displayArea').className = "hidden";
  }

  var p1 = players[0].score;
  var p2 = players[1].score;
  document.getElementById('player1').innerHTML = "Player 1: " + p1.toString() + " win";
  if (p1 != 1) {
    document.getElementById('player1').innerHTML += "s";
  }
  if (vsAI) {
    document.getElementById('player2').innerHTML = "Computer: " + p2.toString() + " win";
  } else {
    document.getElementById('player2').innerHTML = "Player 2: " + p2.toString() + " win";
  }
  if (p2 != 1) {
    document.getElementById('player2').innerHTML += "s";
  }

}