"use client";

import React, { useState, useEffect } from "react";
import styles from "../css/PeerConnection.module.css";
import Peer, { DataConnection } from "peerjs";

const PeerConnection = ({ onConnect, onDisconnect }) => {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("");
  const [connectionMap, setConnectionMap] = useState(new Map());

  useEffect(() => {
    const peer = new Peer();
    peer.on("open", () => {
      setPeer(peer);
    });

    peer.on("connection", (conn) => {
      console.log("Incoming connection from peer", conn.peer);
      setConnectionMap(new Map(connectionMap.set(conn.peer, conn)));
    });

    return () => {
      peer.disconnect();
    };
  }, []);

  const connectPeer = async (id) => {
    return new Promise((resolve, reject) => {
      if (!peer) {
        reject(new Error("Peer doesn't start yet"));
        return;
      }
      if (connectionMap.has(id)) {
        reject(new Error("Connection existed"));
        return;
      }
      try {
        let conn = peer.connect(id, { reliable: true });
        if (!conn) {
          reject(new Error("Connection can't be established"));
        } else {
          conn
            .on("open", function () {
              console.log("Connect to: " + id);
              setConnectionMap(new Map(connectionMap.set(id, conn)));
              resolve();
            })
            .on("error", function (err) {
              console.log(err);
              reject(err);
            });
        }
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleConnect = () => {
    connectPeer(peerId)
      .then(() => {
        setConnectionStatus("Connected");
        onConnect();
      })
      .catch((err) => {
        console.error("Failed to connect to peer:", err.message);
        setConnectionStatus("Disconnected");
      });
  };

  const handleDisconnect = () => {
    if (!peer) return;
    peer.disconnect();
    onDisconnect();
    setConnectionStatus("Disconnected");
  };

  return (
    <div className={styles.peerConnection}>
      <h2>Peer Connection</h2>
      <p>Your Peer ID: {peer ? peer.id : "Loading..."}</p>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter Peer ID"
          value={peerId}
          onChange={(e) => setPeerId(e.target.value)}
        />
        <button className={styles.button} onClick={handleConnect}>
          Connect
        </button>
        <button className={styles.button} onClick={handleDisconnect}>
          Disconnect
        </button>
      </div>
      <p>Connection Status: {connectionStatus}</p>
      <p>Connected Peers:</p>
      <ul>
        {Array.from(connectionMap.keys()).map((peerId) => (
          <li key={peerId}>{peerId}</li>
        ))}
      </ul>
    </div>
  );
};

export default PeerConnection;
