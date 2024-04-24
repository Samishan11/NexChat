// import { useEffect, useRef, useState } from "react";
// import SimplePeer from "simple-peer";
// import { Socket } from "socket.io-client";

// const VideoCall = ({ socket }: { socket: Socket | null }) => {
//   const peer = useRef<SimplePeer.Instance | null>(null);

//   const localVideoRef = useRef<HTMLAudioElement | null>(null);
//   const remoteVideoRef = useRef<HTMLAudioElement | null>(null);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     if (!socket) return;
//     socket.on("offer", (data) => {
//       // Handle incoming offer
//       if (peer && peer.current) {
//         peer.current = new SimplePeer({
//           initiator: false,
//           trickle: false,
//         });
//         peer.current.on("signal", (signal) => {
//           // Send answer to the caller
//           socket.emit("answer", {
//             sender: data.sender,
//             sdp: signal,
//           });
//         });
//         peer.current.on("stream", (stream) => {
//           if (remoteVideoRef && remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = stream;
//             setIsConnected(true);
//           }
//         });
//         peer.current.signal(data.sdp);
//         socket.on("answer", (data) => {
//           if (peer && peer.current) {
//             peer.current.signal(data.sdp);
//           }
//         });

//         // Handle incoming ICE candidate
//         socket.on("icecandidate", (data) => {
//           if (peer && peer.current) {
//             (peer.current as any).addIceCandidate(data.candidate);
//           }
//         });
//       }
//     });

//     return () => {
//       if (peer.current) {
//         peer.current.destroy();
//       }
//       socket.disconnect();
//     };
//   }, [socket]);

//   const startCall = async () => {
//     if (!socket) return;
//     // Get local media stream
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: false,
//       audio: true,
//     });

//     // Display local stream
//     if (localVideoRef && localVideoRef.current) {
//       localVideoRef.current.srcObject = stream;
//     }

//     // Initialize SimplePeer as initiator
//     peer.current = new SimplePeer({
//       initiator: true,
//       trickle: false,
//       stream: stream,
//     });

//     peer.current.on("signal", (signal) => {
//       // Send offer to the callee
//       socket.emit("offer", {
//         recipient: "recipientSocketId",
//         sdp: signal,
//       });
//     });

//     peer.current.on("stream", (remoteStream) => {
//       // Display remote stream
//       if (remoteVideoRef && remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = remoteStream;
//         setIsConnected(true);
//       }
//     });

//     peer.current.on("error", (err) => {
//       console.error("Peer error:", err);
//     });
//   };

//   const endCall = () => {
//     if (peer.current) {
//       peer.current.destroy();
//       setIsConnected(false);
//     }
//   };

//   return (
//     <div>
//       <audio ref={localVideoRef} autoPlay muted></audio>
//       <audio ref={remoteVideoRef} autoPlay></audio>
//       {!isConnected && <button onClick={startCall}>Start Call</button>}
//       {isConnected && <button onClick={endCall}>End Call</button>}
//     </div>
//   );
// };

// export default VideoCall;
