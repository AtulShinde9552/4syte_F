import { CheckCircle2 } from "lucide-react";

export default function StatCard({ title, children }) {
  return (
    <div className="border border-[#EBEBEB] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 size={16} className="text-[#00A292]" fill="#00A292" strokeWidth={0} />
        <CheckCircle2
          size={16}
          className="text-white absolute"
          style={{ marginLeft: "-16px" }}
        />
        <p className="text-[14px] font-semibold text-[#00A292]">{title}</p>
      </div>
      {children}
    </div>
  );
}