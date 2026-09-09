import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import LeadDetailPanel from "./LeadDetailPanel";

const statusStyles = {
  Processed: "text-[#1FAA59]",
  Failed: "text-red-500",
  Processing: "text-amber-500",
};

export default function UploadedLeadFilesTable({ rows = [] }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleRow = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const expandedRow = rows.find((row, index) => (row.id ?? index) === expandedId);

  return (
    <div className="flex flex-col gap-5">
      {/* Table */}
      <div className="flex flex-col gap-0">
        <div className="bg-[#F5F6F7] rounded-t-xl px-6 py-3.5">
          <p className="text-[14px] font-medium text-[#111]">Uploaded Lead Files</p>
        </div>

        <div className="border border-t-0 border-[#EBEBEB] rounded-b-xl overflow-hidden overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[0.8fr_1.3fr_1.6fr_0.9fr_0.9fr_1fr_0.8fr] bg-[#F5F6F7] px-6 py-3">
              <span className="text-[13px] font-semibold text-[#111]">ID</span>
              <span className="text-[13px] font-semibold text-[#111]">Uploaded Date</span>
              <span className="text-[13px] font-semibold text-[#111]">File Name</span>
              <span className="text-[13px] font-semibold text-[#111]">Submitted</span>
              <span className="text-[13px] font-semibold text-[#111]">Lead Source</span>
              <span className="text-[13px] font-semibold text-[#111]">Upload Status</span>
              <span className="text-[13px] font-semibold text-[#111]">Stats</span>
            </div>

            {rows.length === 0 ? (
              <div className="py-10 text-center text-[13px] text-gray-400 border-t border-[#EBEBEB]">
                No leads available yet.
              </div>
            ) : (
              rows.map((row, index) => {
                const rowKey = row.id ?? index;
                const isExpanded = expandedId === rowKey;

                return (
                  <div
                    key={rowKey}
                    className="grid grid-cols-[0.8fr_1.3fr_1.6fr_0.9fr_0.9fr_1fr_0.8fr] items-center px-6 py-3.5 text-[13px] text-gray-700 border-t border-[#EBEBEB]"
                  >
                    <span>{row.id}</span>
                    <span className="text-gray-500">
                      {row.uploadedDate}{" "}
                      <span className="text-gray-400">{row.uploadedTime}</span>
                    </span>
                    <span className="truncate">{row.fileName}</span>
                    <span>{row.submitted}</span>
                    <span>{row.leadSource}</span>
                    <span
                      className={`font-medium ${statusStyles[row.status] ?? "text-gray-600"}`}
                    >
                      {row.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleRow(rowKey)}
                      className="flex items-center gap-1 text-[#00A292] hover:text-[#008F81] font-medium w-fit"
                    >
                      View
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Detail panel — animated expand/collapse */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expandedRow ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {expandedRow && (
            <LeadDetailPanel
              region={expandedRow.detail?.region}
              industries={expandedRow.detail?.industries}
              employeeSize={expandedRow.detail?.employeeSize}
              assets={expandedRow.detail?.assets}
            />
          )}
        </div>
      </div>
    </div>
  );
}