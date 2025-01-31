import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";
import { WEBRTC_URL } from "../config";
import { useNavigate } from "react-router-dom";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [incomingUserName, setIncomingUserName] = useState(null);
  const [incomingSignal, setIncomingSignal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const newSocket = io(WEBRTC_URL, {
      query: { userId: user.id },
    });

    setSocket(newSocket);

    newSocket.on("callUser", (data) => {
      setIncomingCall(data.from);
      setIncomingUserName(data.name);
      setIncomingSignal(data.signal);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const acceptCall = () => {
    if (incomingCall) {
      navigate(`/call?callerId=${incomingCall}`);
      setIncomingCall(null);
    }
  };

  const rejectCall = () => {
    setIncomingCall(null);
    socket.emit("callRejected", { toUserId: Number(incomingCall) });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        incomingCall,
        incomingUserName,
        incomingSignal,
        acceptCall,
        rejectCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
