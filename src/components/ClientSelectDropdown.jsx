import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function ClientSelectDropdown({ clients = [], selectedClient, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Safe display name nikalne ke liye function
  const getDisplayName = (clientObj) => {
    if (!clientObj) return "Select Client";
    return clientObj.company_name || clientObj.clientName || clientObj.name || "Unknown Client";
  };

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 sm:gap-2 bg-white/50 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 shadow-sm text-[13px] sm:text-[15px] font-medium text-[#111] whitespace-nowrap"
      >
        {/* FIX: Yahan ab actual name show hoga jo blank nahi hoga */}
        {selectedClient ? getDisplayName(selectedClient) : "Select Client"}
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-black/5 overflow-hidden z-50 max-h-64 overflow-y-auto">
          {clients.length > 0 ? (
            clients.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => {
                  onSelect(client);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-[14px] hover:bg-gray-50 transition-colors ${
                  selectedClient && String(client.id) === String(selectedClient.id)
                    ? "text-[#00A292] font-medium bg-[#EAF6F4]"
                    : "text-[#111]"
                }`}
              >
                {getDisplayName(client)}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-[13px] text-gray-500">No active clients</div>
          )}
        </div>
      )}
    </div>
  );
}