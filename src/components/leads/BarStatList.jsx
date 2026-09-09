export default function BarStatList({ title, rows = [] }) {
  const maxPercent = Math.max(...rows.map((r) => r.percent), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] text-gray-500">{title}</p>
        <p className="text-[12px] text-gray-500">No. of leads</p>
      </div>
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="w-[140px] shrink-0 text-[13px] text-[#111] truncate">
              {row.label}
            </span>
            <div className="flex-1 flex flex-col gap-0.5">
              <span className="text-[10px] text-gray-400 self-end">{row.percent}%</span>
              <div className="h-[6px] rounded-full bg-[#EDEDED] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#00A292]"
                  style={{ width: `${(row.percent / maxPercent) * 100}%` }}
                />
              </div>
            </div>
            <span className="w-10 shrink-0 text-right text-[13px] font-medium text-[#111]">
              {row.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}