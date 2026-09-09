import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import SearchText from "../SearchText";

export default function MultiSelectDropdown({
  label,
  placeholder = "Select",
  options = [],
  selected = [],
  onChange,
  showIncludeArchived = true,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [includeArchived, setIncludeArchived] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const allSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((opt) => selected.includes(opt.value));

  function toggleAll() {
    const filteredValues = filteredOptions.map((o) => o.value);
    const allOn = filteredValues.every((v) => selected.includes(v));
    onChange(
      allOn
        ? selected.filter((v) => !filteredValues.includes(v))
        : [...new Set([...selected, ...filteredValues])],
    );
  }

  function toggleOne(value) {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  }

  function clearSelection() {
    onChange([]);
  }

  const buttonLabel =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? options.find((o) => o.value === selected[0])?.label
        : `${selected.length} selected`;

  return (
    <div className="relative" ref={ref}>
      <span className="block text-[15px] text-black mb-1">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-sm border text-[13px] transition-colors cursor-pointer
          ${open ? "border-[#00A292] bg-[#F4FBFA]" : "border-gray-200 bg-[#FCFCFC] hover:border-[#00A292]/50"}
          ${selected.length ? "text-gray-800" : "text-gray-400"}`}
      >
        <span className="truncate">{buttonLabel}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-80 bg-white rounded-2xl shadow-[0_0_4px_0_rgba(0,0,0,0.1)] border border-gray-300 p-4">
          <SearchText
            value={search}
            onChange={setSearch}
            placeholder="Search Campaign"
          />

          <div className="flex flex-col gap-2 mt-3 mb-2">
            <label className="flex items-center gap-2 text-[13px] text-black cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="w-4 h-4 accent-[#00A292] rounded cursor-pointer"
              />
              Select all{" "}
              <span className="text-[#00A292]">({options.length})</span>
            </label>

            {showIncludeArchived && (
              <label className="flex items-center gap-2 text-[13px] text-black cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeArchived}
                  onChange={() => setIncludeArchived((v) => !v)}
                  className="w-4 h-4 accent-[#00A292] rounded cursor-pointer"
                />
                Include Archived
              </label>
            )}
          </div>

          <div className="bg-[#F4FBFA] rounded-xl px-3 py-2 max-h-56 overflow-y-auto flex flex-col gap-2.5">
            {filteredOptions.length === 0 && (
              <p className="text-[13px] text-gray-400 py-2 text-center">
                No results
              </p>
            )}
            {filteredOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-[13px]  cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={() => toggleOne(opt.value)}
                  className="w-4 h-4 accent-[#00A292] rounded cursor-pointer shrink-0"
                />
                <span className="truncate">{opt.label}</span>
              </label>
            ))}
          </div>

          <div className="text-center mt-3">
            <button
              type="button"
              onClick={clearSelection}
              className="text-[13px] text-[#00A292] underline hover:text-[#008F81] cursor-pointer"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}