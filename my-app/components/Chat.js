"use client";

import React, { useState, useEffect } from "react";
import { createNode } from "./libp2pNode";
import { multiaddr, protocols } from "@multiformats/multiaddr";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [inputPeerId, setInputPeerId] = useState("");
  const [libp2p, setLibp2p] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [connectedTo, setConnectedTo] = useState("");
  const [chatBoxRef, setChatBoxRef] = useState(null);

  useEffect(() => {
    async function initLibp2p() {
      const node = await createNode();
      setLibp2p(node);

      // Start libp2p node
      await node.start();

      // Get the peer ID after the node is created
      const id = node.peerId.toString();
      setPeerId(id);

      // Check if a peer ID is stored in localStorage and attempt to connect to it
      const storedPeerId = localStorage.getItem("connectedPeerId");
      if (storedPeerId) {
        await connectToPeer(storedPeerId);
      }
    }
    initLibp2p();

    return () => {
      if (libp2p) {
        libp2p.stop();
      }
    };
  }, []);

  // Scroll to the bottom of the chat box
  useEffect(() => {
    if (chatBoxRef) {
      chatBoxRef.scrollTop = chatBoxRef.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const message = inputMessage.trim();
    setMessages((prevMessages) => [...prevMessages, { sender: "Me", message }]);
    setInputMessage("");

    // Send message to connected peer
    if (libp2p && connectedTo) {
      try {
        const connection = await libp2p.dialProtocol(connectedTo);
        const stream = connection.newStream("/chat/1.0.0");
        stream.write(message);
        stream.end();
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const connectToPeer = async (peerIdToConnect) => {
    if (peerIdToConnect.trim() === "") return;

    const peerId = peerIdToConnect.trim();

    // Start the libp2p node if it's not already started
    if (libp2p && !libp2p.isStarted) {
      try {
        await libp2p.start();
      } catch (error) {
        console.error("Failed to start libp2p:", error);
        return;
      }
    }

    // Dial the specified peer ID
    try {
      const relayedMultiaddr = multiaddr(
        `/p2p/${peerId}/webrtc/p2p/${libp2p.peerId.toString()}`
      );
      const connection = await libp2p.dialProtocol(
        relayedMultiaddr,
        "/chat/1.0.0"
      );

      // Handle connection establishment
      setConnectedTo(peerId);

      connection.on("stream", async (stream) => {
        try {
          const data = [];
          for await (const chunk of stream) {
            data.push(chunk);
          }
          const message = Buffer.concat(data).toString();
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: peerId, message },
          ]);
        } catch (error) {
          console.error("Error reading from stream:", error);
        }
      });

      // Store the connected peer ID in localStorage
      localStorage.setItem("connectedPeerId", peerId);
    } catch (error) {
      console.error("Failed to connect to peer:", error);
    }
  };

  return (
    <div>
      <div>
        <p>Your Peer ID: {peerId}</p>
        <p>Connected to: {connectedTo ? connectedTo : "None"}</p>
      </div>
      <div
        ref={(ref) => setChatBoxRef(ref)}
        style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid" }}
      >
        {messages.map((message, index) => (
          <p key={index}>
            <strong>{message.sender}: </strong>
            {message.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
      <div>
        <input
          type="text"
          value={inputPeerId}
          onChange={(e) => setInputPeerId(e.target.value)}
          placeholder="Enter Peer ID"
        />
        <button onClick={() => connectToPeer(inputPeerId)}>Connect</button>
      </div>
    </div>
  );
}
