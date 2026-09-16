import { useState, useEffect, useCallback, useRef } from "react";
import { get, post } from "../api";

/**
 * Notifications fetch karne ka hook (auto polling ke sath).
 *
 * @param {string} role        'client' ya 'org'
 * @param {number} clientId    Client portal me logged-in client ki ID,
 *                             Org side me navbar dropdown se selected client ki ID
 * @param {string} actualRole  Org side me user.db_role ('Main Admin' / 'OrgAdmin')
 * @param {number} adminId     Org side me logged-in admin ki ID
 */
export default function useNotifications(role, clientId, actualRole, adminId) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Har render pe naya function na bane isliye latest values ref me rakh li
  const paramsRef = useRef({});
  paramsRef.current = { role, clientId, actualRole, adminId };

  const buildQuery = useCallback(() => {
    const p = new URLSearchParams();
    if (role) p.append("role", role);
    if (clientId) p.append("client_id", clientId);
    if (actualRole) p.append("actual_role", actualRole);
    if (adminId) p.append("admin_id", adminId);
    return p.toString();
  }, [role, clientId, actualRole, adminId]);

  const fetchNotifications = useCallback(async () => {
    // Client role me client_id ke bina call mat karo
    if (role === "client" && !clientId) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      const result = await get(`/notifications/get_list?${buildQuery()}`);
      if (result.status === "success") {
        setNotifications(result.data || []);
        setUnreadCount(result.unread_count || 0);
      }
    } catch (err) {
      console.error("Notifications fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [role, clientId, buildQuery]);

  // Bell kholne par sab read mark kar do
  const markAllAsRead = useCallback(async () => {
    const { role: r, clientId: c, actualRole: ar, adminId: ai } = paramsRef.current;

    // UI turant update (optimistic)
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));

    try {
      await post("/notifications/mark_as_read", {
        role: r,
        client_id: c || null,
        actual_role: ar || null,
        admin_id: ai || null,
      });
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // 15 sec polling
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return { notifications, unreadCount, loading, refetch: fetchNotifications, markAllAsRead };
}