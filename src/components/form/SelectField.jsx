export default function SelectField({ label, options, placeholder, ...selectProps }) {
  return (
    <div>
      <label className="block text-[14px] font-medium text-[#111] mb-1.5">
        {label}
      </label>
      <select
        {...selectProps}
        className="w-full bg-[#FAFAFA] border border-[#DEDEDE] rounded-lg px-4 py-2.5 text-[14px] text-[#111] placeholder:[#E3E3E3] focus:outline-none focus:border-[#00A292]"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}