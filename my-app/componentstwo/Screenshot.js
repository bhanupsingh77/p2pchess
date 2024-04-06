import React from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

const captureScreenshot = (elementId) => {
  const element = document.getElementById(elementId);

  html2canvas(element).then((canvas) => {
    // Convert the canvas to blob
    return canvas.toBlob((blob) => {
      // Save the blob as a file using file-saver
      saveAs(blob, "screenshot.png");
    });
  });
};

const ScreenshotComponent = ({ elementId, children }) => {
  const handleCapture = () => {
    captureScreenshot(elementId);
  };

  return (
    <div>
      <button onClick={handleCapture}>Capture Screenshot</button>
      <div id={elementId}>{children}</div>
    </div>
  );
};

export default ScreenshotComponent;
