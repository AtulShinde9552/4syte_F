import { Megaphone, FileText, Download, Trash2 } from "lucide-react";

function HeaderCount({ count }) {
  return (
    <span className="inline-flex items-center justify-center min-w-[24px] h-[22px] px-2 rounded-full bg-[#EAF6F4] text-[#00786D] text-[12px] font-medium">
      {count ?? "-"}
    </span>
  );
}

function ExclusionRow({ file, onDownload, onDelete }) {
  return (
    <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1.5fr] items-center px-6 py-4 border-b border-[#EBEBEB] last:border-b-0">
      <div className="flex items-center gap-2 min-w-0">
        <FileText size={16} className="text-[#00A292] shrink-0" />
        <span className="text-[13px] text-[#111] truncate">{file.fileName}</span>
      </div>

      <span className="text-[13px] text-gray-400">
        {file.description || "-"}
      </span>

      <HeaderCount count={file.headers} />

      <span className="text-[13px] text-gray-600">{file.uploadedAt}</span>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onDownload?.(file)}
          className="text-[13px] font-medium text-[#00A292] bg-[#EAF6F4] rounded-lg px-4 py-1.5 hover:bg-[#DAF0EC] transition-colors"
        >
          Download
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(file)}
          className="text-[13px] font-medium text-red-500 bg-red-50 rounded-lg px-4 py-1.5 hover:bg-red-100 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function ExclusionDetailTab({ files = [] }) {
  const handleDownload = (file) => {
    // TODO: wire up single-file download
  };

  const handleDelete = (file) => {
    // TODO: wire up delete
  };

  return (
    <div className="px-4 sm:px-6 lg:px-15 py-6 flex flex-col gap-5">
      {/* Header */}
        <h2 className="text-[18px] font-semibold text-[#00A292]">Exclusions</h2>
      {/* Table */}
      <div className="border border-[#EBEBEB] rounded-xl overflow-hidden overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1.5fr] bg-[#F5F6F7] px-6 py-3.5">
            <span className="text-[13px] font-semibold text-[#111]">File Name</span>
            <span className="text-[13px] font-semibold text-[#111]">Description</span>
            <span className="text-[13px] font-semibold text-[#111]">Headers</span>
            <span className="text-[13px] font-semibold text-[#111]">Uploaded at</span>
            <span className="text-[13px] font-semibold text-[#111]">Actions</span>
          </div>

          {files.length === 0 ? (
            <div className="py-10 text-center text-[14px] text-gray-400">
              No exclusion files uploaded yet.
            </div>
          ) : (
            files.map((file) => (
              <ExclusionRow
                key={file.id}
                file={file}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}