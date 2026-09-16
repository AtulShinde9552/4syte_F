export default function NotificationPopup({ notifications = [], loading = false }) {
  return (
    <div className="absolute right-0 top-full mt-3 w-[350px] sm:w-[400px] max-h-[480px] bg-white rounded-2xl shadow-xl border border-black/5 overflow-hidden z-50">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-[20px] sm:text-[20px] font-medium text-[#00A292]">
          Notifications
        </h2>
      </div>

      <div className="overflow-y-auto scrollbar-hide max-h-100 px-5 pb-3">
        {loading && notifications.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">
            No notifications yet
          </p>
        ) : (
          notifications.map((n, idx) => (
            <div
              key={n.id ?? idx}
              className={`flex items-start justify-between gap-4 py-4 ${
                idx !== notifications.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              {/* Unread indicator dot */}
              {!n.is_read && (
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00A292]" />
              )}

              <p
                className={`flex-1 text-[13px] sm:text-[14px] leading-snug text-[#1a1a1a] ${
                  n.is_read ? "opacity-60" : ""
                }`}
              >
                <span className="font-medium">{n.sender}: </span>
                {n.message}
              </p>

              <span className="self-end text-[11px] sm:text-xs text-gray-400 whitespace-nowrap shrink-0 pt-0.5">
                {n.time}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}