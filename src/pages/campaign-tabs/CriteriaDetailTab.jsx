import { Download, ArrowDown } from "lucide-react";

function FileChip({ fileName }) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 bg-[#F5F6F7] rounded-lg px-3 py-2 text-[12px] font-medium text-[#111] hover:bg-gray-200 transition-colors w-fit"
    >
      <span className="truncate max-w-[180px]">{fileName}</span>
      <ArrowDown size={14} className="text-[#00A292] shrink-0" />
    </button>
  );
}

function CriteriaField({ label, children }) {
  return (
    <div className="flex flex-col gap-2 px-6 py-5">
      <p className="text-[14px] font-semibold text-[#00A292]">{label}</p>
      {children}
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

export default function CriteriaDetailTab({ criteria }) {
  if (!criteria) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-15 py-6">
      <div className="border border-[#EBEBEB] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-[20px] font-semibold text-[#00A292]">
            Targeting Criteria
          </h2>
          <button
            type="button"
            className="flex items-center gap-1.5 text-[13px] font-medium text-[#00A292] underline underline-offset-2 hover:text-[#008F81] transition-colors"
          >
            <Download size={14} />
            Download Criteria
          </button>
        </div>

        <div className="border-t border-[#EBEBEB]" />

        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_1fr] divide-y lg:divide-y-0 lg:divide-x divide-[#EBEBEB] border-b border-[#EBEBEB]">
          <div className="divide-y divide-[#EBEBEB]">
            <CriteriaField label="Geography">
              <CriteriaValue value={criteria.geography} />
            </CriteriaField>
            <CriteriaField label="Job Title List">
              {criteria.jobTitleListFile ? (
                <FileChip fileName={criteria.jobTitleListFile} />
              ) : (
                <CriteriaValue value={criteria.jobTitleList} />
              )}
            </CriteriaField>
          </div>

          {/* Column 2: Industries */}
          <CriteriaField label="Industries">
            <p className="text-[13px] text-gray-700 leading-relaxed">
              {criteria.industries || "N/A"}
            </p>
          </CriteriaField>

          <div className="divide-y divide-[#EBEBEB]">
            <CriteriaField label="Target Account List">
              {criteria.targetAccountListFile ? (
                <FileChip fileName={criteria.targetAccountListFile} />
              ) : (
                <CriteriaValue value={criteria.targetAccountList} />
              )}
            </CriteriaField>
            <CriteriaField label="Passing File / Instructions">
              <p className="text-[13px] text-gray-400">
                {criteria.passingFileInstructions || "No Pacing files uploaded"}
              </p>
            </CriteriaField>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#EBEBEB]">
          <CriteriaField label="Custom Questions">
            <CriteriaValue value={criteria.customQuestions} />
          </CriteriaField>
          <CriteriaField label="Job Level">
            <CriteriaValue value={criteria.jobLevel} />
          </CriteriaField>
          <CriteriaField label="Company Revenue">
            <CriteriaValue value={criteria.companyRevenue} />
          </CriteriaField>
          <CriteriaField label="Company Size">
            <CriteriaValue value={criteria.companySize} />
          </CriteriaField>
        </div>
      </div>
    </div>
  );
}