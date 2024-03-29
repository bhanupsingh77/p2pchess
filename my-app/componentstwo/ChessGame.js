"use client";

// components/ChessGame.js
import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import styles from "../css/ChessGame.module.css";

const ChessGame = ({ connection }) => {
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.fen());
  const [player, setPlayer] = useState("");
  const [timer, setTimer] = useState(60); // 60 seconds timer

  useEffect(() => {
    connection.on("data", (data) => {
      handleMove(data);
    });
  }, [connection]);

  const handleMove = (move) => {
    const result = chess.move(move);
    if (result) {
      setBoard(chess.fen());
      // Start timer for next move
      resetTimer();
    }
  };

  const resetTimer = () => {
    setTimer(60); // Reset timer to 60 seconds
  };

  return (
    <div className={styles.container}>
      <h2>Chess Game</h2>
      <p className={styles.player}>Player: {player}</p>
      <div className={styles.board}>
        <Chessboard
          position={board}
          onDrop={(source, target) => {
            const move = { from: source, to: target };
            connection.send(move);
          }}
        />
      </div>
      <p className={styles.timer}>Timer: {timer} seconds</p>
    </div>
  );
};

export default ChessGame;
