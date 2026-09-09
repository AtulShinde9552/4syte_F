import { useState, useRef, useEffect } from "react";
import { Bell, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import GlassIconButton from "./GlassIconButton";
import NotificationPopup from "./NotificationPopup";
import ClientSelectDropdown from "./ClientSelectDropdown";

const notifications = [
  {
    id: 1,
    sender: "System",
    message: "Welcome to the Org Portal!",
    time: "Just now",
  }
];

export default function OrgNavbar({ selectedClient, onClientChange }) {
  const [showNotifications, setShowNotifications] = useState(false);
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

  // --- DYNAMIC AVATAR LOGIC ---
  const adminName = user.name || "Org Admin";
  const adminAvatar = user.avatar 
    ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost/clientportal/${user.avatar}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=00A292&color=fff`;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("http://localhost/clientportal/clients/get_list");
        const result = await res.json();
        
        if (result.status === "success") {
          const activeClients = result.data.filter(c => c.status && c.status.toLowerCase() === "active");
          setClientsList(activeClients);

          if (!selectedClient && activeClients.length > 0 && typeof onClientChange === 'function') {
            onClientChange(activeClients[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching clients for dropdown:", err);
      }
    };
    fetchClients();
  }, []); 

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
    <header className="flex items-center justify-between gap-3 px-3 py-3 sm:px-5 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <h1 className="text-[18px] sm:text-[24px] lg:text-[35px] font-medium truncate">
          Welcome back,
        </h1>
        <h1 className="text-[18px] sm:text-[24px] lg:text-[35px] font-medium text-[#00A292] truncate">
          {adminName}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 shrink-0">
        
        {/* Client Selector Dropdown for Org */}
        <ClientSelectDropdown 
          clients={clientsList} 
          selectedClient={selectedClient} 
          onSelect={onClientChange} 
        />

        <div className="relative" ref={notificationRef}>
          <GlassIconButton
            icon={Bell}
            circleSize="w-9 h-9 lg:w-12 lg:h-12"
            onClick={() => setShowNotifications((prev) => !prev)}
          />
          {showNotifications && <NotificationPopup notifications={notifications} />}
        </div>

        <Link to={"/org/messages"}>
          <GlassIconButton icon={Mail} circleSize="w-9 h-9 lg:w-12 lg:h-12" />
        </Link>

        {/* Profile */}
        {/* Profile */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 bg-white/50 rounded-2xl px-3 py-1.5 lg:px-5 lg:py-2 shadow-sm">
          {/* Yahan humne hardcoded link hata kar dynamic adminAvatar laga diya hai */}
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
              System Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}