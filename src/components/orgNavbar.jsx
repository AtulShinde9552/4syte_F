import { useState, useRef, useEffect } from "react";
import { Bell, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import GlassIconButton from "./GlassIconButton";
import NotificationPopup from "./NotificationPopup";
import ProfileDrawer from "./ProfileDrawer";
import useUnreadMessageCount from "../hooks/useUnreadMessageCount";
import useNotifications from "../hooks/useNotifications";
import ClientSelectDropdown from "./ClientSelectDropdown";
import { get, assetUrl } from "../api";

export default function OrgNavbar({ selectedClient, onClientChange }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [clientsList, setClientsList] = useState([]);
  const notificationRef = useRef(null);

  let user = {};
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error("Local storage parse error:", e);
  }

  // NOTIFICATIONS:
  // - Main Admin -> sirf apne assigned clients ki saari activity
  // - OrgAdmin/CSM -> sirf client ki taraf se aayi activity (naye messages)
  // selectedClient hone par sirf usi client ka data
  const {
    notifications,
    unreadCount: notifUnread,
    loading: notifLoading,
    markAllAsRead,
  } = useNotifications("org", selectedClient?.id, user.db_role, user.id);

  const adminName = user.name || "Org Admin";
  const adminAvatar = user.avatar
    ? assetUrl(user.avatar)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=00A292&color=fff`;
  const unreadCount = useUnreadMessageCount(selectedClient);

  const storageKey = `savedOrgClient_${user?.id}`;

  const handleBellClick = () => {
    setShowNotifications((prev) => {
      const next = !prev;
      if (next && notifUnread > 0) {
        markAllAsRead();
      }
      return next;
    });
  };

  const handleClientChangeWrapper = (client) => {
    if (!client) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, JSON.stringify(client));
    }

    if (typeof onClientChange === "function") {
      onClientChange(client);
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      if (!user || !user.id) return;

      try {
        // Agar Org Admin hai toh sab mangao, warna sirf apne admin_id se filter karo
        const apiUrl =
          user.role === "org"
            ? "/clients/get_list"
            : `/clients/get_list?admin_id=${user.id}`;

        const result = await get(apiUrl);

        if (result.status === "success") {
          const activeClients = result.data.filter((c) => {
            const isActive = c.status && c.status.toLowerCase() === "active";
            const isAssignedToMe =
              user.role === "org"
                ? true
                : String(c.admin_id) === String(user.id);
            return isActive && isAssignedToMe;
          });

          setClientsList(activeClients);

          if (!selectedClient && activeClients.length > 0) {
            let savedClient = null;
            try {
              const storedClientStr = localStorage.getItem(storageKey);
              if (storedClientStr) {
                const parsed = JSON.parse(storedClientStr);
                savedClient = activeClients.find(
                  (c) => String(c.id) === String(parsed.id),
                );
              }
            } catch (e) {}

            if (savedClient) {
              handleClientChangeWrapper(savedClient);
            }
          } else if (activeClients.length === 0) {
            handleClientChangeWrapper(null);
          }
        }
      } catch (err) {
        console.error("Error fetching clients for dropdown:", err);
      }
    };

    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="flex items-center justify-between gap-3 px-3 py-3 sm:px-5 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <h1 className="text-[18px] sm:text-[24px] lg:text-[35px] font-medium truncate">
            Welcome back,
          </h1>
          <h1 className="text-[18px] sm:text-[24px] lg:text-[35px] font-medium text-[#00A292] truncate">
            {adminName}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 shrink-0">
          <ClientSelectDropdown
            clients={clientsList}
            selectedClient={selectedClient}
            onSelect={handleClientChangeWrapper}
          />

          <div className="relative" ref={notificationRef}>
            <GlassIconButton
              icon={Bell}
              circleSize="w-9 h-9 lg:w-12 lg:h-12"
              onClick={handleBellClick}
            />
            {notifUnread > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm border border-white">
                {notifUnread > 99 ? "99+" : notifUnread}
              </span>
            )}
            {showNotifications && (
              <NotificationPopup
                notifications={notifications}
                loading={notifLoading}
                participantAvatar={selectedClient?.avatar}
              />
            )}
          </div>

          <Link to={"/org/messages"} className="relative">
            <GlassIconButton icon={Mail} circleSize="w-9 h-9 lg:w-12 lg:h-12" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm border border-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setShowProfileDrawer(true)}
            aria-label="Open profile"
            className="flex items-center gap-2 sm:gap-3 lg:gap-4 bg-white/50 rounded-2xl px-3 py-1.5 lg:px-5 lg:py-2 shadow-sm cursor-pointer"
          >
            <img
              src={adminAvatar}
              alt="profile"
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full object-cover shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=00A292&color=fff`;
              }}
            />
            <div className="hidden sm:block">
              <h3 className="text-[14px] lg:text-[20px] font-medium text-[#111] whitespace-nowrap">
                {user.name || "Org Admin"}
              </h3>
              <p className="text-gray-500 text-[10px] lg:text-xs whitespace-nowrap">
                {user.role === "main_admin" ? "System Admin" : "Org Admin"}
              </p>
            </div>
          </button>
        </div>
      </header>

      <ProfileDrawer
        isOpen={showProfileDrawer}
        onClose={() => setShowProfileDrawer(false)}
        name={adminName}
        role={user.role === "main_admin" ? "System Admin" : "Org Admin"}
        avatar={adminAvatar}
      />
    </>
  );
}