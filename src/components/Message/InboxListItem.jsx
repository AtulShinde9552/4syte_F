import { Star } from "lucide-react";

export default function InboxListItem({ thread, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 transition-colors cursor-pointer relative overflow-hidden ${
        active ? "bg-[#EAF6F4]" : "hover:bg-gray-50"
      }`}
    >
      {thread.unread && !active && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00A292]" />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className={`text-[13px] sm:text-[16px] truncate ${thread.unread ? 'font-bold text-[#111]' : 'font-medium text-[#00A292]'}`}>
              {thread.campaignId}
            </p>
            {thread.unread && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-600 shrink-0">
                NEW
              </span>
            )}
          </div>
          <p className={`text-[12px] sm:text-[13px] mt-0.5 line-clamp-2 ${thread.unread ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
            {thread.preview}
          </p>
        </div>

        <div className="flex flex-col items-end justify-between gap-1.5 shrink-0 self-stretch">
          <span className={`text-[11px] whitespace-nowrap ${thread.unread ? 'text-[#00A292] font-semibold' : 'text-gray-400'}`}>
            {thread.time}
          </span>
          {thread.unread && (
             <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm mt-1" />
          )}
        </div>
      </div>
    </button>
  );
}