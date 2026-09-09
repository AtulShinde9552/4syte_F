import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ActionsDropdown({ actions = [] }) {
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

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex items-center gap-2
          px-4 py-2
          bg-[#00A292] hover:bg-[#008F81]
          text-white text-sm 
          rounded-md
          shadow-[0_4px_16px_rgba(0,162,146,0.25)]
          transition-colors
          cursor-pointer
        "
      >
        Actions
        <ChevronDown
          size={16}
          strokeWidth={2.5}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="
            absolute right-0 top-[calc(100%+8px)]
            w-48
            bg-white
            rounded-[14px]
            border border-black/5
            shadow-[0_8px_30px_rgba(0,0,0,0.12)]
            overflow-hidden
            z-20
          "
        >
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => {
                action.onClick?.();
                setOpen(false);
              }}
              className="
                w-full text-left
                px-4 py-3
                text-sm text-[#333]
                hover:bg-[#F0FFFC] hover:text-[#00A292]
                transition-colors
                cursor-pointer
              "
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}