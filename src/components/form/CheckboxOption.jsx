export default function CheckboxOption({ label, description, checked, onChange }) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 w-4 h-4 rounded-full border-gray-300 text-[#00A292] focus:ring-[#00A292] cursor-pointer"
      />
      <div>
        <p className="text-[13px] font-semibold text-[#111]">{label}</p>
        {description && (
          <p className="text-[12px] text-gray-400 leading-snug">{description}</p>
        )}
      </div>
    </label>
  );
}