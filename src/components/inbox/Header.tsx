import { MdArrowBackIos } from "react-icons/md";
import { useLayoutState } from "@/state/layout.state";
import { useEffect, useState, useRef, useCallback } from "react";
import { Socket } from "socket.io-client";
import { checkUser } from "@/utils/checkUser";
import { Friend, IGroup } from "../contact/Contact";
import { ICONS } from "@/constrants/chat.constrants";
import useImageCheckHook from "@/hooks/useImageCheckHook";
import {
  BsMicMute,
  BsMic,
  BsCameraVideo,
  BsCameraVideoOff,
} from "react-icons/bs";

interface HeaderProps {
  handelOpenDetail: () => void;
  data: Friend | IGroup | any;
  auth: any;
  socket: Socket | null;
}

const Header = ({ handelOpenDetail, data, auth, socket }: HeaderProps) => {
  const { setOpen } = useLayoutState();
  const { imageUrl } = useImageCheckHook(
    checkUser(auth._id, data as Friend)?.image
  );

  // Call states
  const [calling, setCalling] = useState(false);
  const [callerId, setCallerId] = useState<string | null>(null);
  const [callStatus, setCallStatus] = useState<
    "idle" | "connecting" | "connected" | "ended"
  >("idle");
  const [callType, setCallType] = useState<"audio" | "video">("audio");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] =
    useState<string>("");
  const [remoteAudioActive, setRemoteAudioActive] = useState(false);

  // Refs
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const candidateQueue = useRef<RTCIceCandidateInit[]>([]);

  // ICE Server Configuration
  const getIceServers = () => {
    return {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        // Add your TURN servers here if available
        // {
        //   urls: "turn:your-turn-server.com:3478",
        //   username: "username",
        //   credential: "password"
        // }
      ],
      iceTransportPolicy: "all" as RTCIceTransportPolicy,
    };
  };

  // Clean up function to end call and release resources
  const cleanupCall = useCallback(() => {
    console.log("Cleaning up call resources");

    if (localStreamRef.current) {
      console.log("Stopping local stream tracks");
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log(`Stopped track: ${track.kind}`);
      });
      localStreamRef.current = null;
    }

    if (peerConnection.current) {
      console.log("Closing peer connection");
      peerConnection.current.close();
      peerConnection.current = null;
    }

    candidateQueue.current = [];
    setCalling(false);
    setCallStatus("idle");
    setCallerId(null);
    setIsAudioMuted(false);
    setIsVideoOff(false);
    setShowPlayButton(false);
    setRemoteAudioActive(false);
  }, []);

  // Setup WebRTC connection with proper ICE servers
  const setupConnection = useCallback(() => {
    console.log("Setting up new peer connection");

    const configuration = getIceServers();
    peerConnection.current = new RTCPeerConnection(configuration);

    peerConnection.current.onicecandidate = (e) => {
      if (e.candidate) {
        console.log("New ICE candidate generated:", e.candidate);
        socket?.emit("ice_candidate", {
          roomId: data.roomId,
          candidate: e.candidate,
          targetId: callerId || checkUser(auth._id, data as Friend)?._id,
        });
      } else {
        console.log("ICE gathering complete");
      }
    };

    peerConnection.current.oniceconnectionstatechange = () => {
      console.log(
        "ICE connection state changed:",
        peerConnection.current?.iceConnectionState
      );
    };

    peerConnection.current.onconnectionstatechange = () => {
      if (peerConnection.current) {
        console.log(
          "Connection state changed:",
          peerConnection.current.connectionState
        );
        switch (peerConnection.current.connectionState) {
          case "connected":
            setCallStatus("connected");
            break;
          case "disconnected":
          case "failed":
            cleanupCall();
            break;
        }
      }
    };

    peerConnection.current.onsignalingstatechange = () => {
      console.log(
        "Signaling state changed:",
        peerConnection.current?.signalingState
      );
    };

    peerConnection.current.ontrack = (e) => {
      console.log("Track event received:", e);
      console.log("Track kind:", e.track.kind);
      console.log("Streams:", e.streams);

      if (e.streams && e.streams.length > 0) {
        const stream = e.streams[0];

        if (e.track.kind === "audio") {
          console.log("Audio track received");
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = stream;
            console.log("Audio stream set on remote audio element");
            setRemoteAudioActive(true);

            remoteAudioRef.current
              .play()
              .then(() => console.log("Remote audio playback started"))
              .catch((err) => {
                console.error("Error playing remote audio:", err);
                setShowPlayButton(true);
              });
          }
        }

        if (
          callType === "video" &&
          e.track.kind === "video" &&
          remoteVideoRef.current
        ) {
          console.log("Video track received");
          remoteVideoRef.current.srcObject = stream;
          remoteVideoRef.current
            .play()
            .then(() => console.log("Remote video playback started"))
            .catch((err) => console.error("Error playing remote video:", err));
        }
      }
    };

    peerConnection.current.onnegotiationneeded = () => {
      console.log("Negotiation needed");
    };
  }, [data.roomId, socket, cleanupCall, callerId, auth._id, data, callType]);

  // Process queued ICE candidates after setting remote description
  const processCandidateQueue = useCallback(async () => {
    console.log("Processing ICE candidate queue");
    if (peerConnection.current && peerConnection.current.remoteDescription) {
      while (candidateQueue.current.length > 0) {
        const candidate = candidateQueue.current.shift();
        if (candidate) {
          try {
            console.log("Adding queued ICE candidate:", candidate);
            await peerConnection.current.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
            console.log("Successfully added queued ICE candidate");
          } catch (err) {
            console.error("Error adding queued ICE candidate:", err);
          }
        }
      }
    }
  }, []);

  // Check media permissions before starting a call
  const checkMediaPermissions = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasAudioInput = devices.some(
        (device) => device.kind === "audioinput"
      );

      if (!hasAudioInput) {
        throw new Error("No audio input devices found");
      }

      if (callType === "video") {
        const hasVideoInput = devices.some(
          (device) => device.kind === "videoinput"
        );
        if (!hasVideoInput) {
          throw new Error("No video input devices found");
        }
      }

      return true;
    } catch (err) {
      console.error("Media permission check failed:", err);
      throw err;
    }
  };

  // Initialize media and start a call
  const handleStartCall = useCallback(
    async (type: "audio" | "video") => {
      if (!socket || !data) {
        console.error("Socket or data not available");
        return;
      }

      try {
        console.log(`Starting ${type} call`);

        // Check permissions first
        await checkMediaPermissions();

        setCalling(true);
        setCallType(type);
        setCallStatus("connecting");
        setupConnection();

        const mediaConstraints = {
          audio: true,
          video: type === "video",
        };

        console.log(
          "Requesting media stream with constraints:",
          mediaConstraints
        );
        const localStream = await navigator.mediaDevices.getUserMedia(
          mediaConstraints
        );
        localStreamRef.current = localStream;
        console.log("Got local stream with tracks:", localStream.getTracks());

        // Setup local audio
        if (localAudioRef.current) {
          localAudioRef.current.srcObject = localStream;
          localAudioRef.current
            .play()
            .then(() => console.log("Local audio playback started"))
            .catch((err) => console.error("Error playing local audio:", err));
        }

        // Setup local video if this is a video call
        if (type === "video" && localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
          localVideoRef.current
            .play()
            .then(() => console.log("Local video playback started"))
            .catch((err) => console.error("Error playing local video:", err));
        }

        // Add all tracks to peer connection
        localStream.getTracks().forEach((track) => {
          console.log(`Adding ${track.kind} track to peer connection`);
          peerConnection.current?.addTrack(track, localStream);
        });

        // Create offer
        const offerOptions = {
          offerToReceiveAudio: true,
          offerToReceiveVideo: type === "video",
        };
        console.log("Creating offer with options:", offerOptions);
        const offer = await peerConnection.current?.createOffer(offerOptions);

        if (!peerConnection.current || !offer) {
          throw new Error("Failed to create offer");
        }

        await peerConnection.current.setLocalDescription(offer);
        console.log("Offer created:", offer);

        // Send offer to other peer
        socket.emit("offer", {
          roomId: data.roomId,
          offer,
          callerId: auth._id,
          callerName: auth.fullname || auth.username,
          targetId: checkUser(auth._id, data as Friend)?._id,
          callType: type,
        });

        // Set timeout for no answer
        setTimeout(() => {
          if (callStatus === "connecting") {
            console.log("No answer received, ending call");
            socket.emit("end_call", {
              roomId: data.roomId,
              targetId: checkUser(auth._id, data as Friend)?._id,
            });
            alert("No answer. Call ended.");
            cleanupCall();
          }
        }, 30000);
      } catch (err: any) {
        console.error("Error starting call:", err);
        let errorMessage = `Failed to start ${type} call.`;

        if (err.name === "NotFoundError") {
          errorMessage =
            "No microphone" +
            (type === "video" ? " or camera" : "") +
            " found.";
        } else if (err.name === "NotAllowedError") {
          errorMessage =
            "Permission denied for microphone" +
            (type === "video" ? " and camera." : ".");
        } else if (err.name === "NotReadableError") {
          errorMessage =
            "Microphone" +
            (type === "video" ? " or camera" : "") +
            " is already in use.";
        } else if (err.message.includes("audioinput")) {
          errorMessage = "No microphone detected. Please connect a microphone.";
        }

        alert(errorMessage);
        cleanupCall();
      }
    },
    [auth, data, socket, callStatus, cleanupCall, setupConnection]
  );

  // Handle incoming call offer
  const handleReceiveOffer = useCallback(
    async (offerData: any) => {
      if (!socket || !data) {
        console.error("Socket or data not available");
        return;
      }

      console.log("Received offer:", offerData);
      try {
        const { offer, callerId, callerName, callType = "audio" } = offerData;
        setCallerId(callerId);
        setCallType(callType);

        const acceptCall = window.confirm(
          `Incoming ${callType} call from ${callerName}. Accept?`
        );

        if (acceptCall) {
          console.log("Accepting call");

          // Check permissions first
          await checkMediaPermissions();

          setCalling(true);
          setCallStatus("connecting");
          setupConnection();

          const mediaConstraints = {
            audio: true,
            video: callType === "video",
          };

          console.log(
            "Requesting media stream with constraints:",
            mediaConstraints
          );
          const localStream = await navigator.mediaDevices.getUserMedia(
            mediaConstraints
          );
          localStreamRef.current = localStream;
          console.log("Got local stream with tracks:", localStream.getTracks());

          // Setup local media elements
          if (localAudioRef.current) {
            localAudioRef.current.srcObject = localStream;
            localAudioRef.current
              .play()
              .then(() => console.log("Local audio playback started"))
              .catch((err) => console.error("Error playing local audio:", err));
          }

          if (callType === "video" && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
            localVideoRef.current
              .play()
              .then(() => console.log("Local video playback started"))
              .catch((err) => console.error("Error playing local video:", err));
          }

          // Add tracks to peer connection
          localStream.getTracks().forEach((track) => {
            console.log(`Adding ${track.kind} track to peer connection`);
            peerConnection.current?.addTrack(track, localStream);
          });

          // Set remote description
          await peerConnection.current?.setRemoteDescription(
            new RTCSessionDescription(offer)
          );
          console.log("Remote description set:", offer);

          // Process any queued ICE candidates
          await processCandidateQueue();

          // Create answer
          const answer = await peerConnection.current?.createAnswer();
          if (!answer || !peerConnection.current) {
            throw new Error("Failed to create answer");
          }

          await peerConnection.current.setLocalDescription(answer);
          console.log("Answer created:", answer);

          // Send answer to caller
          socket.emit("answer", {
            roomId: data.roomId,
            answer,
            targetId: callerId,
          });
        } else {
          console.log("Call rejected by user");
          socket.emit("call_rejected", {
            roomId: data.roomId,
            targetId: callerId,
          });
          setCallerId(null);
        }
      } catch (err: any) {
        console.error("Error handling incoming call:", err);
        let errorMessage = `Failed to answer ${callType} call.`;

        if (err.name === "NotFoundError") {
          errorMessage =
            "No microphone" +
            (callType === "video" ? " or camera" : "") +
            " found.";
        } else if (err.name === "NotAllowedError") {
          errorMessage =
            "Permission denied for microphone" +
            (callType === "video" ? " and camera." : ".");
        } else if (err.name === "NotReadableError") {
          errorMessage =
            "Microphone" +
            (callType === "video" ? " or camera" : "") +
            " is already in use.";
        }

        alert(errorMessage);
        cleanupCall();
      }
    },
    [socket, data, setupConnection, cleanupCall, processCandidateQueue]
  );

  // Handle incoming answer
  const handleReceiveAnswer = useCallback(
    async (answerData: any) => {
      try {
        const { answer } = answerData;
        console.log("Received answer:", answer);
        if (
          peerConnection.current &&
          peerConnection.current.signalingState !== "closed"
        ) {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
          console.log("Remote description set (answer)");
          await processCandidateQueue();
        }
      } catch (err) {
        console.error("Error setting remote description:", err);
        cleanupCall();
      }
    },
    [cleanupCall, processCandidateQueue]
  );

  // Handle new ICE candidate
  const handleNewICECandidate = useCallback(
    async (candidateData: RTCIceCandidateInit) => {
      try {
        console.log("Received ICE candidate:", candidateData);
        if (
          peerConnection.current &&
          peerConnection.current.remoteDescription
        ) {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidateData)
          );
          console.log("ICE candidate added");
        } else {
          candidateQueue.current.push(candidateData);
          console.log("ICE candidate queued");
        }
      } catch (err) {
        console.error("Failed to add ICE candidate:", err);
      }
    },
    []
  );

  const handleCallRejected = useCallback(() => {
    console.log("Call was rejected by the other user");
    alert("Call was rejected by the other user.");
    cleanupCall();
  }, [cleanupCall]);

  const handleCallEnded = useCallback(() => {
    console.log("Call was ended by the other user");
    alert("Call was ended.");
    cleanupCall();
  }, [cleanupCall]);

  const handleInfo = useCallback((data: { message: string }) => {
    console.log("Info message received:", data.message);
    alert(data.message);
  }, []);

  const endCall = useCallback(() => {
    console.log("Ending call");
    if (socket && data) {
      socket.emit("end_call", {
        roomId: data.roomId,
        targetId: callerId || checkUser(auth._id, data as Friend)?._id,
      });
    }
    cleanupCall();
  }, [socket, data, callerId, cleanupCall, auth._id]);

  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
        console.log("Audio track toggled. Enabled:", audioTrack.enabled);
      } else {
        console.warn("No audio track found in local stream");
      }
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current && callType === "video") {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
        console.log("Video track toggled. Enabled:", videoTrack.enabled);
      } else {
        console.warn("No video track found in local stream");
      }
    }
  }, [callType]);

  const handleAutoPlay = useCallback(() => {
    console.log("Attempting autoplay");
    const playMedia = async () => {
      if (remoteAudioRef.current && remoteAudioRef.current.srcObject) {
        try {
          await remoteAudioRef.current.play();
          console.log("Autoplay: Remote audio started");
          setShowPlayButton(false);
        } catch (err) {
          console.error("Autoplay error (audio):", err);
          setShowPlayButton(true);
        }
      }

      if (
        callType === "video" &&
        remoteVideoRef.current &&
        remoteVideoRef.current.srcObject
      ) {
        try {
          await remoteVideoRef.current.play();
          console.log("Autoplay: Remote video started");
        } catch (err) {
          console.error("Autoplay error (video):", err);
        }
      }
    };

    playMedia();
  }, [callType]);

  const handleManualPlay = useCallback(() => {
    console.log("Manual play initiated by user");
    if (remoteAudioRef.current && remoteAudioRef.current.srcObject) {
      remoteAudioRef.current
        .play()
        .then(() => {
          console.log("Manual audio playback started");
          setShowPlayButton(false);
        })
        .catch((err) => console.error("Error in manual audio playback:", err));
    }
  }, []);

  // Setup event listeners, join room, and enumerate devices
  useEffect(() => {
    if (socket && auth._id && data.roomId) {
      console.log("Joining room:", data.roomId);
      socket.emit("join", { userId: auth._id, roomId: data.roomId });

      socket.on("receive_offer", handleReceiveOffer);
      socket.on("receive_answer", handleReceiveAnswer);
      socket.on("receive_candidate", handleNewICECandidate);
      socket.on("call_rejected", handleCallRejected);
      socket.on("call_ended", handleCallEnded);
      socket.on("info", handleInfo);

      // Enumerate devices on mount
      const enumerateDevices = async () => {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(
            (device) => device.kind === "videoinput"
          );
          setVideoDevices(videoDevices);
          if (videoDevices.length > 0) {
            setSelectedVideoDeviceId(videoDevices[0].deviceId);
          }
          console.log("Available devices:", devices);
        } catch (err) {
          console.error("Error enumerating devices:", err);
        }
      };
      enumerateDevices();

      return () => {
        console.log("Cleaning up socket listeners");
        socket.off("receive_offer");
        socket.off("receive_answer");
        socket.off("receive_candidate");
        socket.off("call_rejected");
        socket.off("call_ended");
        socket.off("info");
      };
    }
  }, [
    socket,
    auth._id,
    data.roomId,
    handleReceiveOffer,
    handleReceiveAnswer,
    handleNewICECandidate,
    handleCallRejected,
    handleCallEnded,
    handleInfo,
  ]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (calling) {
        console.log("Component unmounting during active call, cleaning up");
        cleanupCall();
      }
    };
  }, [calling, cleanupCall]);

  // Audio and video elements
  const renderMediaElements = () => (
    <>
      <audio
        ref={localAudioRef}
        autoPlay
        playsInline
        muted
        style={{ display: "none" }}
      />
      <audio
        ref={remoteAudioRef}
        autoPlay
        playsInline
        onCanPlay={handleAutoPlay}
        style={{ display: "none" }}
      />
      {callType === "video" && (
        <>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{ display: "none" }}
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            onCanPlay={handleAutoPlay}
            style={{ display: "none" }}
          />
        </>
      )}
    </>
  );

  // Call UI
  const renderCallUI = () => {
    if (calling) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-lg font-medium mb-4">
              {callStatus === "connecting"
                ? `Connecting ${callType} call...`
                : `${
                    callType.charAt(0).toUpperCase() + callType.slice(1)
                  } Call`}
            </h3>

            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isAudioMuted ? "bg-red-500" : "bg-green-500"
                  }`}
                ></div>
                <span>
                  {isAudioMuted
                    ? "Your microphone is muted"
                    : "Your microphone is active"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    remoteAudioActive ? "bg-green-500" : "bg-yellow-500"
                  }`}
                ></div>
                <span>
                  {remoteAudioActive
                    ? "Remote audio is active"
                    : "Waiting for remote audio"}
                </span>
              </div>
            </div>

            {callType === "video" && (
              <>
                <div className="flex flex-col gap-4 mb-4">
                  <div className="relative bg-black rounded-lg h-48 flex items-center justify-center">
                    {remoteVideoRef.current?.srcObject ? (
                      <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white">
                        Remote video{" "}
                        {remoteAudioActive ? "is off" : "not available"}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <div className="w-24 h-24 bg-black rounded-lg overflow-hidden absolute bottom-2 right-2">
                      {localVideoRef.current?.srcObject ? (
                        <video
                          ref={localVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-white text-xs flex items-center justify-center h-full">
                          Your camera
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {videoDevices.length > 1 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Select Camera:
                    </label>
                    <select
                      value={selectedVideoDeviceId}
                      onChange={(e) => setSelectedVideoDeviceId(e.target.value)}
                      className="w-full p-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
                    >
                      {videoDevices.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Camera ${device.deviceId}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {showPlayButton && (
              <button
                onClick={handleManualPlay}
                className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-full"
              >
                Click to Play Audio
              </button>
            )}

            <div className="flex gap-4">
              <button
                onClick={toggleAudio}
                className={`flex-1 py-2 rounded-md ${
                  isAudioMuted
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-gray-500 hover:bg-gray-600 text-white"
                }`}
                title={isAudioMuted ? "Unmute" : "Mute"}
              >
                {isAudioMuted ? <BsMicMute size={20} /> : <BsMic size={20} />}
              </button>

              {callType === "video" && (
                <button
                  onClick={toggleVideo}
                  className={`flex-1 py-2 rounded-md ${
                    isVideoOff
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gray-500 hover:bg-gray-600 text-white"
                  }`}
                  title={isVideoOff ? "Turn on camera" : "Turn off camera"}
                >
                  {isVideoOff ? (
                    <BsCameraVideoOff size={20} />
                  ) : (
                    <BsCameraVideo size={20} />
                  )}
                </button>
              )}

              <button
                onClick={endCall}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
                title="End call"
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {renderMediaElements()}
      {renderCallUI()}

      <div className="border-b dark:border-neutral-700 border-neutral-200 flex justify-between gap-10 items-center h-20 px-6">
        <div className="flex gap-4 items-center justify-center">
          <MdArrowBackIos
            onClick={() => setOpen(false)}
            className="md:hidden block cursor-pointer"
          />
          <img className="w-10 rounded-full" src={imageUrl} alt="" />
          <div>
            <p className="font-medium">
              {data.groupName
                ? data.groupName
                : checkUser(auth._id, data as Friend)?.fullname}
            </p>
          </div>
        </div>
        <div className="flex gap-6 items-start">
          {ICONS.map((item, ind) => (
            <div
              key={ind}
              onClick={
                item.name === "user"
                  ? handelOpenDetail
                  : item.name === "call" && !calling && !data.groupName
                  ? () => handleStartCall("audio")
                  : item.name === "video" && !calling && !data.groupName
                  ? () => handleStartCall("video")
                  : undefined
              }
              className={`${
                (calling || data.groupName) &&
                (item.name === "call" || item.name === "video")
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:opacity-80"
              }`}
              title={
                item.name === "call"
                  ? "Voice call"
                  : item.name === "video"
                  ? "Video call"
                  : item.name === "user"
                  ? "User details"
                  : ""
              }
            >
              {item.icon}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;
