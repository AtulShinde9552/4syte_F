export default function StatPill({ icon: Icon, label, value, sub, subClassName = "" }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-gray-500" />
      </div>
      <div>
        <p className="text-[12px] text-gray-500 whitespace-nowrap">{label}</p>
        <p className="text-[15px] font-semibold text-[#111] whitespace-nowrap">
          {value}
          {sub && <span className={`ml-1 text-[12px] font-medium ${subClassName}`}>{sub}</span>}
        </p>
      </div>
    </div>
  );
}