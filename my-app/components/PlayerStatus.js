// components/PlayerStatus.js
import React from "react";

const PlayerStatus = ({ currentPlayer, isPlayerOneTurn }) => {
  return (
    <div>
      <p>{currentPlayer} turn</p>
      <p>{isPlayerOneTurn ? "Player 1" : "Player 2"} turn</p>
    </div>
  );
};

export default PlayerStatus;
