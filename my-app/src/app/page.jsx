// pages/index.jsx
"use client";
// pages/index.js
import React, { useState } from "react";
import PeerConnection from "../../componentstwo/PeerConnection";
// import ChessGame from "../../componentstwo/ChessGame";
// import ChatBox from "../../componentstwo/ChatBox";

const IndexPage = () => {
  return (
    <div>
      <h1>Peer-to-Peer Chess Game</h1>
      <PeerConnection />
    </div>
  );
};

export default IndexPage;
