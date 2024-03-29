// components/PeerToPeerChess.jsx
"use client";

import React, { useEffect, useState } from "react";
import ChessGame from "./ChessGame";
import { createLibp2pNode, connectToPeer, createLibp2p } from "./libp2p";

const PeerToPeerChess = ({ libp2p }) => {
  const [board, setBoard] = useState("start");
  const [peerId, setPeerId] = useState("");
  const [inputPeerId, setInputPeerId] = useState("");

  // Function to handle chess moves
  const handleMove = (from, to) => {
    // Handle chess move logic here
    // For demonstration, we'll just log the move
    console.log(`Move from ${from} to ${to}`);
  };

  // Function to handle sending a message
  const sendMessage = (message) => {
    // Send message logic goes here
  };

  // Function to handle connecting to another peer
  const connectToPeerHandler = async () => {
    if (inputPeerId) {
      await connectToPeer(libp2p, inputPeerId);
    }
  };

  // Function to handle copying peer ID to clipboard
  const copyPeerId = () => {
    navigator.clipboard.writeText(peerId);
  };

  useEffect(() => {
    if (libp2p) {
      const id = "hello";
      // const id = libp2p.peerId.toB58String();
      setPeerId(id);
    }
  }, [libp2p]);

  return (
    <div>
      <h1>Peer-to-Peer Chess Game</h1>
      <div>
        <p>Your Peer ID: {peerId}</p>
        <button onClick={copyPeerId}>Copy</button>
      </div>
      <input
        type="text"
        placeholder="Enter Peer ID to Connect"
        value={inputPeerId}
        onChange={(e) => setInputPeerId(e.target.value)}
      />
      <button onClick={connectToPeerHandler}>Connect</button>
      <ChessGame />
      {/* Chat component */}
      <div>
        {/* Chat component goes here */}
        <input type="text" placeholder="Type your message..." />
        <button onClick={() => sendMessage("message")}>Send</button>
      </div>
    </div>
  );
};

export default PeerToPeerChess;
