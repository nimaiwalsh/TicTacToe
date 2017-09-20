import React from 'react';

const GameOptions = (props) => {
  let gameType = props.gameMode;
  if(gameType) {
    gameType = 'One Player'
  } else {
    gameType = 'Two Player'
  }
  return (
    <div>
      <div className="game-options-player">
        <h3>Game type</h3>
        <p>{gameType}</p>
        <button onClick={() => props.handleClick(true)}>One Player</button>
        <button onClick={() => props.handleClick(false)}>Two Player</button>
      </div>
      <div className="game-options-icon">
        <h3>Player One choose your symbol</h3>
        <p>{props.playerOneToken}</p>
        <button onClick={() => props.onClick(true)}>X</button>
        or
        <button onClick={() => props.onClick(false)}>0</button>
      </div>
        <button className="start-game-btn" onClick={() => props.onClick2()}>Start Game</button>
    </div>
  );
}

export default GameOptions;