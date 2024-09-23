// 🐭🧀👹

const mainCanvas = document.getElementById("main-canvas");
const ctx = mainCanvas.getContext("2d");

const log = document.getElementById("log-screen");
const senseBox = document.getElementById("sense-box");

function rand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}





class Cell {
  constructor(xpos, ypos, visitedColour, unvisitedColour) {
    this.value = 0; //0-empty 1-monmster 2-cheese
    this.status = 0; //0-unvisited 1-visited 2-player
    this.xpos = xpos;
    this.ypos = ypos;
    this.visitedColour = visitedColour;
    this.unvisitedColour = unvisitedColour;
    this.text = "";
  }

  paintVisitedCell(ctx) {
    ctx.fillStyle = this.visitedColour;
    ctx.fillRect(this.xpos, this.ypos, 100, 100);

    // ctx.strokeStyle="black"
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "40px Arial";
    ctx.fillText(this.text, this.xpos + 50, this.ypos + 50);
  }

  paintUnvisitedCell(ctx) {
    ctx.fillStyle = this.unvisitedColour;
    ctx.fillRect(this.xpos, this.ypos, 100, 100);
  }
}

class Board {
  constructor(wumpusCount, size) {
    this.wumpusCount = wumpusCount;
    this.size = size;
    this.playerPos = [size - 1, 0];
    this.board = Array.from({ length: size }, () => Array(size).fill(0));
    this.senseRules = {
      1: "👹",
      2: "🧀",
    };
    this.winStatus = -1;
    
  }

  initializeBoard() {
    //makes the board out of cells and assigns them some default values with constructor
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        this.board[i][j] = new Cell(j * 100, i * 100, "pink", "gray");
      }
    }

    //this is for storing random positions of wumpus cheese and player
    var wumpusPos = [];

    //generating unique and random points within the board .. for wumpus cheese and player
    while (wumpusPos.length < this.wumpusCount + 2) {
      let row = rand(0, this.size);
      let col = rand(0, this.size);

      let newPoint = [row, col];

      let pointExists = wumpusPos.some(
        (point) => point[0] === newPoint[0] && point[1] === newPoint[1]
      );

      if (!pointExists) {
        wumpusPos.push(newPoint);
      }
    }

    //assigning player
    this.board[wumpusPos[0][0]][wumpusPos[0][1]].status = 2;
    this.board[wumpusPos[0][0]][wumpusPos[0][1]].text = "🐭";
    this.playerPos[0] = wumpusPos[0][0];
    this.playerPos[1] = wumpusPos[0][1];

    //assigining to cheese
    this.board[wumpusPos[1][0]][wumpusPos[1][1]].value = 2;
    this.board[wumpusPos[1][0]][wumpusPos[1][1]].text = "🧀";

    //asisingin to wumpus
    for (let i = 2; i < this.wumpusCount + 2; i++) {
      let rpos = wumpusPos[i][0];
      let cpos = wumpusPos[i][1];
      this.board[rpos][cpos].value = 1;
      this.board[rpos][cpos].text = "👹";
    }
  }

  displayBoard() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const board = this.board[i][j];

        if (board.status == 2 || board.status == 1) {
          board.paintVisitedCell(ctx);
        } else if (board.status == 0) {
          board.paintUnvisitedCell(ctx);
        }
      }
    }
  }

  makeVisited(rpos, ypos) {
    this.board[rpos][ypos].status = 1;
    if (this.board[rpos][ypos].value == 0) {
      this.board[rpos][ypos].text = "";
    }
  }

  updatePlayerCellStatus() {
    this.board[this.playerPos[0]][this.playerPos[1]].status = 2;
    this.board[this.playerPos[0]][this.playerPos[1]].text = "🐭";
  }

  checkStatus(pos) {
    if (this.board[pos[0]][pos[1]].value == 1) {
      this.winStatus = 0;
      this.board[pos[0]][pos[1]].status = 1;
      return 0;
    } 
    else if (this.board[pos[0]][pos[1]].value == 2) {
      this.winStatus = 1;
      this.board[pos[0]][pos[1]].status = 1;
      return 1;
    } 
    else {
      this.winStatus = -1;
      return -1;
    }
  }
}

class Player extends Board {
  constructor(wumpusCount, size) {
    super(wumpusCount, size);
    this.rpos = this.playerPos[0];
    this.cpos = this.playerPos[1];
    this.sense = [];
  }

