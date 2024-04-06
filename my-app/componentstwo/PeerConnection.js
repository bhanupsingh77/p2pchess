"use client";

import { useRef, useEffect, useState } from "react";
import Peer from "peerjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import usePeerReducer from "../customHooks/usePeerReducer";
import ChessGame from "./ChessGame";
import ScreenshotComponent from "./Screenshot";

const PeerConnection = () => {
  const { state, dispatch } = usePeerReducer();
  const [connecting, setConnecting] = useState(false);
  const [peerIdInput, setPeerIdInput] = useState("");
  const peerRef = useRef(null);

  useEffect(() => {
    const initializePeer = async () => {
      try {
        const peer = new Peer();
        peerRef.current = peer;

        peer.on("open", () => {
          dispatch({ type: "SET_PEER", payload: peer });
        });

        peer.on("connection", (conn) => {
          dispatch({ type: "ADD_CONNECTION", payload: conn });
          toast.info(`Connected to ${conn.peer}`);
          dispatch({ type: "SET_CONNECTION", payload: conn }); // Set the connection state when a connection is established
        });

        peer.on("error", (error) => {
          toast.error("PeerJS Error: " + error.message);
          dispatch({ type: "SET_ERROR", payload: error });
        });

        peer.on("disconnected", () => {
          toast.warn("Disconnected from Peer server");
          dispatch({ type: "SET_PEER", payload: null });
          dispatch({ type: "REMOVE_CONNECTIONS" }); // Clear connections when disconnected
          dispatch({ type: "SET_CONNECTION", payload: null }); // Clear connection state
        });
      } catch (error) {
        toast.error("PeerJS Initialization Error: " + error.message);
        dispatch({ type: "SET_ERROR", payload: error });
      }
    };

    initializePeer();

    return () => {
      if (peerRef.current) {
        peerRef.current.disconnect();
      }
    };
  }, [dispatch]);

  const handleConnect = () => {
    setConnecting(true);
    try {
      if (state.connection) {
        state.connection.close(); // Close existing connection
        dispatch({ type: "SET_CONNECTION", payload: null }); // Clear connection state
      }
      const conn = state.peer.connect(peerIdInput, { reliable: true });
      dispatch({ type: "SET_CONNECTION", payload: conn }); // Set the connection state
      toast.info(`Connecting to ${peerIdInput}`);
    } catch (error) {
      toast.error("Connection Error: " + error.message);
      dispatch({ type: "SET_ERROR", payload: error });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = (conn) => {
    if (conn && conn.peer) {
      conn.close();
      dispatch({ type: "REMOVE_CONNECTION", payload: conn.peer });
    }
  };

  const handleInputChange = (event) => {
    setPeerIdInput(event.target.value);
  };
  console.log(1, state);
  return (
    <div>
      {state.error && (
        <div>
          <h2>Error</h2>
          <p>{state.error.message}</p>
        </div>
      )}
      {state.peer && (
        <ScreenshotComponent elementId="elementToCapture">
          <div id="elementToCapture">
            <h2>Peer Connection</h2>
            <p>Your Peer ID: {state.peer.id || "Loading..."}</p>
            <input
              type="text"
              value={peerIdInput}
              onChange={handleInputChange}
              placeholder="Enter Peer ID"
            />
            <button onClick={handleConnect} disabled={connecting}>
              {connecting ? "Connecting..." : "Connect to Peer"}
            </button>
          </div>
        </ScreenshotComponent>
      )}
      <div>
        <h2>Peer Connections</h2>
        <ul>
          {state.connections?.map((conn) => (
            <li key={conn.peer}>
              {conn.peer}
              <button onClick={() => handleDisconnect(conn)}>Disconnect</button>
            </li>
          ))}
        </ul>
      </div>
      {state.connection && <ChessGame state={state} />}
      {/* Render ChessGame component only when a connection is established */}
    </div>
  );
};

export default PeerConnection;
