import { User, FileText } from "lucide-react";

export default function ChatBubble({ message }) {
  const text = message.text || message.message_text;
  const time = message.time || (message.created_at ? new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '');
  const fileUrl = message.fileUrl || message.file_url;
  const fileName = message.fileName || message.file_name;

  // 1. Current user ka exact role nikalo
  let currentUserRole = "client"; 
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      const user = JSON.parse(storedUser);
      currentUserRole = user.role || "client";
    }
  } catch (e) {
    console.error("Local storage error:", e);
  }

  // 2. Alignment Logic (Strict & Exact)
  let fromMe = false;

  if (message.is_from_client !== undefined && message.is_from_client !== null) {
    const isFromClient = String(message.is_from_client); // Ab ye "0" ya "1" ban jayega
    
    if (currentUserRole === "org") {
      // Main Org hoon. Toh mera message tabhi "Me" hoga jab is_from_client "0" hoga.
      if (isFromClient === "0") {
        fromMe = true;
      }
    } else {
      // Main Client hoon. Toh mera message tabhi "Me" hoga jab is_from_client "1" hoga.
      if (isFromClient === "1") {
        fromMe = true;
      }
    }
  } else {
    // Agar DB mein flag nahi hai, toh role matching ka fallback
    if (message.sender_role) {
      const msgRole = String(message.sender_role).toLowerCase();
      if (currentUserRole === "org" && (msgRole.includes("admin") || msgRole.includes("org"))) {
        fromMe = true;
      } else if (currentUserRole !== "org" && msgRole.includes("client")) {
        fromMe = true;
      }
    }
  }

  // File download absolute URL
  const fullFileUrl = fileUrl && !fileUrl.startsWith('http') 
    ? `http://localhost/clientportal/${fileUrl}` 
    : fileUrl;

  return (
    <div className={`flex items-start gap-4 ${fromMe ? "flex-row-reverse" : ""}`}>
      
      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
        <User size={14} className="text-gray-400" />
      </div>

      <div className={`flex flex-col ${fromMe ? "items-end" : "items-start"} max-w-[70%]`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed flex flex-col gap-2 ${
            fromMe
              ? "bg-[#00A292] text-white rounded-br-sm shadow-sm"
              : "bg-white border border-[#00A292] text-[#00A292] rounded-bl-sm shadow-sm"
          }`}
        >
          {fullFileUrl && (
            <a 
              href={fullFileUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${fromMe ? 'bg-black/10 hover:bg-black/20 text-white' : 'bg-[#EAF6F4] hover:bg-[#DBEFEC] text-[#00A292]'}`}
            >
              <FileText size={16} className="shrink-0" />
              <span className="underline truncate max-w-[180px]">{fileName || "Attachment"}</span>
            </a>
          )}
          
          {text && <span>{text}</span>}
        </div>
        
        <div className="flex items-center gap-1.5 mt-1 px-1">
          <span className="text-[11px] font-medium text-gray-500">
            {fromMe ? "Me" : (message.sender_name || "User")}
          </span>
          <span className="text-[11px] text-gray-400">{time}</span>
        </div>
      </div>
    </div>
  );
}