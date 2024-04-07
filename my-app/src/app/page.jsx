// pages/index.jsx
"use client";
// pages/index.js
import React, { useState, useMemo } from "react";
import PeerConnection from "../../componentstwo/PeerConnection";
// import ChessGame from "../../componentstwo/ChessGame";
// import ChatBox from "../../componentstwo/ChatBox";
import * as web3 from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

const IndexPage = () => {
  const endpoint = web3.clusterApiUrl("devnet");
  const wallets = useMemo(() => [], []);

  return (
    <div>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>
            <WalletMultiButton />
            <h1>Peer-to-Peer Chess Game</h1>
            <PeerConnection />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
};

export default IndexPage;
