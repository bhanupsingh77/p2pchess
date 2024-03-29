// pages/index.jsx
"use client";
// pages/index.js
import React, { useState } from "react";
import PeerConnection from "../../componentstwo/PeerConnection";
import ChessGame from "../../componentstwo/ChessGame";
import ChatBox from "../../componentstwo/ChatBox";

const IndexPage = () => {
  const [connection, setConnection] = useState(null);

  const handleConnect = (conn) => {
    setConnection(conn);
  };

  const handleDisconnect = () => {
    if (connection) {
      connection.close();
      setConnection(null);
    }
  };

  return (
    <div>
      <h1>Peer-to-Peer Chess Game</h1>
      <PeerConnection
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
      {connection && (
        <div>
          <ChessGame connection={connection} />
          <ChatBox connection={connection} />
        </div>
      )}
    </div>
  );
};

export default IndexPage;
