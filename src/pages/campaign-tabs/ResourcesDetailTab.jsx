import { assetUrl } from "../../api";
import { usePopup } from "../../components/Popup";
import { Megaphone, Download, Trash2 } from "lucide-react";

const columns = [
  "Program Name",
  "Region",
  "Qualifying Questions",
  "Strategy & Promoted Content",
  "Title",
  "Thank you page content",
  "PP LP Links",
  "PP LP Links",
];

function FileRow({ resource, onDownload, onDelete }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#F5F6F7] rounded-xl px-5 py-4">
      <span className="text-[14px] text-[#00A292] truncate">
        {resource.fileName}
      </span>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-3 bg-white border border-[#EBEBEB] rounded-full px-4 py-1.5">
          <span className="flex items-center gap-1.5 text-[12px] text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A292]" />
            {resource.fileType}
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A292]" />
            {resource.updatedAt}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onDownload?.(resource)}
          className="flex items-center gap-1.5 text-[13px] font-medium text-white bg-[#00A292] rounded-lg px-4 py-2 hover:bg-[#008F81] transition-colors"
        >
          <Download size={14} />
          Download
        </button>

        <button
          type="button"
          onClick={() => onDelete?.(resource)}
          className="flex items-center gap-1.5 text-[13px] font-medium text-white bg-red-500 rounded-lg px-4 py-2 hover:bg-red-600 transition-colors"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}

export default function ResourcesDetailTab({ resources = [] }) {
  const { show } = usePopup();
  const handleDownloadAll = () => {
    // TODO: wire up bulk download
  };

  const handleDownload = (resource) => {
    if (resource.filePath || resource.file_path) {
      window.open(assetUrl(resource.filePath || resource.file_path), '_blank');
    } else {
      show("File path not found!", "warning");
    }
  };

  const handleDelete = (resource) => {
    // TODO: wire up delete
  };

  return (
    <div className="px-4 sm:px-6 lg:px-15 py-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#00A292]">Resources</h2>
        <button
          type="button"
          onClick={handleDownloadAll}
          className="flex items-center gap-1.5 text-[14px] font-medium text-white bg-[#00A292] rounded-lg px-5 py-2.5 hover:bg-[#008F81] transition-colors"
        >
          <Download size={15} />
          Download All
        </button>
      </div>

      {/* File rows */}
      <div className="flex flex-col gap-3">
        {resources.length === 0 ? (
          <div className="bg-[#F5F6F7] rounded-xl px-5 py-6 text-center text-[13px] text-gray-400">
            No resources uploaded yet.
          </div>
        ) : (
          resources.map((resource) => (
            <FileRow
              key={resource.id}
              resource={resource}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Metadata table header */}
      <div className="bg-[#F5F6F7] rounded-xl overflow-x-auto">
        <div className="min-w-[900px] grid grid-cols-8 gap-4 px-5 py-4">
          {columns.map((col, i) => (
            <span
              key={`${col}-${i}`}
              className="text-[13px] font-semibold text-[#111]"
            >
              {col}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}