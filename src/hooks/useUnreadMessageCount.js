import { useEffect, useState } from "react";
import { get } from "../api";

export default function useUnreadMessageCount(selectedClient = null) {
  const [unreadCount, setUnreadCount] = useState(0);

  let user = {};
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Unread message user parse error:", error);
  }

  const role = user.role || "client";
  const userId = user.id;
  const targetClientId = role === "client"
    ? userId
    : role === "org"
      ? selectedClient?.id || ""
      : "";

  useEffect(() => {
    let cancelled = false;

    const fetchUnreadCount = async () => {
      if (role === "org" && !targetClientId) {
        setUnreadCount(0);
        return;
      }

      try {
        const result = await get(
          `/messages/get_unread_count?client_id=${targetClientId || ""}&role=${role}`,
        );
        if (!cancelled && result.status === "success") {
          setUnreadCount(Number(result.count) || 0);
        }
      } catch (error) {
        console.error("Error fetching unread message count:", error);
      }
    };

    setUnreadCount(0);
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [role, targetClientId]);

  return unreadCount;
}
