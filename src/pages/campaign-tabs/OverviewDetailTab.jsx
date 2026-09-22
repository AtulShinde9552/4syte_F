import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { usePopup } from "../../components/Popup";

const inputClass =
  "w-full rounded-lg border border-[#DEDEDE] bg-white px-3 py-2 text-[13px] text-gray-700 outline-none focus:border-[#00A292]";

function DetailRow({ label, value, editing, onChange, type = "text" }) {
  return (
    <div className="flex gap-6">
      <p className="w-37.5 shrink-0 text-[14px] font-semibold text-[#111]">
        {label}
      </p>
      {editing ? (
        <input
          type={type}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        />
      ) : (
        <p className="text-[14px] text-gray-600">{value ?? "N/A"}</p>
      )}
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

function EditActions({ editing, saving, onEdit, onCancel, onSave }) {
  if (!editing) {
    return (
      <button type="button" onClick={onEdit} aria-label="Edit campaign overview" title="Edit campaign overview" className="rounded-md p-1.5 text-[#00A292] hover:bg-[#00A292]/10">
        <Pencil size={16} />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <button type="button" onClick={onCancel} disabled={saving} aria-label="Cancel overview editing" title="Cancel" className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-50">
        <X size={17} />
      </button>
      <button type="button" onClick={onSave} disabled={saving} aria-label="Save campaign overview" title="Save" className="rounded-md p-1.5 text-[#00A292] hover:bg-[#00A292]/10 disabled:opacity-50">
        <Check size={17} />
      </button>
    </div>
  );
}

export default function OverviewDetailTab({ campaign, onSave }) {
  const { show } = usePopup();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(campaign);

  if (!campaign) return null;

  const updateDraft = (field) => (value) => setDraft((current) => ({ ...current, [field]: value }));
  const handleEdit = () => { setDraft(campaign); setEditing(true); };
  const handleCancel = () => { setDraft(campaign); setEditing(false); };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        campaignName: draft.name,
        ownerName: draft.owner,
        productLine: draft.productLine,
        startDate: draft.startDate,
        endDate: draft.endDate,
        qualityAllocated: draft.leadsAllocated,
        deliveryCadence: draft.deliveryCadence,
        pacing: draft.pacing,
        maxLeads: draft.maxCompany,
        marketingChannel: draft.marketingChannel,
        description: draft.description,
      });
      setEditing(false);
      show("Campaign overview updated successfully.", "success");
    } catch (error) {
      show(error.message || "Unable to update campaign overview.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-15 py-6 flex flex-col gap-6">
      {/* Campaign Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[#00A292]">Campaign Overview</h2>
            <EditActions editing={editing} saving={saving} onEdit={handleEdit} onCancel={handleCancel} onSave={handleSave} />
          </div>
          <div className="flex flex-col gap-3">
            <DetailRow
              label="Date Range"
              value={editing ? draft.startDate : `${campaign.startDate} - ${campaign.endDate}`}
              editing={editing}
              type="date"
              onChange={updateDraft("startDate")}
            />
            {editing && <DetailRow label="End Date" value={draft.endDate} editing type="date" onChange={updateDraft("endDate")} />}
            <DetailRow label="Campaign Owner" value={editing ? draft.owner : campaign.owner} editing={editing} onChange={updateDraft("owner")} />
            <DetailRow label="Campaign Name" value={editing ? draft.name : campaign.name} editing={editing} onChange={updateDraft("name")} />
            <DetailRow label="Product Line" value={editing ? draft.productLine : campaign.productLine} editing={editing} onChange={updateDraft("productLine")} />
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
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#00A292]">Additional Details</h2>
          <EditActions editing={editing} saving={saving} onEdit={handleEdit} onCancel={handleCancel} onSave={handleSave} />
        </div>
        <div className="flex flex-col gap-3">
          <DetailRow label="Marketing Channel" value={editing ? draft.marketingChannel : campaign.marketingChannel} editing={editing} onChange={updateDraft("marketingChannel")} />
          <DetailRow label="Description" value={editing ? draft.description : campaign.description} editing={editing} onChange={updateDraft("description")} />
          <DetailRow label="Delivery Cadence" value={editing ? draft.deliveryCadence : campaign.deliveryCadence} editing={editing} onChange={updateDraft("deliveryCadence")} />
          <DetailRow label="Pacing" value={editing ? draft.pacing : campaign.pacing} editing={editing} onChange={updateDraft("pacing")} />
        </div>
      </div>
    </div>
  );
}