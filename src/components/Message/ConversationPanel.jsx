import { useEffect, useRef } from "react";
import { User } from "lucide-react";
import { assetUrl } from "../../api";

import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";

export default function ConversationPanel({
  thread,
  participantAvatar,
  messages,
  messageText,
  onMessageTextChange,
  onSend,
}) {
  const messagesContainerRef = useRef(null);
  const isAtBottomRef = useRef(true);
  const previousThreadIdRef = useRef(thread?.id);
  const previousMessagesRef = useRef([]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const previousMessages = previousMessagesRef.current;
    const previousLastMessage = previousMessages[previousMessages.length - 1];
    const lastMessage = messages[messages.length - 1];
    const threadChanged = previousThreadIdRef.current !== thread?.id;
    const hasNewMessage =
      messages.length > previousMessages.length ||
      (lastMessage && lastMessage.id !== previousLastMessage?.id);

    if (threadChanged || hasNewMessage || isAtBottomRef.current) {
      container.scrollTop = container.scrollHeight;
      isAtBottomRef.current = true;
    }

    previousThreadIdRef.current = thread?.id;
    previousMessagesRef.current = messages;
  }, [thread?.id, messages]);

  function handleMessagesScroll() {
    const container = messagesContainerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    isAtBottomRef.current = distanceFromBottom <= 24;
  }

  if (!thread) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center border border-gray-100 rounded-2xl text-[13px] text-gray-400">
        Select a conversation
      </div>
    );
  }

  const cachedAdminAvatar = (() => {
    try {
      return localStorage.getItem("orgAdminAvatar");
    } catch {
      return null;
    }
  })();

  const conversationAvatar = participantAvatar || thread.avatar || cachedAdminAvatar;
  const conversationAvatarUrl = conversationAvatar && !conversationAvatar.startsWith("http")
    ? assetUrl(conversationAvatar)
    : conversationAvatar;

  return (
    <div className="flex-1 min-h-0 flex flex-col border border-[#DBDBDB] rounded-2xl overflow-hidden">
      {/* Conversation header */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {conversationAvatarUrl ? (
              <img
                src={conversationAvatarUrl}
                alt={thread.sender}
                className="w-full h-full object-cover"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "https://ui-avatars.com/api/?name=Org+Admin&background=111&color=fff";
                }}
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
      <div
        ref={messagesContainerRef}
        onScroll={handleMessagesScroll}
        className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4"
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} threadAvatar={conversationAvatar} />
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
