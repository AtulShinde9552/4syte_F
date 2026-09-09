import SimpleSelectDropdown from "./SimpleSelectDropdown";
import MultiSelectDropdown from "./MultiSelectDropdown";

export default function FilterBar({
  customer,
  onCustomerChange,
  campaignGroup,
  onCampaignGroupChange,
  leadStatus,
  onLeadStatusChange,
  period,
  onPeriodChange,
  customerOptions = [],
  campaignGroupOptions = [],
  leadStatusOptions = [],
  periodOptions = [],
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-6 lg:px-9 pb-4 sm:pb-5">
      <SimpleSelectDropdown
        label="Customer"
        placeholder="RaviK"
        options={customerOptions}
        value={customer}
        onChange={onCustomerChange}
      />
      <MultiSelectDropdown
        label="Campaign Group"
        placeholder="RaviK"
        options={campaignGroupOptions}
        selected={campaignGroup}
        onChange={onCampaignGroupChange}
      />
      <SimpleSelectDropdown
        label="Lead Status"
        placeholder="Select Status"
        options={leadStatusOptions}
        value={leadStatus}
        onChange={onLeadStatusChange}
      />
      <SimpleSelectDropdown
        label="Period"
        placeholder="Select Period"
        options={periodOptions}
        value={period}
        onChange={onPeriodChange}
      />
    </div>
  );
}