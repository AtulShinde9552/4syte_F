import { assetUrl } from "../../api";
import { usePopup } from "../../components/Popup";
import { Megaphone, FileText, Download, Trash2, Plus } from "lucide-react";

function CountBadge({ count }) {
  if (!count) return null;
  return (
    <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#00A292] text-white text-[10px] font-semibold">
      {count}
    </span>
  );
}

function ValueChip({ value }) {
  return (
    <span className="inline-flex items-center bg-[#EAF6F4] border border-[#CDEAE6] text-[#00786D] text-[12px] font-medium rounded-md px-2.5 py-1 whitespace-nowrap">
      {value}
    </span>
  );
}

function FieldRow({ name, count, values = [] }) {
  return (
    <div className="grid grid-cols-[180px_1fr] border-b border-[#EBEBEB] last:border-b-0">
      <div className="flex items-start gap-2 px-5 py-4 border-r border-[#EBEBEB]">
        <span className="text-[13px] font-semibold text-[#111]">{name}</span>
        <CountBadge count={count} />
      </div>

      <div className="px-5 py-4">
        {values.length === 0 ? (
          <span className="text-[13px] text-gray-400 italic">
            No values found for this field
          </span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {values.map((value, i) => (
              <ValueChip key={`${value}-${i}`} value={value} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DeliveryTemplateDetailTab({ template, fields = [] }) {
  const { show } = usePopup();
  const handleAddTemplate = () => {
    // TODO: open add-template flow
  };

const handleDownload = () => {
    if (template && (template.filePath || template.file_path)) {
      window.open(assetUrl(template.filePath || template.file_path), '_blank');
    } else {
      show("Template file path not found!", "warning");
    }
  };

  const handleDelete = () => {
    // TODO: wire up template delete
  };

  return (
    <div className="px-4 sm:px-6 lg:px-15 py-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
         <h2 className="text-[18px] font-semibold text-[#00A292]">
            Delivery Templates
          </h2>
        <button
          type="button"
          onClick={handleAddTemplate}
          className="flex items-center gap-1.5 text-[14px] font-medium text-white bg-[#00A292] rounded-lg px-5 py-2.5 hover:bg-[#008F81] transition-colors"
        >
          <Plus size={15} />
          Add Template
        </button>
      </div>

      {/* Template file bar */}
      {template && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#F5F6F7] rounded-xl px-5 py-4">
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={16} className="text-[#00A292] shrink-0" />
            <span className="text-[13px] text-[#111] truncate">
              <span className="font-semibold">Template:</span>{" "}
              {template.fileName}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-[13px] font-medium text-[#00A292] bg-white border border-[#EBEBEB] rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
            >
              <Download size={14} />
              Download
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-[13px] font-medium text-red-500 bg-white border border-[#EBEBEB] rounded-lg px-4 py-2 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Field / Values table */}
      <div className="border border-[#EBEBEB] rounded-xl overflow-hidden">
        <div className="grid grid-cols-[180px_1fr] bg-[#F5F6F7] border-b border-[#EBEBEB]">
          <span className="px-5 py-3 text-[13px] font-semibold text-[#111] border-r border-[#EBEBEB]">
            Field Name
          </span>
          <span className="px-5 py-3 text-[13px] font-semibold text-[#111]">
            Values
          </span>
        </div>

        <div className="max-h-[520px] overflow-y-auto">
          {fields.map((field) => (
            <FieldRow
              key={field.name}
              name={field.name}
              count={field.count}
              values={field.values}
            />
          ))}
        </div>
      </div>
    </div>
  );
}