  moveRight() {
    if (this.playerPos[1] == this.size - 1) {
      //edge reached
    } else {
      // console.log(this.playerPos[0]);
      if (this.checkStatus([this.playerPos[0],this.playerPos[1] + 1]) == -1) {
        this.makeVisited(this.playerPos[0], this.playerPos[1]);
        this.playerPos[1] += 1;
        this.updatePlayerCellStatus();
      } else {
        //process win/defeat
      }
    }
  }
  moveLeft() {
    if (this.playerPos[1] == 0) {
      //edge reached
    } else {
      if (this.checkStatus([this.playerPos[0],this.playerPos[1] - 1]) == -1) {
        this.makeVisited(this.playerPos[0], this.playerPos[1]);
        this.playerPos[1] -= 1;
        this.updatePlayerCellStatus();
      } else {
        //process win/defeat
        //display the board
        //say you have won
        //freeze
      }
    }
  }
  moveUp() {
    if (this.playerPos[0] == 0) {
      //edge reached
    } else {
      if (this.checkStatus([this.playerPos[0]-1,this.playerPos[1] ]) == -1) {
        this.makeVisited(this.playerPos[0], this.playerPos[1]);
        this.playerPos[0] -= 1;
        this.updatePlayerCellStatus();
      } else {
        //process win/defeat
      }
    }
  }

  moveDown() {
    if (this.playerPos[0] == this.size - 1) {
      //edge reached
    } else {
      if (this.checkStatus([this.playerPos[0]+1,this.playerPos[1] ]) == -1) {
        this.makeVisited(this.playerPos[0], this.playerPos[1]);
        this.playerPos[0] += 1;
        this.updatePlayerCellStatus();
      } else {
        //process win/defeat
      }
    }
  }

  control(e) {
    var key = e.key;
    if (key == "a") {
      this.moveLeft();
    }
    if (key == "s") {
      this.moveDown();
    }
    if (key == "d") {
      this.moveRight();
    }
    if (key == "w") {
      this.moveUp();
    }
    // console.log(key);
    // this.draw();
  }

  getSenses() {
    let env = [];
    let senses = [];

    if (this.playerPos[0] != 0) {
      env.push(this.board[this.playerPos[0] - 1][this.playerPos[1]].value);
    }
    if (this.playerPos[0] != this.size - 1) {
      env.push(this.board[this.playerPos[0] + 1][this.playerPos[1]].value);
    }
    if (this.playerPos[1] != 0) {
      env.push(this.board[this.playerPos[0]][this.playerPos[1] - 1].value);
    }
    if (this.playerPos[1] != this.size - 1) {
      env.push(this.board[this.playerPos[0]][this.playerPos[1] + 1].value);
    }

    for (let i = 0; i < env.length; i++) {
      if (env[i] in this.senseRules) {
        senses.push(this.senseRules[env[i]]);
      }
    }
    console.log(senses,env)

    return senses;
  }

  updateSenses(){
    let senses=this.getSenses()
    // console.log(senses)
    if(senses.length>0){
      senseBox.innerText=senses
    }
    else{
      senseBox.innerText="Nothing Sensed here"
    }
  }
}

// var board1=new Board(5,4)
// board1.create()
// board1.draw()
// console.log(board1.board[0][0].update(ctx))
// document.addEventListener('keydown',)

// var player1 = new Player(5, 4);
// player1.createBoard();
// player1.displayBoard();

// addEventListener("keydown", (event) => {
//   player1.control(event);
// });
let e = 0;
addEventListener("keydown", (event) => {
  e = event;
});

function gameLoop() {
  let wumpusCount = 3;
  let boardSize = 4;
  var player = new Player(wumpusCount, boardSize);

  player.initializeBoard();
  player.displayBoard();
  player.updateSenses()

  function handleKeyPress(event){
    player.control(event);
    player.displayBoard();
    player.updateSenses()
    // log.innerText = player.winStatus
    console.log(player.winStatus)
    if (player.winStatus == 1) {
      console.log("won")
      senseBox.innerText="Cheese found..! 😋"
      window.removeEventListener("keydown",handleKeyPress)
    } 
    else if (player.winStatus == 0) {
      // console.log("lost")
      senseBox.innerText="Wumpus caught you! 😞"
      window.removeEventListener("keydown",handleKeyPress)
    }

  }

  window.addEventListener("keydown", handleKeyPress);

}

gameLoop();
