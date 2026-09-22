import { useState } from "react";
import { Check, Download, ArrowDown, Pencil, X } from "lucide-react";
import { usePopup } from "../../components/Popup";

const inputClass =
  "w-full rounded-lg border border-[#DEDEDE] bg-white px-3 py-2 text-[13px] text-gray-700 outline-none focus:border-[#00A292]";

function FileChip({ fileName }) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 bg-[#F5F6F7] rounded-lg px-3 py-2 text-[12px] font-medium text-[#111] hover:bg-gray-200 transition-colors w-fit"
    >
      <span className="truncate max-w-45">{fileName}</span>
      <ArrowDown size={14} className="text-[#00A292] shrink-0" />
    </button>
  );
}

function CriteriaField({ label, children, editing, value, onChange }) {
  return (
    <div className="flex flex-col gap-2 px-6 py-5">
      <p className="text-[14px] font-semibold text-[#00A292]">{label}</p>
      {editing ? (
        <input className={inputClass} value={value ?? ""} onChange={(event) => onChange(event.target.value)} />
      ) : children}
    </div>
  );
}

function CriteriaValue({ value }) {
  const isEmpty = !value || value === "N/A";
  return (
    <p
      className={`text-[13px] ${
        isEmpty ? "text-gray-400" : "text-gray-700"
      }`}
    >
      {value || "N/A"}
    </p>
  );
}

export default function CriteriaDetailTab({ criteria, onSave }) {
  const { show } = usePopup();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(criteria);

  if (!criteria) return null;

  const updateDraft = (field) => (value) => setDraft((current) => ({ ...current, [field]: value }));
  const handleEdit = () => { setDraft(criteria); setEditing(true); };
  const handleCancel = () => { setDraft(criteria); setEditing(false); };
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        manualJobTitles: draft.jobTitleList ?? draft.manual_job_titles,
        pacingDescription: draft.pacingDescription ?? draft.passingFileInstructions ?? draft.pacing_description,
        geography: draft.geography,
        industries: draft.industries,
        jobLevel: draft.jobLevel ?? draft.job_level,
        companySize: draft.companySize ?? draft.company_size,
        customQuestions: draft.customQuestions ?? draft.custom_questions,
        criteriaInstructions: draft.criteriaInstructions ?? draft.criteria_instructions,
        targetAccountExact: draft.targetAccountExact ?? draft.target_account_exact ?? false,
        jobTitleExact: draft.jobTitleExact ?? draft.job_title_exact ?? false,
        pacingExact: draft.pacingExact ?? draft.pacing_exact ?? false,
        geographyExact: draft.geographyExact ?? draft.geography_exact ?? false,
        industriesExact: draft.industriesExact ?? draft.industries_exact ?? false,
        jobLevelExact: draft.jobLevelExact ?? draft.job_level_exact ?? false,
        companySizeExact: draft.companySizeExact ?? draft.company_size_exact ?? false,
        customQuestionsExact: draft.customQuestionsExact ?? draft.custom_questions_exact ?? false,
      });
      setEditing(false);
      show("Campaign criteria updated successfully.", "success");
    } catch (error) {
      show(error.message || "Unable to update campaign criteria.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-15 py-6">
      <div className="border border-[#EBEBEB] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-[20px] font-semibold text-[#00A292]">Targeting Criteria</h2>
          <div className="flex items-center gap-3">
            <button type="button" className="flex items-center gap-1.5 text-[13px] font-medium text-[#00A292] underline underline-offset-2 hover:text-[#008F81] transition-colors">
              <Download size={14} />
              Download Criteria
            </button>
            {!editing ? (
              <button type="button" onClick={handleEdit} aria-label="Edit targeting criteria" title="Edit targeting criteria" className="rounded-md p-1.5 text-[#00A292] hover:bg-[#00A292]/10">
                <Pencil size={16} />
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button type="button" onClick={handleCancel} disabled={saving} aria-label="Cancel criteria editing" title="Cancel" className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-50">
                  <X size={17} />
                </button>
                <button type="button" onClick={handleSave} disabled={saving} aria-label="Save targeting criteria" title="Save" className="rounded-md p-1.5 text-[#00A292] hover:bg-[#00A292]/10 disabled:opacity-50">
                  <Check size={17} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-[#EBEBEB]" />

        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_1fr] divide-y lg:divide-y-0 lg:divide-x divide-[#EBEBEB] border-b border-[#EBEBEB]">
          <div className="divide-y divide-[#EBEBEB]">
            <CriteriaField label="Geography" editing={editing} value={draft.geography} onChange={updateDraft("geography")}>
              <CriteriaValue value={criteria.geography} />
            </CriteriaField>
            <CriteriaField label="Job Title List" editing={editing} value={draft.jobTitleList} onChange={updateDraft("jobTitleList")}>
              {criteria.jobTitleListFile ? (
                <FileChip fileName={criteria.jobTitleListFile} />
              ) : (
                <CriteriaValue value={criteria.jobTitleList} />
              )}
            </CriteriaField>
          </div>

          {/* Column 2: Industries */}
          <CriteriaField label="Industries" editing={editing} value={draft.industries} onChange={updateDraft("industries")}>
            <p className="text-[13px] text-gray-700 leading-relaxed">
              {criteria.industries || "N/A"}
            </p>
          </CriteriaField>

          <div className="divide-y divide-[#EBEBEB]">
            <CriteriaField label="Target Account List" editing={editing} value={draft.targetAccountList} onChange={updateDraft("targetAccountList")}>
              {criteria.targetAccountListFile ? (
                <FileChip fileName={criteria.targetAccountListFile} />
              ) : (
                <CriteriaValue value={criteria.targetAccountList} />
              )}
            </CriteriaField>
            <CriteriaField label="Passing File / Instructions" editing={editing} value={draft.passingFileInstructions} onChange={updateDraft("passingFileInstructions")}>
              <p className="text-[13px] text-gray-400">
                {criteria.passingFileInstructions || "No Pacing files uploaded"}
              </p>
            </CriteriaField>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#EBEBEB]">
          <CriteriaField label="Custom Questions" editing={editing} value={draft.customQuestions} onChange={updateDraft("customQuestions")}>
            <CriteriaValue value={criteria.customQuestions} />
          </CriteriaField>
          <CriteriaField label="Job Level" editing={editing} value={draft.jobLevel} onChange={updateDraft("jobLevel")}>
            <CriteriaValue value={criteria.jobLevel} />
          </CriteriaField>
          <CriteriaField label="Company Revenue" editing={editing} value={draft.companyRevenue} onChange={updateDraft("companyRevenue")}>
            <CriteriaValue value={criteria.companyRevenue} />
          </CriteriaField>
          <CriteriaField label="Company Size" editing={editing} value={draft.companySize} onChange={updateDraft("companySize")}>
            <CriteriaValue value={criteria.companySize} />
          </CriteriaField>
        </div>
      </div>
    </div>
  );
}