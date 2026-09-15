import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Rocket,
  Mail,
  FileText,
  Clock,
  Folders,
} from "lucide-react";
import logoFull from "../assets/images/logo-4syte.png";
import logoIcon from "../assets/images/logo_circle.png";
import { get, assetUrl } from "../api";
import { navItemsByRole } from "../accessControl.js";
import useUnreadMessageCount from "../hooks/useUnreadMessageCount";

const baseNavItems = [
  { page: "campaigns", label: "Campaigns", icon: Rocket, path: "/campaigns" },
  { page: "messages", label: "Message", icon: Mail, path: "/messages" },
  { page: "reports", label: "Reports", icon: FileText, path: "/reports" },
  { page: "leads", label: "Leads File", icon: Clock, path: "/leads-file" },
  { page: "manage-client", label: "Manage Client", icon: Folders, path: "/org/manage-client" },
];

export default function Sidebar({ selectedClient }) {
  const [expanded, setExpanded] = useState(false);
  const [globalAdminAvatar, setGlobalAdminAvatar] = useState(null); // STATE FOR ADMIN AVATAR
  const prevCountRef = useRef(0);
  
  const navigate = useNavigate();
  const location = useLocation();

  let userRole = "client";
  let userName = "Client";
  let userAvatarPath = null;
  
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role) userRole = user.role;
      if (user.name) userName = user.name;
      if (user.avatar) userAvatarPath = user.avatar;
    }
  } catch (e) {
    console.error("Sidebar role fetch error:", e);
  }

  const myAvatar = userAvatarPath 
      ? assetUrl(userAvatarPath)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=00A292&color=fff`;
  const unreadCount = useUnreadMessageCount(selectedClient);

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

  // --- DESKTOP NOTIFICATION FOR NEW MESSAGES ---
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (unreadCount > prevCountRef.current && !location.pathname.includes("/messages")) {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("New Message!", {
          body: "You have a new message in your portal.",
          icon: logoIcon,
        });
      }
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount, location.pathname]);

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

              return (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className={`flex items-center h-9 gap-3 overflow-hidden whitespace-nowrap transition-colors text-[20px] cursor-pointer -ml-[2px] relative ${
                    active ? "text-[#00A292] font-medium" : "text-[#0C0C0C] hover:text-[#00A292]"
                  }`}
                >
                  <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 backdrop-blur-md backdrop-saturate-150 border border-white/50 shadow-[0_2px_8px_rgba(0,0,0,0.06)] bg-white/30 relative">
                    <Icon size={16} stroke={active ? "#00A292" : "currentColor"} />
                    
                  </span>
                  
                  <span className={`transition-opacity duration-200 text-[18px] flex items-center gap-2 ${expanded ? "opacity-100 delay-100" : "opacity-0"}`}>
                    {label}
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
              className={`-ml-0.5 flex items-center h-9 gap-3 overflow-hidden whitespace-nowrap rounded-2xl transition-all duration-300 ${
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

        </div>
      </aside>
    </div>
  );
}