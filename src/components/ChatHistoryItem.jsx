import React from "react";

function ChatHistoryItem({
  chat,
  selectedChatId,
  setSelectedChatId,
  setSelectedChatObject,
  readChat,
  messages,
  currentUserId,
}) {
  const { receiver, unreadMessages, chatId } = chat;

  const lastMessage = messages?.slice(-1)[0];
  const isLastMessageSentByUser = lastMessage?.senderId === currentUserId;

  const getInitials = (name) =>
    name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();

  const receiverInitials = getInitials(
    `${receiver.firstName} ${receiver.lastName}`,
  );

  return (
    <div
      onClick={() => {
        setSelectedChatId(chatId);
        setSelectedChatObject(chat);
        readChat(chatId);
      }}
      className={`flex items-center p-3 border border-gray-200 cursor-pointer transition-all overflow-hidden ${
        selectedChatId === chatId ? "bg-gray-100 border-gray-400" : "bg-white"
      } hover:bg-gray-100`}
    >
      {/* Profile Picture */}
      <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center font-bold text-blue-800 text-lg">
        {receiverInitials}
      </div>

      {/* Message Details */}
      <div className="flex flex-col ml-3 flex-1">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium text-gray-800 truncate">
            {`${receiver.firstName} ${receiver.lastName}`}
          </h4>
          {lastMessage?.sendAt && (
            <span className="text-xs text-gray-500">
              {new Date(lastMessage?.sendAt + "Z").toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
        <p
          className={`text-xs truncate max-w-md ${
            isLastMessageSentByUser ? "text-gray-400 italic" : "text-gray-600"
          }`}
        >
          {isLastMessageSentByUser
            ? `You: ${lastMessage?.messageContent}`
            : lastMessage?.messageContent}
        </p>
      </div>

      {/* Unread Badge */}
      {!isLastMessageSentByUser && unreadMessages > 0 && (
        <div className="ml-2 w-6 h-6 flex items-center justify-center bg-blue-500 text-white text-xs font-bold rounded-full">
          {unreadMessages}
        </div>
      )}
    </div>
  );
}

export default ChatHistoryItem;
