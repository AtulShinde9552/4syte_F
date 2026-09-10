import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Rocket,
  Mail,
  FileText,
  Clock,
  Settings,
  HelpCircle,
  LogOut,
  Folders,
} from "lucide-react";
import logoFull from "../assets/images/logo-4syte.png";
import logoIcon from "../assets/images/logo_circle.png";
import { get, assetUrl } from "../api";
import { navItemsByRole } from "../accessControl.js";

const baseNavItems = [
  { page: "campaigns", label: "Campaigns", icon: Rocket, path: "/campaigns" },
  { page: "messages", label: "Message", icon: Mail, path: "/messages" },
  { page: "reports", label: "Reports", icon: FileText, path: "/reports" },
  { page: "leads", label: "Leads File", icon: Clock, path: "/leads-file" },
  { page: "manage-client", label: "Manage Client", icon: Folders, path: "/org/manage-client" },
];

export default function Sidebar({ selectedClient }) {
  const [expanded, setExpanded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); 
  const [globalAdminAvatar, setGlobalAdminAvatar] = useState(null); // STATE FOR ADMIN AVATAR
  const prevCountRef = useRef(0);
  
  const navigate = useNavigate();
  const location = useLocation();

  let userRole = "client";
  let userName = "Client";
  let userAvatarPath = null;
  let userId = null;
  
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role) userRole = user.role;
      if (user.name) userName = user.name;
      if (user.avatar) userAvatarPath = user.avatar;
      if (user.id) userId = user.id;
    }
  } catch (e) {
    console.error("Sidebar role fetch error:", e);
  }

  const myAvatar = userAvatarPath 
      ? assetUrl(userAvatarPath)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=00A292&color=fff`;

  // --- FETCH ORG ADMIN AVATAR FOR CLIENTS ---
  useEffect(() => {
    if (userRole === "client") {
      const fetchAdminAvatar = async () => {
        try {
          const result = await get("/auth/get_admin_avatar");
          if (result.status === "success" && result.avatar) {
            setGlobalAdminAvatar(assetUrl(result.avatar));
          }
        } catch (err) {
          console.error("Failed to fetch admin avatar:", err);
        }
      };
      fetchAdminAvatar();
    }
  }, [userRole]);

  // --- POLLING LOGIC FOR MESSAGE BADGE ---
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    const fetchUnreadCount = async () => {
      try {
        let targetClientId = "";
        
        if (userRole === "client") {
          targetClientId = userId;
        } else if (userRole === "org" && selectedClient) {
          targetClientId = selectedClient.id;
        }

        if (userRole === "org" && !targetClientId) return;

        const result = await get(`/messages/get_unread_count?client_id=${targetClientId}&role=${userRole}`);

        if (result.status === "success") {
          const newCount = result.count;
          
          if (newCount > prevCountRef.current && location.pathname.indexOf('/messages') === -1) {
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("New Message!", {
                body: "You have a new message in your portal.",
                icon: logoIcon 
              });
            }
          }
          
          prevCountRef.current = newCount;
          setUnreadCount(newCount);
        }
      } catch (err) {
        console.error("Error fetching unread count", err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 3000); 
    return () => clearInterval(interval);
  }, [selectedClient, location.pathname, userRole, userId]);

  const visiblePages = navItemsByRole[userRole] || [];
  const currentNavItems = baseNavItems
    .filter(item => visiblePages.includes(item.page))
    .map(item => ({
      ...item,
      path: userRole === "client" || item.page === "manage-client"
        ? item.path
        : `/org${item.path}`,
    }));

  const users = [];

  // --- DYNAMIC ADMIN IMAGE IN CLIENT VIEW ---
  if (userRole === "client") {
    users.push({
      name: "Org Admin", 
      role: "Client Success Manager",
      // Use fetched avatar, fallback to UI-avatars if null
      img: globalAdminAvatar || "https://ui-avatars.com/api/?name=Org+Admin&background=111&color=fff", 
    });
  } 
  else if (userRole === "org" && selectedClient) {
    const clientName = selectedClient.company_name || selectedClient.clientName || "Client";
    const clientAvatarPath = selectedClient.avatar;
    
    const clientAvatar = clientAvatarPath 
        ? assetUrl(clientAvatarPath)
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(clientName)}&background=00A292&color=fff`;

    users.push({
      name: clientName,
      role: "Selected Client",
      img: clientAvatar
    });
  }

  users.push({
    name: userName, 
    role: userRole === 'org' || userRole === 'admin' ? "System Admin" : "Client Portal", 
    img: myAvatar, 
  });

  return (
    <div className="bg-transparent">
      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={`h-full flex-1 flex flex-col justify-between bg-transparent backdrop-blur-xl backdrop-saturate-150 border border-white/40 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden transition-[width] duration-300 ease-in-out ${
          expanded ? "w-68" : "w-22"
        }`}
      >
        <div>
          <div className={`flex items-center h-11 mt-8 px-6.5 overflow-hidden whitespace-nowrap ${expanded ? "justify-center" : ""}`}>
            {expanded ? (
              <img src={logoFull} alt="4SYTE" className="h-11 w-auto object-contain" />
            ) : (
              <img src={logoIcon} alt="4SYTE" className="w-11 h-11 rounded-full object-contain shrink-0" />
            )}
          </div>
          
          <nav className="mt-15 flex flex-col gap-5 px-6.5">
            {currentNavItems.map(({ label, icon: Icon, path }) => {
              const active = location.pathname.startsWith(path);
              const isMessageTab = label === "Message";

              return (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className={`flex items-center h-9 gap-3 overflow-hidden whitespace-nowrap transition-colors text-[20px] cursor-pointer relative ${
                    active ? "text-[#00A292] font-medium" : "text-[#0C0C0C] hover:text-[#00A292]"
                  }`}
                >
                  <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 backdrop-blur-md backdrop-saturate-150 border border-white/50 shadow-[0_2px_8px_rgba(0,0,0,0.06)] bg-white/30 relative">
                    <Icon size={16} stroke={active ? "#00A292" : "currentColor"} />
                    
                    {isMessageTab && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm border border-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </span>
                  
                  <span className={`transition-opacity duration-200 text-[18px] flex items-center gap-2 ${expanded ? "opacity-100 delay-100" : "opacity-0"}`}>
                    {label}
                    {isMessageTab && unreadCount > 0 && (
                      <span className="flex h-5 items-center justify-center rounded-full bg-red-100 px-2 text-[10px] font-bold text-red-600">
                        {unreadCount} New
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-6.5 pb-6 flex flex-col gap-3">
          {users.map((u, i) => (
            <div
              key={i}
              className={`flex items-center h-9 gap-3 overflow-hidden whitespace-nowrap rounded-2xl transition-all duration-300 ${
                expanded
                  ? "bg-white/30 backdrop-blur-md backdrop-saturate-150 border border-white/40 shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-1.5 py-7"
                  : ""
              }`}
            >
              <img
                src={u.img}
                alt={u.name}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=00A292&color=fff`;
                }}
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#00A292]/30 shadow-sm bg-white"
              />

              <div
                className={`transition-opacity duration-200 ${
                  expanded ? "opacity-100 delay-100" : "opacity-0"
                }`}
              >
                <p className="text-sm font-semibold text-gray-800">
                  {u.name}
                </p>
                {u.role ? (
                  <p className="text-xs text-gray-500">{u.role}</p>
                ) : (
                  <p className="text-xs text-gray-400">-</p>
                )}
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-5 mt-2">
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center h-9 gap-3 overflow-hidden whitespace-nowrap text-black hover:text-[#00A292] w-full cursor-pointer"
            >
              <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 backdrop-blur-md backdrop-saturate-150 border border-white/50 shadow-[0_2px_8px_rgba(0,0,0,0.06)] bg-white/30">
                <Settings size={16} stroke="#00A292" />
              </span>
              <span className={`transition-opacity duration-200 ${expanded ? "opacity-100 delay-100" : "opacity-0"}`}>
                Setting
              </span>
            </button>

            {/* <button
              onClick={() => navigate("/help")}
              className="flex items-center h-9 gap-3 overflow-hidden whitespace-nowrap text-black hover:text-[#00A292] w-full"
            >
              <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 backdrop-blur-md backdrop-saturate-150 border border-white/50 shadow-[0_2px_8px_rgba(0,0,0,0.06)] bg-white/30">
                <HelpCircle size={16} stroke="#00A292" />
              </span>
              <span className={`transition-opacity duration-200 ${expanded ? "opacity-100 delay-100" : "opacity-0"}`}>
                Help Center
              </span>
            </button> */}

            <button
              onClick={() => {
                localStorage.removeItem("user");
                navigate("/login");
              }}
              className="flex items-center h-9 gap-3 overflow-hidden whitespace-nowrap text-[#00A292] w-full cursor-pointer"
            >
              <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 backdrop-blur-md backdrop-saturate-150 border border-white/50 shadow-[0_2px_8px_rgba(0,0,0,0.06)] bg-white/30">
                <LogOut size={16} />
              </span>
              <span className={`font-medium transition-opacity duration-200 ${expanded ? "opacity-100 delay-100" : "opacity-0"}`}>
                Log Out
              </span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}