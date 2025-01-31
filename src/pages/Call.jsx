import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { useAuth } from "../services/AuthContext";
import { useSocket } from "../services/SocketContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PuffLoader } from "react-spinners"; // To parse query parameters

function CallPage() {
  const { user } = useAuth();
  const { socket, incomingSignal } = useSocket();
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [hasJoinedCall, setHasJoinedCall] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const [searchParams] = useSearchParams();
  const idToCall = searchParams.get("id");
  const callerId = searchParams.get("callerId");
  const navigate = useNavigate();

  useEffect(() => {
    const constraints = {
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 },
      },
      audio: true,
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) myVideo.current.srcObject = stream;

        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) videoTrack.enabled = false;

        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) audioTrack.enabled = false;

        setVideoEnabled(false);
        setAudioEnabled(false);
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("callEnded", () => {
      console.log("callEnded");
      setCallAccepted(false);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }

      if (userVideo.current) {
        userVideo.current.srcObject = null;
      }
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
      navigate("/messages");
    });

    return () => {
      socket.off("callEnded");
    };
  }, [socket]);

  useEffect(() => {
    if (stream && callerId && incomingSignal && !hasJoinedCall) {
      joinExistingCall();
      setHasJoinedCall(true);
    } else if (stream && idToCall) {
      callUser(idToCall);
    }
  }, [idToCall, stream, incomingSignal]);

  const joinExistingCall = () => {
    if (!incomingSignal || !stream) {
      console.error("Missing incoming signal or stream");
      return;
    }
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      const signalData = { signal: data, toUserId: Number(callerId) };
      socket.emit("answerCall", signalData);
    });

    peer.on("stream", (remoteStream) => {
      userVideo.current.srcObject = remoteStream;
    });

    peer.signal(incomingSignal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        fromUserId: user.id,
        toUserId: Number(id),
        signalData: data,
      });
    });

    peer.on("stream", (remoteStream) => {
      userVideo.current.srcObject = remoteStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallAccepted(false);

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    if (userVideo.current) userVideo.current.srcObject = null;
    if (myVideo.current) myVideo.current.srcObject = null;

    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }

    socket.emit("callEnded", {
      toUserId: Number(idToCall) || Number(callerId),
    });

    // Navigate back to the messages page
    navigate("/messages");
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);

        if (connectionRef.current) {
          const sender = connectionRef.current._pc
            .getSenders()
            .find((s) => s.track?.kind === "video");
          if (sender) {
            sender.track.enabled = videoTrack.enabled;
          }
        }
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);

        if (connectionRef.current) {
          const sender = connectionRef.current._pc
            .getSenders()
            .find((s) => s.track?.kind === "audio");
          if (sender) {
            sender.track.enabled = audioTrack.enabled;
          }
        }
      }
    }
  };

  return (
    <div className="p-8 bg-gray-950 min-h-screen max-h-screen font-merriweather_sans flex flex-col items-center overflow-hidden">
      <div className="flex flex-col items-center space-y-6 w-full max-w-screen-lg">
        {/* Remote Video */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg bg-gray-900 w-full max-w-screen-lg aspect-video h-[45vh]">
          <video
            playsInline
            ref={userVideo}
            autoPlay
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
          {!callAccepted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <PuffLoader color="#ffffff" size={150} />
            </div>
          )}
        </div>

        {/* Local Video */}
        <div className="rounded-3xl overflow-hidden shadow-lg bg-gray-900 w-full max-w-screen-lg aspect-video h-[45vh]">
          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-6 absolute bottom-5">
        {/* End Call */}

        <span
          onClick={leaveCall}
          className="px-6 py-2 cursor-pointer bg-red-600 text-white rounded-full hover:bg-red-700 transition material-symbols-rounded"
        >
          call_end
        </span>

        {/* Toggle Video */}

        <span
          onClick={toggleVideo}
          className={`px-6 py-2 cursor-pointer material-symbols-rounded text-white rounded-full transition ${
            videoEnabled
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-500 hover:bg-gray-600"
          }`}
        >
          {videoEnabled ? "videocam" : "videocam_off"}
        </span>

        {/* Toggle Audio */}

        <span
          onClick={toggleAudio}
          className={`px-6 py-2 cursor-pointer text-white rounded-full transition material-symbols-rounded ${
            audioEnabled
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-500 hover:bg-gray-600"
          }`}
        >
          {audioEnabled ? "mic" : "mic_off"}
        </span>
      </div>
    </div>
  );
}

export default CallPage;
