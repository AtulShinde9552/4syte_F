import { Send, Paperclip, Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function MessageInput({ value, onChange, onSend }) {
  const fileInputRef = useRef(null);
  const messageInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.style.height = "0px";
      messageInputRef.current.style.height = `${Math.min(messageInputRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  }

  function handleTextChange(e) {
    onChange(e.target.value);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  }

  function handleSendClick() {
    if (!value.trim() && !selectedFile) return;
    onSend(value, selectedFile);
    onChange("");
    if (messageInputRef.current) {
      messageInputRef.current.style.height = "auto";
    }
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="p-3 sm:p-4 border-t border-gray-100 shrink-0 flex flex-col gap-2">

      {selectedFile && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EAF6F4] text-[#00A292] w-fit rounded-lg text-[12px]">
          <Paperclip size={14} />
          <span className="truncate max-w-[200px]">{selectedFile.name}</span>
          <button 
            onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} 
            className="hover:text-red-500 cursor-pointer ml-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className={`flex ${value.includes("\n") ? "items-end rounded-2xl" : "items-center rounded-full"} gap-2 sm:gap-3 border border-gray-200 pl-4 sm:pl-5 pr-2 py-1.5`}>
        <textarea
          ref={messageInputRef}
          value={value}
          rows={1}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Digite a mensagem..."
          className="box-border flex-1 min-w-0 max-h-[120px] resize-none overflow-y-auto scrollbar-hide py-1 text-[13px] leading-5 outline-none placeholder:text-gray-400"
        />

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-[#00A292] hover:text-[#008F81] transition-colors cursor-pointer shrink-0"
          aria-label="Attach"
        >
          <Paperclip size={17} strokeWidth={2} />
        </button>

        <button
          type="button"
          className="text-[#00A292] hover:text-[#008F81] transition-colors cursor-pointer shrink-0"
          aria-label="Mark done"
        >
          <Check size={17} strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={handleSendClick}
          className="w-9 h-9 rounded-full bg-[#00A292] hover:bg-[#008F81] flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-1"
          aria-label="Send"
        >
          <Send size={15} className="text-white" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}