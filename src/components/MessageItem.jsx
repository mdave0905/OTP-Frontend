import React from "react";

function MessageItem({ message, currentUserId }) {
  return (
    <div className="flex flex-col space-y-1">
      <div
        style={{ whiteSpace: "pre-wrap" }}
        className={`px-3 py-1.5 rounded-lg max-w-xl ${
          message.senderId === currentUserId
            ? "bg-blue-100 text-blue-900 self-end"
            : "bg-gray-200 text-gray-800 self-start"
        }`}
      >
        {message.messageContent}
      </div>
      <p
        className={`text-xs text-gray-500 ${message.senderId === currentUserId ? "self-end" : "self-start"}`}
      >
        {new Date(message.sendAt + "Z").toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}

export default MessageItem;
