import { User } from "lucide-react";

import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";

export default function ConversationPanel({
  thread,
  messages,
  messageText,
  onMessageTextChange,
  onSend,
}) {
  if (!thread) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center border border-gray-100 rounded-2xl text-[13px] text-gray-400">
        Select a conversation
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col border border-[#DBDBDB] rounded-2xl overflow-hidden">
      {/* Conversation header */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {thread.avatar ? (
              <img
                src={thread.avatar}
                alt={thread.sender}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={18} className="text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-gray-800 truncate">
              {thread.sender}
            </p>
            <p className="text-[12px]  truncate">{thread.role}</p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-[13px] font-medium text-[#00A292]">
            {thread.campaignId}
          </p>
          <p className="text-[11px] text-gray-400">{thread.time}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* Composer */}
      <MessageInput
        value={messageText}
        onChange={onMessageTextChange}
        onSend={onSend}
      />
    </div>
  );
}