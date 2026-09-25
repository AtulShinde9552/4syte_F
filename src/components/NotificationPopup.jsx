import { assetUrl } from "../api";

export default function NotificationPopup({
  notifications = [],
  loading = false,
  participantAvatar,
}) {
  const visibleNotifications = notifications.slice(0, 5);

  return (
    <div className="absolute right-0 top-full mt-3 w-[min(360px,calc(100vw-2rem))] max-h-[min(420px,calc(100vh-6rem))] bg-white rounded-2xl shadow-xl border border-black/5 overflow-hidden z-50">
      <div className="px-5 pt-4 pb-2">
        <h2 className="text-[20px] sm:text-[20px] font-medium text-[#00A292]">
          Notifications
        </h2>
      </div>

      <div className="overflow-y-auto scrollbar-hide max-h-[min(350px,calc(100vh-10rem))] px-5 pb-2">
        {loading && visibleNotifications.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">Loading...</p>
        ) : visibleNotifications.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">
            No notifications yet
          </p>
        ) : (
          visibleNotifications.map((n, idx) => {
            const senderName = n.sender_name || n.sender || "User";
            const message = String(n.message || "");
            const campaignMatch = message.match(
              /^(.*?)(?:\s*;\s*:\s*|\s*:\s*|\s*;\s*|\s*\u00B7\s*)(.+)$/,
            );
            const notificationMessage = campaignMatch
              ? campaignMatch[1].trim()
              : message.trim();
            const campaignName =
              n.campaign_name ||
              n.campaignName ||
              campaignMatch?.[2]?.trim() ||
              "";
            const senderImage =
              participantAvatar ||
              n.sender_avatar ||
              n.senderAvatar ||
              n.admin_avatar ||
              n.adminAvatar ||
              n.client_avatar ||
              n.clientAvatar ||
              n.profile_image ||
              n.profileImage ||
              n.avatar ||
              n.user_avatar ||
              n.userAvatar;
            const avatarUrl = assetUrl(senderImage);
            const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=00A292&color=fff`;

            return (
              <div
                key={n.id ?? idx}
                className={`flex items-start justify-between gap-3 py-2.5 ${
                  idx !== visibleNotifications.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="relative h-8 w-8 shrink-0">
                  <img
                    src={avatarUrl || fallbackAvatar}
                    alt={senderName}
                    className="h-8 w-8 rounded-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackAvatar;
                    }}
                  />
                  {!n.is_read && (
                    <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#00A292]" />
                  )}
                </div>

                <p
                  className={`flex-1 min-w-0 text-[13px] sm:text-[14px] leading-snug text-[#1a1a1a] ${
                    n.is_read ? "opacity-60" : ""
                  }`}
                >
                  <span className="block truncate">{notificationMessage}</span>
                  <span className="mt-1 flex min-w-0 items-center gap-1 text-[11px] text-gray-400">
                    {campaignName && (
                      <span className="truncate font-semibold text-black">{campaignName}</span>
                    )}
                    {campaignName && n.time && <span aria-hidden="true">.</span>}
                    {n.time && <span className="shrink-0 text-[#00A292]">{n.time}</span>}
                  </span>
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}