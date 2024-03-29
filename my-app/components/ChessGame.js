"use client";

import React, { useState, useEffect } from "react";
import Chessboard from "./Chessboard";
import PlayerStatus from "./PlayerStatus";
import Timer from "./Timer";
import { Chess } from "chess.js"; // Import the chess.js library
import styles from "../css/ChessGame.module.css";

const ChessGame = () => {
  const [game] = useState(new Chess()); // Initialize a new chess game
  const [position, setPosition] = useState("start");
  const [currentPlayer, setCurrentPlayer] = useState("Player 1");
  const [isPlayerOneTurn, setIsPlayerOneTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(60);

  // Effect to manage time limit for each move
  useEffect(() => {
    let timer;
    if (!gameOver) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime === 1) {
            // Time's up, switch player
            switchPlayer();
          }
          return prevTime > 0 ? prevTime - 1 : 0;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentPlayer, gameOver]);

  // Function to switch player turns
  const switchPlayer = () => {
    setIsPlayerOneTurn((prevIsPlayerOneTurn) => !prevIsPlayerOneTurn);
    setCurrentPlayer((prevPlayer) =>
      prevPlayer === "Player 1" ? "Player 2" : "Player 1"
    );
    setTimeRemaining(60); // Reset time for the next player
  };

  const handlePieceDrop = (sourceSquare, targetSquare) => {
    // Ensure it's the player's turn
    if (
      (isPlayerOneTurn && currentPlayer !== "Player 1") ||
      (!isPlayerOneTurn && currentPlayer !== "Player 2")
    ) {
      return;
    }

    // Get all legal moves for the current position
    const legalMoves = game.moves({ verbose: true });

    // Check if the attempted move is legal
    const move = legalMoves.find(
      (move) => move.from === sourceSquare && move.to === targetSquare
    );

    // If the move is null or undefined, it's an invalid move
    if (!move) {
      // Notify the player of an invalid move
      alert("Invalid move!");
      return;
    }

    // Execute the move
    game.move(move);

    // Update position state
    setPosition(game.fen());
    console.log("1", position);

    // Check for game over, checkmate, stalemate, etc.
    if (game.isCheckmate()) {
      // Handle checkmate
      setGameOver(true);
      setGameResult("Checkmate!");
    } else if (game.isDraw()) {
      // Handle draw
      setGameOver(true);
      setGameResult("Draw!");
    } else if (game.isStalemate()) {
      // Handle stalemate
      setGameOver(true);
      setGameResult("Stalemate!");
    } else if (game.isThreefoldRepetition()) {
      // Handle threefold repetition (draw)
      setGameOver(true);
      setGameResult("Draw by threefold repetition!");
    } else if (game.isInsufficientMaterial()) {
      // Handle insufficient material (draw)
      setGameOver(true);
      setGameResult("Draw by insufficient material!");
    }

    // Switch to the next player
    switchPlayer();
  };

  return (
    <div className={styles.chessGame}>
      <div className={styles.playerInfo}>
        <div>
          {currentPlayer === "Player 1"
            ? "Player 1 (White)"
            : "Player 2 (Black)"}
        </div>
        <PlayerStatus
          currentPlayer={currentPlayer}
          isPlayerOneTurn={isPlayerOneTurn}
        />
        <div>Time Remaining: {timeRemaining} seconds</div>
      </div>
      <div className={styles.gameResult}>{gameOver && gameResult}</div>
      <Chessboard position={position} onPieceDrop={handlePieceDrop} />
    </div>
  );
};

export default ChessGame;
