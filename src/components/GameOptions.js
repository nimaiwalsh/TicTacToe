import React from 'react';

const GameOptions = (props) => {
  
  return (
    <div>
      <div className="game-options-player">
        <p>Game type</p>
        <button onClick={() => props.handleClick(true)}>One Player</button>
        <button onClick={() => props.handleClick(false)}>Two Player</button>
        <p>Would you like to be</p>
      </div>
      <div className="game-options-icon">
        <button onClick={() => props.onClick(true)}>X</button>
        or
        <button onClick={() => props.onClick(false)}>0</button>
      </div>
        <button onClick={() => props.onClick2()}>Start Game</button>
    </div>
  );
}

export default GameOptions;