import { ChevronDown, PanelLeftOpen, PanelLeftClose } from "lucide-react";

import InboxListItem from "./InboxListItem";

export default function InboxList({
  threads,
  activeThreadId,
  onSelectThread,
  collapsed,
  onToggleCollapse,
}) {
  const hasUnreadThreads = threads.some((thread) => thread.unread);

  return (
    <div className={`${collapsed ? "w-12" : "w-full sm:w-[380px] lg:w-[420px]"} shrink-0 flex flex-col min-h-0 border border-[#DBDBDB] rounded-2xl overflow-hidden transition-[width] duration-300 ease-in-out`}>
      {collapsed ? (
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Expand message threads"
            title="Expand message threads"
            className="mt-3 w-9 h-9 flex items-center justify-center rounded-full text-[#00A292] hover:bg-[#EAF6F4] transition-colors cursor-pointer"
          >
            <PanelLeftOpen size={18} />
          </button>
          {hasUnreadThreads && (
            <span
              className="mt-3 w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"
              aria-label="Unread messages"
              title="Unread messages"
            />
          )}
          {activeThreadId && !hasUnreadThreads && (
            <span className="mt-3 w-2.5 h-2.5 rounded-full bg-[#00A292]" aria-label="Conversation selected" />
          )}
        </div>
      ) : (
        <>
          {/* Inbox filter bar */}
          <div className="flex items-center gap-2 p-3 border-b border-gray-100 shrink-0">
            <button
              type="button"
              className="flex-1 flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-[#FCFCFC] border border-gray-50 text-[13px] text-gray-400 shadow-sm hover:border-[#00A292]/50 transition-colors cursor-pointer"
            >
              INBOX
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Collapse message threads"
              title="Collapse message threads"
              className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full text-gray-400 hover:text-[#00A292] hover:bg-[#EAF6F4] transition-colors cursor-pointer"
            >
              <PanelLeftClose size={17} />
            </button>
          </div>

          {/* Threads */}
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-gray-100">
            {threads.map((thread) => (
              <InboxListItem
                key={thread.id}
                thread={thread}
                active={thread.id === activeThreadId}
                onClick={() => onSelectThread(thread.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}