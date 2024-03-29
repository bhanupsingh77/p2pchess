// components/Chessboard.js
import React from "react";
import { Chessboard } from "react-chessboard";

const ChessboardComponent = ({ position, onPieceDrop }) => {
  return <Chessboard position={position} onPieceDrop={onPieceDrop} />;
};

export default ChessboardComponent;
