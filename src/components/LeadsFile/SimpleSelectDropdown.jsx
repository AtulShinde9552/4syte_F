import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function SimpleSelectDropdown({
  label,
  placeholder = "Select",
  options = [],
  value,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? placeholder;

  return (
    <div className="relative" ref={ref}>
      <span className="block text-[15px] text-black mb-1">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-sm border text-[13px] transition-colors cursor-pointer
          ${open ? "border-[#00A292] bg-[#F4FBFA]" : "border-gray-200 bg-[#FCFCFC] hover:border-[#00A292]/50"}
          ${value ? "text-gray-800" : "text-gray-400"}`}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
     <div className="absolute z-20 mt-2 w-full max-h-64 overflow-y-auto bg-white rounded-2xl shadow-[0_0_4px_0_rgba(0,0,0,0.1)] border border-gray-300 py-2">
          {options.length === 0 && (
            <p className="px-4 py-2 text-[13px] text-gray-400">No options</p>
          )}
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-[13px] hover:bg-[#EAF6F4] transition-colors cursor-pointer
                ${value === opt.value ? "text-[#00A292] font-medium" : "text-gray-700"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}