import { Rocket } from "lucide-react";

export default function CampaignSectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="
          rounded-full
          flex
          items-center
          justify-center
            p-2
          bg-[#00A292]
          text-white
          shadow-[0_4px_12px_rgba(0,162,146,0.15)] ]"
          
      >
        <Rocket size={17} fill="white" />
      </span>

      <h2
        className="
          text-[26px]
          font-medium
          text-[#00A292]
        "
      >
        {children}
      </h2>
    </div>
  );
}