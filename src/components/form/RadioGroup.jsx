export default function RadioGroup({ name, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center gap-2.5 text-[14px] font-medium text-[#111] cursor-pointer"
        >
          <input
            type="radio"
            name={name}
            checked={value === option}
            onChange={() => onChange(option)}
            className="w-4 h-4 accent-[#00A292]"
          />
          {option}
        </label>
      ))}
    </div>
  );
}