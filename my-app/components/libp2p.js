// libp2p.js
import { createLibp2p } from "libp2p";
import { WebRTCStar } from "libp2p-webrtc-star";

export async function createLibp2pNode() {
  // Create libp2p node with WebRTC transport
  const libp2p = await createLibp2p({
    modules: {
      transport: [WebRTCStar],
    },
  });

  // Start libp2p
  await libp2p.start();

  return libp2p;
}

export async function connectToPeer(libp2p, peerId) {
  try {
    await libp2p.dial(peerId);
    console.log(`Connected to peer: ${peerId}`);
  } catch (error) {
    console.error(`Failed to connect to peer: ${peerId}`, error);
  }
}

export { createLibp2p };
