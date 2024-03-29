"use client";

// components/ChatBox.js
import React, { useState, useEffect } from "react";
import styles from "../css/ChatBox.module.css";

const ChatBox = ({ connection }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    connection.on("data", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, [connection]);

  const sendMessage = () => {
    connection.send(message);
    setMessage("");
  };

  return (
    <div className={styles.container}>
      <h2>Chat</h2>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <div className={styles.input_container}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
