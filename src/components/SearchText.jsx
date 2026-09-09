import { Search } from "lucide-react";

export default function SearchText({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <div
      className={`flex items-center gap-3 h-12 w-full max-w-[310px]
        bg-white/60 backdrop-blur-md
        border border-white/50
        rounded-full
        px-5
        shadow-[0_4px_16px_rgba(0,0,0,0.05)]
        focus-within:shadow-[0_4px_18px_rgba(0,162,146,0.12)] text-[#E1E1E1]
        transition-all ${className}`}
    >
      <Search
        size={19}
        strokeWidth={2}
        className="text-[#00A292] shrink-0"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          flex-1
          min-w-0
          bg-transparent
          outline-none
          border-none
          text-xs
          text-gray-800
          placeholder:text-[#E1E1E1]
        "
      />
    </div>
  );
}