export default function ProgressBar({
  value = 0,
  className = "",
}) {
  return (
    <div
      className={`
        flex
        items-center
        gap-3
        ${className}
      `}
    >
      <div
        className="
          flex-1
          h-[8px]
          rounded-full
          bg-[#F1F1F1]
          overflow-hidden
        "
      >
        <div
          className="
            h-full
            rounded-full
            bg-[#00A292]
            transition-all
          "
          style={{
            width: `${value}%`,
          }}
        />
      </div>

      <span className="text-xs text-[#111] shrink-0">
        {value}%
      </span>
    </div>
  );
}