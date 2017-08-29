import React from 'react';
import Board from './Board.js';

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
      playerToken: 'X'
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

  //Run through possible scenarios and pass pos move to handleClick()
  computerMove() {
    const history = this.state.history;
    const current = history[history.length - 1].squares;
    const playerToken = this.state.playerToken;
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
    if (current[4] === playerToken && this.state.stepNumber === 1) {
      move = cornerSquares[Math.floor(Math.random() * cornerSquares.length)];
    } 
    //If player clicks corner square on first move go in centre square
    else if (this.state.stepNumber === 1) {
      for (let i = 0; i < cornerSquares.length; i++){
        if (current[cornerSquares[i]] === playerToken) {
          move = 4;
          break;
        }
      }
    }
    //If player or computer has 2 in a row, place in 3rd square to win or block
    if (move === null) {
      for (let i = 0; i < twoInRow.length; i++) {
        const [a, b, c] = twoInRow[i];  
        if (current[a] && current[a] === current[b]) {
          move = c;
          break;
        }
      }
    }
    //Place in random empty square (Player chance)
    if (move === null) {
      const nullSquares = []
      current.map((val, pos) => {
        if (!val) {
          nullSquares.push(pos);
        } 
      });
      move = nullSquares[Math.floor(Math.random() * nullSquares.length)];
    }

    drawSquare(move);
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
        return squares[a];
      }
    }
    return null;
  }

  render() {
    //Determine One player mode and start computer turn
    if(this.state.onePlayer && this.state.computerMove) {
      this.computerMove()
    };
    //Assign current move from history to display correct squares
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    //After each move, see if there is a winner else alternate player
    const winner = this.calculateWinner(current.squares);
    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    //Show the history of each move and jumpTo a previous move on click
    const moves = this.state.history.map((step, move) => {
      const moveDesc = move ? `Move Number: ${move}` : 'Game start';
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{moveDesc}</a>
        </li>
      );
    });

    //Show players
    let players = null;
    (this.state.onePlayer) ? players = 'One Player' : players = 'Two Players';

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i, true)}
          />
        </div>
        <div className="game-options">
          <div className="game-options-player">
            <p>Game type</p>
            <button onClick={() => {this.setState({onePlayer: true})}}>One Player</button>
            <button onClick={() => {this.setState({onePlayer: false})}}>Two Player</button>
            <p>Would you like to be</p>
          </div>
          <div className="game-options-icon">
            <button onClick={() => {this.setState({
              xIsNext: true, 
              playerToken: 'X'
            })}}>X</button>
            or
            <button onClick={() => {this.setState({
              xIsNext: false,
              playerToken: 'O'
            })}}>0</button>
          </div>
        </div>
        <div className="game-info">
          <div>{players}</div>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default Game;