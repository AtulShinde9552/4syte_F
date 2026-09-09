import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, ArrowRight } from "lucide-react";
import FormCard from "../../components/form/FormCard";
import FileUploadField from "../../components/form/FileUploadField";

const statusStyles = {
  Processed: "text-[#00A292]",
  Processing: "text-amber-500",
  Failed: "text-red-500",
};

const initialLeadFiles = [
  {
    id: "0-HFTD",
    uploadedDate: "8 Aug 2026",
    uploadedTime: "07:00PM",
    fileName: "Q3 Enterprise Pipeline Push....",
    submitted: 200,
    leadSource: "Upload",
    status: "Processed",
  },
  {
    id: "0-HFTD",
    uploadedDate: "8 Aug 2026",
    uploadedTime: "07:00PM",
    fileName: "Q3 Enterprise Pipeline Push....",
    submitted: 200,
    leadSource: "Upload",
    status: "Processed",
  },
];

export default function LeadsTab() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [leadFile, setLeadFile] = useState(null);
  const [leadFiles, setLeadFiles] = useState(initialLeadFiles);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setLeadFile(file ? file.name : null);
  };

  const handleUpdateLeadTemplate = () => {
    if (!leadFile) return;

    const now = new Date();
    setLeadFiles((prev) => [
      ...prev,
      {
        id: `0-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        uploadedDate: now.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        uploadedTime: now
          .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
          .replace(" ", ""),
        fileName: leadFile,
        submitted: 0,
        leadSource: "Upload",
        status: "Processing",
      },
    ]);
    setLeadFile(null);
  };

  const handleView = (row) => {
    // TODO: navigate to lead file detail / stats view
  };

  return (
    <div className="px-4 sm:px-6 lg:px-15 py-6 flex flex-col gap-6">
      {/* Search Row */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 flex-1 max-w-md h-11 bg-white border border-[#EBEBEB] rounded-full px-4">
          <Search size={17} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Campaign...."
            className="flex-1 min-w-0 bg-transparent outline-none border-none text-[13px] text-gray-700 placeholder:text-gray-400"
          />
        </div>
        <button
          type="button"
          className="text-[14px] font-medium text-white bg-[#00A292] rounded-full px-6 py-2.5 hover:bg-[#008F81] transition-colors"
        >
          Search
        </button>
      </div>

      {/* Upload */}
      <FormCard title="Upload Lead File (CSV)">
        <FileUploadField
          fileName={leadFile}
          onChange={handleFileChange}
          accept=".csv"
          hint="Update CSV files (Max 10MB)"
        />
      </FormCard>

      {/* Uploaded Lead Files Table */}
      <FormCard title="Uploaded Lead Files">
        <div className="rounded-lg border border-[#EBEBEB] overflow-hidden overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[0.8fr_1.1fr_1.6fr_0.8fr_0.9fr_1fr_0.7fr] bg-[#F5F6F7] px-4 py-2.5 text-[12px] font-medium text-gray-500">
              <span>ID</span>
              <span>Uploaded Date</span>
              <span>File Name</span>
              <span>Submitted</span>
              <span>Lead Source</span>
              <span>Upload Status</span>
              <span>Stats</span>
            </div>

            {leadFiles.length === 0 ? (
              <div className="py-10 text-center text-[14px] text-[#111]">
                No lead files uploaded yet.
              </div>
            ) : (
              leadFiles.map((row, i) => (
                <div
                  key={`${row.id}-${i}`}
                  className="grid grid-cols-[0.8fr_1.1fr_1.6fr_0.8fr_0.9fr_1fr_0.7fr] items-center px-4 py-3 text-[13px] text-gray-700 border-t border-[#EBEBEB]"
                >
                  <span>{row.id}</span>
                  <span className="text-gray-500">
                    {row.uploadedDate}{" "}
                    <span className="text-[11px] text-gray-400">
                      {row.uploadedTime}
                    </span>
                  </span>
                  <span className="truncate">{row.fileName}</span>
                  <span>{row.submitted}</span>
                  <span>{row.leadSource}</span>
                  <span className={`font-medium ${statusStyles[row.status] ?? "text-gray-600"}`}>
                    {row.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleView(row)}
                    className="flex items-center gap-1 text-[#00A292] hover:text-[#008F81] font-medium w-fit"
                  >
                    View
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </FormCard>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate("/org/campaigns")}
          className="flex items-center gap-1.5 text-[14px] font-medium text-[#111] border border-[#EBEBEB] bg-[#FAFAFA] rounded-md px-5 py-2.5 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Campaign List
        </button>
        <button
          type="button"
          onClick={handleUpdateLeadTemplate}
          className="text-[14px] font-medium text-white bg-[#00A292] rounded-md px-6 py-2.5 hover:bg-[#008F81] transition-colors cursor-pointer"
        >
          Update Lead Template
        </button>
      </div>
    </div>
  );
}