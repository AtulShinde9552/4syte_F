export default function TextField({ label, ...inputProps }) {
  return (
    <div>
      <label className="block text-[14px] font-medium text-[#505050] mb-1.5">
        {label}
      </label>
      <input
        {...inputProps}
        className="w-full bg-[#FAFAFA] border border-[#DEDEDE] rounded-2xl px-4 py-2.5 text-[14px] text-[#111] placeholder:[#E3E3E3] focus:outline-none focus:border-[#00A292]"
      />
    </div>
  );
}