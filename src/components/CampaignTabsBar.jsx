const tabs = ["Overview", "Criteria", "Resources", "Delivery Template", "Exclusion", "Leads"];

export default function CampaignTabsBar({ activeTab, onTabChange }) {
  return (
    <div className="flex items-center justify-center gap-6 lg:gap-10 bg-white shadow-sm rounded-2xl py-5 px-4 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`text-[14px] whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === tab
              ? "text-[#00A292] font-semibold underline underline-offset-4"
              : "text-[#111] hover:text-[#00A292]"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}