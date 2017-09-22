import React from 'react';

const Square = (props) => {

  return (
    <button className={`square square${props.classRef}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export default Square; 