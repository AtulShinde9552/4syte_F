import { ChevronDown } from "lucide-react";

import InboxListItem from "./InboxListItem";

export default function InboxList({ threads, activeThreadId, onSelectThread }) {
  return (
    <div className="w-full sm:w-[380px] lg:w-[420px] shrink-0 flex flex-col min-h-0 border border-[#DBDBDB] rounded-2xl overflow-hidden">
      {/* Inbox filter bar */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-100 shrink-0">
        <button
          type="button"
          className="flex-1 flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-[#FCFCFC] border border-gray-50 text-[13px] text-gray-400 shadow-sm hover:border-[#00A292]/50 transition-colors cursor-pointer"
        >
          INBOX
          <ChevronDown size={16} className="text-gray-400" />
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
    </div>
  );
}