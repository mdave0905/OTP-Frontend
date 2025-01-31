import { useSocket } from "../services/SocketContext";
import ActionButton from "./ActionButton";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

const CallNotification = () => {
  const { incomingCall, acceptCall, rejectCall } = useSocket();

  const [userName, setUserName] = useState();

  useEffect(() => {
    const fetchUserName = async () => {
      if (incomingCall) {
        try {
          const res = await fetch(
            `${BACKEND_URL}/user/get-user/${incomingCall}`,
          );
          const data = await res.json();
          setUserName(data.fullName);
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchUserName();
  }, [incomingCall]);
  if (!incomingCall) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-gray-900 text-white p-6 rounded-3xl shadow-lg font-merriweather_sans">
      <>
        <div className="flex space-x-2">
          <span className="text-xl text-white material-symbols-rounded">
            call
          </span>
          <p className="text-lg text-center w-full">
            Incoming Call from {userName}
          </p>
        </div>

        <div className="flex space-x-4 mt-4">
          <ActionButton
            onClick={acceptCall}
            text={"Accept"}
            design={"positive"}
          />
          <ActionButton onClick={rejectCall} text={"Reject"} design={"alert"} />
        </div>
      </>
    </div>
  );
};

export default CallNotification;
