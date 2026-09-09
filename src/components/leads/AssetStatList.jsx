export default function AssetStatList({ rows = [] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] text-gray-500">Top performing content by leads</p>
        <p className="text-[12px] text-gray-500">No. of leads</p>
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((row, idx) => (
          <div
            key={`${row.name}-${idx}`}
            className="flex items-center justify-between bg-[#F5F6F7] rounded-lg px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="text-[13px] text-[#111] truncate">{row.name}</p>
              {row.subtitle && (
                <p className="text-[11px] text-gray-400">{row.subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[12px] font-medium text-[#00A292]">{row.percent}%</span>
              <span className="text-[13px] font-medium text-[#111] w-8 text-right">
                {row.count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}