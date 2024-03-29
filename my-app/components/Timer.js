"use client";
import React, { useState, useEffect } from "react";

const Timer = ({ initialTime }) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>Time Remaining: {time} seconds</div>;
};

export default Timer;
