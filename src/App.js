import React, { Component } from 'react';
import Game from './components/Game.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Tic Tac and Toeing...</h2>
        </div>
        <section className="App-game">
          <Game />
        </section>  
        <footer>
        </footer>  
      </div>
    );
  }
}

export default App;
