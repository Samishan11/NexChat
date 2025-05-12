import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { checkUser } from "@/utils/checkUser";
import { Friend } from "../contact/Contact";
import { Button } from "../ui/button";
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Peer from "peerjs";
interface IProp {
  isCalling: boolean;
  accept: boolean;
  userId: string;
  auth: any;
  data: Friend;
  handelCall: () => void;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  currentUserVideoRef: React.RefObject<HTMLVideoElement>;
  socket: Socket | null;
}

const VideoCall = ({ auth, data, socket }: IProp) => {
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [accept, setAccept] = useState<boolean>(false);
  const [userId, setUserid] = useState<string>("");
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<any>(null);
  const [peerId, setPeerId] = useState<string>("");
  const [remotePeerId, setRemotePeerId] = useState<string>("");

  //

  const [socketId, setSocketId] = useState<{ id: string } | null>(null);

  useEffect(() => {
    if (socket) {
      socket.on("joined_room", (data: any) => {
        setSocketId(data);
      });
    }
  }, [socket]);

  //
  useEffect(() => {
    if (socket) {
      socket.on("callUser", (data: any) => {
        setIsCalling(true);
        setUserid(data.userId);
      });
    }
  }, [socket]);

  useEffect(() => {
    const peer = new Peer();
    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      const getUserMedia = navigator.mediaDevices.getUserMedia;
      getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          if (currentUserVideoRef.current) {
            currentUserVideoRef.current.srcObject = mediaStream;
            currentUserVideoRef.current.play();
          }

          call.answer(mediaStream);

          call.on("stream", function (remoteStream) {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
              remoteVideoRef.current.play();
            }
          });
        })
        .catch((e) => console.log(e));
    });

    peerInstance.current = peer;
  }, []);

  React.useEffect(() => {
    if (!remotePeerId) return;
    const getUserMedia = navigator.mediaDevices.getUserMedia;
    getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        if (currentUserVideoRef.current) {
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();
        }
        if (peerInstance.current) {
          const call = peerInstance.current.call(remotePeerId, mediaStream);
          call.on("stream", (remoteStream: any) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
              remoteVideoRef.current.play();
            }
          });
        }
      })
      .catch((e) => console.log(e));
  }, [remotePeerId]);

  const handleCallAccept = () => {
    if (socket) {
      socket.emit("answerCall", {
        roomId: data.roomId,
        userId: checkUser(auth._id, data as Friend)._id,
        peerId: peerId,
      });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("callAccepted", (data) => {
        console.log(data);
        setAccept(data.accept);
        setRemotePeerId(data.peerId);
      });
    }
  }, [socket, accept]);

  return (
    <Dialog open={isCalling}>
      <DialogContent className="sm:max-w-[425px]">
        <pre>My ID: {socketId?.id}</pre>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            {!accept && (
              <p>
                {userId === auth._id ? "Incoming call " : "Calling to "}
                {checkUser(auth._id, data).fullname}{" "}
              </p>
            )}
            {userId === auth._id && !accept && (
              <Button onClick={handleCallAccept} variant="outline">
                Accept
              </Button>
            )}
            <div>
              <video ref={currentUserVideoRef} />
            </div>
            <div>
              <video ref={remoteVideoRef} />
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">{accept && <video />}</div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCall;
