"use client";

import { useReducer } from "react";

const initialState = {
  peer: null,
  connection: null,
  error: null,
  connections: [], // Add connections property with an empty array
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PEER":
      return { ...state, peer: action.payload };
    case "SET_CONNECTION":
      return { ...state, connection: action.payload };
    case "ADD_CONNECTION":
      return { ...state, connections: [...state.connections, action.payload] };
    case "REMOVE_CONNECTION":
      return {
        ...state,
        connections: state.connections.filter(
          (conn) => conn.peer !== action.payload
        ),
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const usePeerReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
};

export default usePeerReducer;
