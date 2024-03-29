// pages/index.jsx
"use client";
import React, { useEffect, useState } from "react";
import PeerToPeerChess from "../../components/PeerToPeerChess";
import { createLibp2pNode, createLibp2p } from "../../components/libp2p";
import Chat from "../../components/Chat";

const IndexPage = () => {
  const [libp2p, setLibp2p] = useState(null);

  useEffect(() => {
    async function initializeLibp2p() {
      const node = await createLibp2pNode();
      setLibp2p(node);
    }
    initializeLibp2p();
  }, []);

  return (
    <div>
      <div>
        <Chat />
      </div>
      {libp2p && <PeerToPeerChess libp2p={libp2p} />}
    </div>
  );
};

export default IndexPage;
