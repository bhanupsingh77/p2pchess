"use client";

import html2canvas from "html2canvas";

const Screenshot = async (elementId, setImageUrl, setLoading) => {
  try {
    setLoading(true); // Set loading state to true
    const element = document.getElementById(elementId);
    const canvas = await html2canvas(element);
    const screenshotUrl = canvas.toDataURL(); // Base64 representation of the image
    setImageUrl(uploadedImageUrl); // Update image URL in the state
    setLoading(false); // Set loading state to false
  } catch (error) {
    console.error("Error capturing and uploading screenshot:", error);
    setLoading(false); // Set loading state to false even in case of error
    // Handle error gracefully, e.g., display an error message to the user
  }
};

export default Screenshot;
