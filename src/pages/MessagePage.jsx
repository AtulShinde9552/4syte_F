import { useState, useEffect, useRef } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";

import InboxList from "../components/Message/InboxList";
import ConversationPanel from "../components/Message/ConversationPanel";
import { get, post } from "../api";

export default function MessagePage() {
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [isInboxCollapsed, setIsInboxCollapsed] = useState(false);

  const activeThreadRef = useRef(activeThreadId);
  activeThreadRef.current = activeThreadId;

  const outletContext = useOutletContext() || {};
  const selectedClient = outletContext.selectedClient;

  let user = {};
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error("Local storage parse error:", e);
  }

  const senderName = user.name || (user.role === "org" ? "Org Admin" : "Client User");
  const senderRole = user.role === "org" ? "System Admin" : "Client";

  // let targetClientId = "";
  // if (user.role === "client") {
  //   targetClientId = user.id;
  // } else if (user.role === "org" && selectedClient) {
  //   targetClientId = selectedClient.id;
  // }


  const actualRole = (user.actual_role || user.role || "").toString().trim();
const isMainAdmin = actualRole.toLowerCase() === "main admin";
const adminId = user.id;

let targetClientId = "";
if (user.role === "client") {
  targetClientId = user.id;
} else if (selectedClient) {
  targetClientId = selectedClient.id;
}

const fetchThreads = async () => {
  if (user.role !== "client" && !targetClientId) {
    setThreads([]);
    setActiveThreadId(null);
    setMessages([]);
    return;
  }

  try {
    let url = `/messages/get_threads?role=${user.role}`;

    if (targetClientId) {
      url += `&client_id=${encodeURIComponent(targetClientId)}`;
    }

    const actualRole = (user.actual_role || user.role || "").toString().trim();
    const isMainAdmin = actualRole.toLowerCase() === "main admin";
    const adminId = user.id;

    if (isMainAdmin && adminId) {
      url += `&actual_role=Main Admin&admin_id=${encodeURIComponent(adminId)}`;
    } else {
      url += `&actual_role=${encodeURIComponent(actualRole || "OrgAdmin")}`;
    }

    const result = await get(url);

    if (result.status === "success") {
      setThreads(result.data);

      if (!activeThreadRef.current && result.data.length > 0) {
        setActiveThreadId(result.data[0].id);
      }
    }
  } catch (err) {
    console.error("Error fetching threads:", err);
  }
};



  const fetchMessages = async (campaignId) => {
    if (!campaignId) return;
    try {
      const result = await get(`/messages/get_messages/${campaignId}`);
      if (result.status === "success") {
        setMessages(result.data);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // --- NEW: Mark as Read API Call ---
  const markAsRead = async (campaignId) => {
    try {
      await post("/messages/mark_as_read", {
        campaign_id: campaignId,
        role: user.role,
      });
      fetchThreads(); 
    } catch (err) {
      console.error("Error marking as read", err);
    }
  };

  useEffect(() => {
    setActiveThreadId(null);
    setMessages([]);
    fetchThreads();
  }, [selectedClient]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchThreads(); 
      if (activeThreadRef.current) {
        fetchMessages(activeThreadRef.current);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedClient]);

  useEffect(() => {
    if (activeThreadId) {
      fetchMessages(activeThreadId);
      markAsRead(activeThreadId); 
    } else {
      setMessages([]);
    }
  }, [activeThreadId]);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  async function handleSend(text, file) {
    if (!activeThreadId) return;

    const formData = new FormData();
    formData.append("campaign_id", activeThreadId);
    formData.append("message_text", text);
    formData.append("sender_name", senderName); 
    formData.append("sender_role", senderRole);
    formData.append("is_from_client", user.role === "org" ? "0" : "1");

    if (file) formData.append("attachment", file);

    try {
      const result = await post("/messages/send_message", formData);
      if (result.status === "success") {
        fetchMessages(activeThreadId); 
        fetchThreads();
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  return (
    <div className="h-full min-h-0 flex flex-col bg-white rounded-[18px] sm:rounded-[26px] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.04)] px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <div className="flex items-center justify-between px-2 sm:px-3 pb-4 sm:pb-6 shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-[17px] sm:text-[19px] lg:text-[22px] font-medium text-[#00A292]">Message</h1>
          <Mail size={18} className="text-[#00A292]" strokeWidth={2} />
        </div>
        <button type="button" onClick={() => navigate(user.role === "org" ? "/org/campaigns" : "/campaigns")} className="flex items-center gap-1.5 text-[13px] sm:text-[15px] lg:text-[18px] text-[#00A292] hover:text-[#008F81] transition-colors cursor-pointer">
          <ArrowLeft size={16} /> Campaign List
        </button>
      </div>

      <div className="flex-1 min-h-0 flex gap-4 sm:gap-5">
        <InboxList
          threads={threads}
          activeThreadId={activeThreadId}
          onSelectThread={setActiveThreadId}
          collapsed={isInboxCollapsed}
          onToggleCollapse={() => setIsInboxCollapsed((previous) => !previous)}
        />
        <ConversationPanel thread={activeThread} messages={messages} messageText={messageText} onMessageTextChange={setMessageText} onSend={handleSend} />
      </div>
    </div>
  );
}