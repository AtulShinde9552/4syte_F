function DetailRow({ label, value }) {
  return (
    <div className="flex gap-6">
      <p className="w-[150px] shrink-0 text-[14px] font-semibold text-[#111]">
        {label}
      </p>
      <p className="text-[14px] text-gray-600">{value ?? "N/A"}</p>
    </div>
  );
}

function StatItem({ value, label }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[32px] font-bold text-[#00A292] leading-none">
        {value}
      </span>
      <span className="text-[14px] text-gray-700">{label}</span>
    </div>
  );
}

export default function OverviewDetailTab({ campaign }) {
  if (!campaign) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-15 py-6 flex flex-col gap-6">
      {/* Campaign Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="flex flex-col gap-5">
          <h2 className="text-[18px] font-semibold text-[#00A292]">
            Campaign Overview
          </h2>
          <div className="flex flex-col gap-3">
            <DetailRow
              label="Date Range"
              value={`${campaign.startDate} - ${campaign.endDate}`}
            />
            <DetailRow label="Campaign Owner" value={campaign.owner} />
            <DetailRow label="Campaign Name" value={campaign.name} />
            <DetailRow label="Product Line" value={campaign.productLine} />
          </div>
        </div>

        <div className="bg-[#F5F6F7] rounded-2xl p-6 flex flex-col gap-5 justify-center">
          <StatItem value={campaign.maxCompany} label="Max Company" />
          <StatItem value={campaign.daysLeft} label="Day's Left" />
          <StatItem value={campaign.leadsAllocated} label="Leads Allocated" />
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-[#F5F6F7] rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-[18px] font-semibold text-[#00A292]">
          Additional Details
        </h2>
        <div className="flex flex-col gap-3">
          <DetailRow label="Marketing Channel" value={campaign.marketingChannel} />
          <DetailRow label="Description" value={campaign.description} />
          <DetailRow label="Delivery Cadence" value={campaign.deliveryCadence} />
          <DetailRow label="Pacing" value={campaign.pacing} />
        </div>
      </div>
    </div>
  );
}