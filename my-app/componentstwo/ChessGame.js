"use client";
// console.log("realturn:", chess.turn());
// console.log("faketurn:", turn);
import React, { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import styles from "../css/ChessGame.module.css";

const ChessGame = ({ state }) => {
  const { connection } = state;
  const [chess] = useState(() => new Chess());
  const [board, setBoard] = useState(chess.fen());
  const [playerColor, setPlayerColor] = useState("");
  const [turn, setTurn] = useState(chess.turn());
  const opponentPeerId = useRef("");

  useEffect(() => {
    const myPeerId = state.peer.id;
    const otherPeerId = connection.peer;

    // Determine player color and opponent's peer ID
    if (myPeerId.localeCompare(otherPeerId) < 0) {
      setPlayerColor("White (Player 1)");
      opponentPeerId.current = otherPeerId;
    } else {
      setPlayerColor("Black (Player 2)");
      opponentPeerId.current = otherPeerId;
    }

    resetBoard();

    connection.on("data", handleData);

    return () => {
      connection.off("data", handleData);
    };
  }, [connection, state.peer.id]);

  const handleData = (data) => {
    console.log("2.1", data);
    // if (data.type === "move" && data.peerId === opponentPeerId.current) {
    if (data.type === "move") {
      console.log("2.2");
      handleMove(data.move);
    }
  };

  const handleMove = (move) => {
    console.log("3.1", move);
    try {
      const result = chess.move(move);
      if (result) {
        console.log("3.2");
        setBoard(chess.fen());
        setTurn(chess.turn());
      } else {
        throw new Error("Invalid move");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handlePieceDrop = (sourceSquare, targetSquare) => {
    console.log("move1.1");
    if (!playerColor.toLowerCase().startsWith(turn.toLowerCase())) return;
    console.log("move1.2");
    const move = chess.move({ from: sourceSquare, to: targetSquare });
    if (!move) {
      alert("Invalid Move! Please try again.");
      return;
    }
    console.log("move1.3");
    setBoard(chess.fen());
    setTurn(chess.turn());
    connection.send({ type: "move", move, peerId: connection.peer });
    console.log("move1.4", { type: "move", move, peerId: connection.peer });
  };

  const resetBoard = () => {
    chess.reset();
    setBoard(chess.fen());
    setTurn(chess.turn());
  };
  console.log("realturn:", chess.turn());
  console.log("faketurn:", turn);
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Chess Game</h2>
      <div className={styles.info}>
        <p>Your peer ID: {state.peer.id}</p>
        <p>You are: {playerColor}</p>
        <p>Opponent's peer ID: {opponentPeerId.current}</p>
        <p>
          {turn === "w"
            ? playerColor.includes("White")
              ? "Player 1 (White)'s Turn"
              : "Player 1 (White)'s Turn"
            : playerColor.includes("White")
            ? "Player 2 (Black)'s Turn"
            : "Player 2 (Black)'s Turn"}
        </p>
      </div>
      <div className={styles.board}>
        <Chessboard
          position={board}
          onPieceDrop={handlePieceDrop}
          boardOrientation={playerColor.includes("White") ? "white" : "black"}
          arePiecesDraggable={playerColor
            .toLowerCase()
            .startsWith(turn.toLowerCase())}
          boardWidth={400}
        />
      </div>
    </div>
  );
};

export default ChessGame;
