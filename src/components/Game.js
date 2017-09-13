import React from 'react';
import Board from './Board.js';
import GameOptions from './GameOptions.js';

class Game extends React.Component {

  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      xIsNext: true,
      stepNumber: 0,
      onePlayer: true,
      computerMove: false,
      playerOneToken: 'X',
      winsTally: {
        playerOne: 0,
        otherPlayer: 0
      }
    };
  }

  //Work with current squares and update history with new array
  //If the game is won or square is already filled, return
  //Determine weather X or O is next
  //Update state and add new moves as a new object in the history array 
  handleClick(i, computerMove) {
    const history = this.state.history.slice(0, this.state.stepNumber +1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
  
    this.setState({
      history: history.concat(
        {
          squares: squares
        }
      ),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      computerMove: computerMove,
    });
  }
  //Set player token and next move token
  handleClick2(bool) {
    if (bool) {
      this.setState({
        xIsNext: bool, 
        playerOneToken: 'X'
      })
    } else {
        this.setState({
        xIsNext: bool, 
        playerOneToken: 'O'
      })
    }
  }

  //Run through possible scenarios and pass pos move to handleClick()
  computerMove() {
    const history = this.state.history;
    const current = history[history.length - 1].squares;
    const playerOneToken = this.state.playerOneToken;
    let move = null;

    const drawSquare = (drawSquare) => {
      setTimeout(() => {this.handleClick(drawSquare, false)}, 2000);
    }

    const cornerSquares = [0, 2, 6, 8];
    const twoInRow = [
      //3rd item in array is computer move
      [0,1,2],
      [2,1,0],
      [3,4,5],
      [5,4,3],
      [6,7,8],
      [8,7,8],
      [0,3,6],
      [6,3,0],
      [1,4,7],
      [7,4,1],
      [2,5,8],
      [8,5,2],
      [0,4,8],
      [8,4,0],
      [2,4,6],
      [6,4,2],
    ]
    //If player clicks centre on first move go in corner square
    if (current[4] === playerOneToken && this.state.stepNumber === 1) {
      move = cornerSquares[Math.floor(Math.random() * cornerSquares.length)];
    } 
    //If player clicks corner square on first move go in centre square
    else if (this.state.stepNumber === 1) {
      for (let i = 0; i < cornerSquares.length; i++){
        if (current[cornerSquares[i]] === playerOneToken) {
          move = 4;
          break;
        }
      }
    }
    //If player or computer has 2 in a row, place in 3rd square to win or block
    if (move === null) {
      for (let i = 0; i < twoInRow.length; i++) {
        const [a, b, c] = twoInRow[i];  
        if (current[a] && current[a] === current[b] && current[c] === null) {
          move = c;
          break;
        }
      }
    }
    //If no above conditions met place in random empty square (Player chance)
    if (move === null) {
      const nullSquares = []
      current.map((val, pos) => {
        if (!val) {
          nullSquares.push(pos);
        } 
      });
      move = nullSquares[Math.floor(Math.random() * nullSquares.length)];
    }

    return drawSquare(move);
  }

  //Jump to an older move in the history by updating step number
  jumpTo(move) {
    this.setState({
      stepNumber: move,
      //X is next on all even numbers
      xIsNext: (move % 2) === 0,
    });
  }

  //Determine the winning sequence
  calculateWinner(squares) {
    let winner = null;
    const playerOneToken = this.state.playerOneToken;
    const computerToken = (playerOneToken === 'X') ? 'O' : 'X';
    let winMessage = '';
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    
    //Loop through the winning combinations and make sure all squares in combo are equal
    for(let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i]; /*Destructure each array into variables*/
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        winner = squares[a];
      }
    }

    //If all sequares taken and no winner return draw;
    if(this.state.stepNumber === 9 && !winner){
      winner = 'Draw';
    }

    //Determine the correct winMessage to pass to {status}
    if (winner === this.state.playerOneToken) {
      winMessage = `Player One (${winner}) Wins`;
    } else if (winner === computerToken && this.state.onePlayer) {
        winMessage = `Computer (${winner}) Wins`;
      } else if (winner === computerToken && !this.state.onePlayer){
          winMessage = `Player Two (${winner}) Wins`;
      } else if (winner === 'Draw') {
          winMessage = `It's a Draw`;
      } 

    return winMessage;
  }

  //Increment winsTally state and restart a new round
  newRound(winner) {
    let winnerTally = Object.assign({}, this.state.winsTally);
    setTimeout(() => {
      this.setState({
        history: [
          {
            squares: Array(9).fill(null)
          }
        ],
        stepNumber: 0,
      });
      if(winner.includes('Player One')) {
        winnerTally.playerOne += 1;
        this.setState({winsTally: winnerTally});
      } else if(winner.includes('Draw')) {
        return;
      } else {
        winnerTally.otherPlayer += 1;
        this.setState({winsTally: winnerTally});
      }
    }, 2500);
  }

  //Remove the GameOptions Modal after clicking Start Game
  toggleGameOptions(display) {
   let overlay = document.getElementsByClassName('overlay')[0];
   let gameoptions = document.getElementsByClassName('game-options')[0];
   if(display) {
     overlay.style.display = 'none';
     gameoptions.style.display = 'none';
   } else {
      overlay.style.display = 'block';
      gameoptions.style.display = 'block';
   }
  }

  //Determines the next player to update status
  nextPlayer() {
    let token;
    let player;
    (this.state.xIsNext) ? token='X' : token='O';
    if(token === this.state.playerOneToken) {
      player = 'Player One';
    } else if (this.state.onePlayer && this.state.playerOneToken !== token) {
      player = 'Computer';
    } else {
      player = 'Player Two';
    }
    return player;
  }

  render() {
    //Determine One player mode and start computer turn
    if(this.state.onePlayer && this.state.computerMove && this.state.stepNumber < 9) {
      this.computerMove()
    };
    //Assign current move from history to display correct squares
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    //After each move, see if there is a winner or show next player
    const winner = this.calculateWinner(current.squares);
    const player = this.nextPlayer();
    let status;
    if (winner) {
      status = winner;
      this.newRound(winner);
    } else {
      status = `${player}'s Turn`;
    } 

    //Show the history of each move and jumpTo a previous move on click
    const moves = this.state.history.map((step, move) => {
      const moveDesc = move ? `Move Number: ${move}` : 'Game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{moveDesc}</button>
        </li>
      );
    });

    //Show player turn
    let players = null;
    (this.state.onePlayer) ? players = 'One Player' : players = 'Two Players';

    return (
      <div>
        <div className="game-info">
          <div>{players}</div>
          <div>{status}</div>
          <div className="game-info-count">
            <div>Player One: {this.state.winsTally.playerOne}</div>
            <div>Player Two: {this.state.winsTally.otherPlayer}</div>
          </div>
        </div>
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i, true)}
          />
        </div>
        <div className="game-moves">
            <ol>{moves}</ol>
        </div>
        <div className="game-options">
          <GameOptions 
            handleClick={(bool) => this.setState({onePlayer: bool})}
            onClick={(bool) => this.handleClick2(bool)}
            onClick2={() => this.toggleGameOptions(true)}
          />
        </div>
      </div>
    );
  }
}

export default Game;