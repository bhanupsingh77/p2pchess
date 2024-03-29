// libp2pNode.js

import { createLibp2p } from "libp2p";
import { webSockets } from "@libp2p/websockets";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { bootstrap } from "@libp2p/bootstrap";
// import { WebRTCStar } from "libp2p-webrtc-star";
import { WebRTC } from "@libp2p/webrtc";

export async function createNode() {
  const node = await createLibp2p({
    // addresses: {
    //   listen: ["/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star"],
    // },
    // peerId: idDialer,
    modules: {
      transport: [WebRTC],
      connEncryption: [noise],
      streamMuxer: [yamux],
    },
  });

  return node;
}
