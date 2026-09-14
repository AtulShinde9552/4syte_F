import { useState, useRef, useEffect } from "react";
import { Bell, Mail } from "lucide-react";
import GlassIconButton from "./GlassIconButton";
import NotificationPopup from "./NotificationPopup";
import ProfileDrawer from "./ProfileDrawer";
import useUnreadMessageCount from "../hooks/useUnreadMessageCount";
import { Link } from "react-router-dom";
import { assetUrl } from "../api";

// Abhi notifications ko static rakha hai, aage chal kar ise bhi API se map kar lenge
const notifications = [
  {
    id: 1,
    sender: "System",
    message: "Welcome to your Client Portal!",
    time: "Just now",
  }
];

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const notificationRef = useRef(null);

  // 1. DYNAMIC DATA: Local storage se logged in client ka data nikalo
  let user = {};
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error("Local storage parse error:", e);
  }

  // Fallback name agar local storage me naam na mile
  const displayName = user.name || "Client";

  // 2. AVATAR LOGIC: Agar avatar DB me hai toh wo dikhao, warna UI-Avatars use karo
  const userAvatar = user.avatar 
    ? assetUrl(user.avatar)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=00A292&color=fff`;
  const unreadCount = useUnreadMessageCount();

  useEffect(() => {
    function handleClickOutside(e) {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="flex items-center justify-between gap-3 px-3 py-3 sm:px-5 shrink-0">
      {/* Left Side */}
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <h1 className="text-[18px] sm:text-[24px] lg:text-[35px] font-medium truncate">
          Welcome,
        </h1>
        {/* YAHAN DYNAMIC NAME DIKHEGA */}
        <h1 className="text-[18px] sm:text-[24px] lg:text-[35px] font-medium text-[#00A292] truncate">
          {displayName}
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 shrink-0">
        
        <div className="relative" ref={notificationRef}>
          <GlassIconButton
            icon={Bell}
            circleSize="w-9 h-9 lg:w-12 lg:h-12"
            onClick={() => setShowNotifications((prev) => !prev)}
          />
          {showNotifications && (
            <NotificationPopup notifications={notifications} />
          )}
        </div>
        
        <Link to={'/messages'} className="relative">
          <GlassIconButton icon={Mail} circleSize="w-9 h-9 lg:w-12 lg:h-12" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm border border-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

        {/* Profile Section */}
        <button
          type="button"
          onClick={() => setShowProfileDrawer(true)}
          aria-label="Open profile"
          className="flex items-center gap-2 sm:gap-3 lg:gap-4 bg-white/50 rounded-2xl px-3 py-1.5 lg:px-5 lg:py-2 shadow-sm cursor-pointer"
        >
          <img
            src={userAvatar}
            alt="profile"
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full object-cover shrink-0 border border-[#00A292]/20"
          />
          <div className="hidden sm:block">
            <h3 className="text-[14px] lg:text-[20px] font-medium text-[#111] whitespace-nowrap">
              {displayName}
            </h3>
            <p className="text-gray-500 text-[10px] lg:text-xs whitespace-nowrap">
              Client Portal
            </p>
          </div>
        </button>
        
      </div>
      </header>

      <ProfileDrawer
        isOpen={showProfileDrawer}
        onClose={() => setShowProfileDrawer(false)}
        name={displayName}
        role="Client Portal"
        avatar={userAvatar}
      />
    </>
  );
}