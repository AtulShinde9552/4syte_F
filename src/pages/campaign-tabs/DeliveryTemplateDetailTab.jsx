import { useEffect, useState } from "react";
import { assetUrl } from "../../api";
import { usePopup } from "../../components/Popup";
import { FileText, Download, Trash2, Plus, Check, Pencil, X } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-[#DEDEDE] bg-white px-3 py-2 text-[13px] text-gray-700 outline-none focus:border-[#00A292]";

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

function FieldRow({ name, count, values = [], editing, onNameChange, onValuesChange }) {
  const formattedValues = values.filter((value) => value !== "" && value !== null && value !== undefined);

  return (
    <div className="grid grid-cols-[180px_1fr] border-b border-[#EBEBEB] last:border-b-0">
      <div className="flex items-start gap-2 px-5 py-4 border-r border-[#EBEBEB]">
        {editing ? (
          <input
            type="text"
            value={name ?? ""}
            onChange={(event) => onNameChange(event.target.value)}
            className={inputClass}
          />
        ) : (
          <>
            <span className="text-[13px] font-semibold text-[#111]">{name}</span>
            <CountBadge count={count} />
          </>
        )}
      </div>

      <div className="px-5 py-4">
        {editing ? (
          <textarea
            value={formattedValues.join(", ")}
            onChange={(event) => {
              const parsedValues = event.target.value
                .split(",")
                .map((value) => value.trim())
                .filter((value) => value.length > 0);
              onValuesChange(parsedValues);
            }}
            className={`${inputClass} min-h-[70px] resize-y`}
            placeholder="Add values separated by commas"
          />
        ) : formattedValues.length === 0 ? (
          <span className="text-[13px] text-gray-400 italic">
            No values found for this field
          </span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {formattedValues.map((value, i) => (
              <ValueChip key={`${value}-${i}`} value={value} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, editing, onChange }) {
  return (
    <div className="flex gap-6">
      <p className="w-37.5 shrink-0 text-[14px] font-semibold text-[#111]">{label}</p>
      {editing ? (
        <input
          type="text"
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

export default function DeliveryTemplateDetailTab({ template, fields = [], onSave }) {
  const { show } = usePopup();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(template || {});
  const [fieldDrafts, setFieldDrafts] = useState(
    Array.isArray(fields) ? fields.map((field) => ({
      ...field,
      name: field.name || field.field_name || "",
      values: Array.isArray(field.values)
        ? field.values
        : typeof field.values === "string"
          ? field.values.split(",").map((value) => value.trim()).filter(Boolean)
          : [],
    })) : []
  );

  useEffect(() => {
    setFieldDrafts(
      Array.isArray(fields) ? fields.map((field) => ({
        ...field,
        name: field.name || field.field_name || "",
        values: Array.isArray(field.values)
          ? field.values
          : typeof field.values === "string"
            ? field.values.split(",").map((value) => value.trim()).filter(Boolean)
            : [],
      })) : []
    );
  }, [fields]);

  const handleAddTemplate = () => {
    // TODO: open add-template flow
  };

  const handleDownload = () => {
    const filePath = template?.filePath || template?.file_path;
    if (filePath) {
      window.open(assetUrl(filePath), "_blank");
    } else {
      show("Template file path not found!", "warning");
    }
  };

  const handleDelete = () => {
    // TODO: wire up template delete
  };

  const updateDraft = (field) => (value) => setDraft((current) => ({ ...current, [field]: value }));
  const updateFieldDraft = (index, fieldKey) => (value) => {
    setFieldDrafts((current) => current.map((field, currentIndex) => {
      if (currentIndex !== index) return field;
      return { ...field, [fieldKey]: value };
    }));
  };

  const handleEdit = () => {
    setDraft({
      ...(template || {}),
      fileName: template?.fileName || template?.file_name || template?.original_file_name || "",
      description: template?.description || template?.template_description || "",
      filePath: template?.filePath || template?.file_path || "",
    });
    setFieldDrafts(
      Array.isArray(fields) ? fields.map((field) => ({
        ...field,
        name: field.name || field.field_name || "",
        values: Array.isArray(field.values)
          ? field.values
          : typeof field.values === "string"
            ? field.values.split(",").map((value) => value.trim()).filter(Boolean)
            : [],
      })) : []
    );
    setEditing(true);
  };
  const handleCancel = () => {
    setDraft(template || {});
    setFieldDrafts(
      Array.isArray(fields) ? fields.map((field) => ({
        ...field,
        name: field.name || field.field_name || "",
        values: Array.isArray(field.values)
          ? field.values
          : typeof field.values === "string"
            ? field.values.split(",").map((value) => value.trim()).filter(Boolean)
            : [],
      })) : []
    );
    setEditing(false);
  };

  const handleSave = async () => {
    if (!template || typeof onSave !== "function") {
      setEditing(false);
      return;
    }

    setSaving(true);
    try {
      await onSave({
        id: template.id,
        fileName: draft.fileName || draft.file_name || draft.original_file_name || "",
        description: draft.description || draft.template_description || "",
        filePath: draft.filePath || draft.file_path || "",
        fields: fieldDrafts.map((field) => ({
          ...field,
          name: field.name || field.field_name || "",
          values: Array.isArray(field.values)
            ? field.values.map((value) => String(value).trim()).filter(Boolean)
            : [],
        })),
      });
      setEditing(false);
      show("Delivery template updated successfully.", "success");
    } catch (error) {
      show(error.message || "Unable to update delivery template.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-15 py-6 flex flex-col gap-5">
      <div className="border border-[#EBEBEB] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-[20px] font-semibold text-[#00A292]">Delivery Templates</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleAddTemplate}
              className="flex items-center gap-1.5 text-[14px] font-medium text-white bg-[#00A292] rounded-lg px-4 py-2 hover:bg-[#008F81] transition-colors"
            >
              <Plus size={15} />
              Add Template
            </button>

            {!editing ? (
              <button
                type="button"
                onClick={handleEdit}
                aria-label="Edit delivery template"
                title="Edit delivery template"
                className="rounded-md p-1.5 text-[#00A292] hover:bg-[#00A292]/10"
              >
                <Pencil size={16} />
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  aria-label="Cancel delivery template editing"
                  title="Cancel"
                  className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                >
                  <X size={17} />
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  aria-label="Save delivery template"
                  title="Save"
                  className="rounded-md p-1.5 text-[#00A292] hover:bg-[#00A292]/10 disabled:opacity-50"
                >
                  <Check size={17} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-[#EBEBEB]" />

        {template ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#F5F6F7] px-6 py-4 border-b border-[#EBEBEB]">
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={16} className="text-[#00A292] shrink-0" />
                <span className="text-[13px] text-[#111] truncate">
                  <span className="font-semibold">Template:</span>{" "}
                  {editing ? draft.fileName || "Untitled template" : template.fileName || template.file_name || template.original_file_name || "Untitled template"}
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

            <div className="p-6 flex flex-col gap-4">
              <DetailRow
                label="Template Name"
                value={editing ? draft.fileName : template.fileName || template.file_name || template.original_file_name}
                editing={editing}
                onChange={updateDraft("fileName")}
              />
              <DetailRow
                label="Description"
                value={editing ? draft.description : template.description || template.template_description}
                editing={editing}
                onChange={updateDraft("description")}
              />
              <DetailRow
                label="File Path"
                value={editing ? draft.filePath : template.filePath || template.file_path}
                editing={editing}
                onChange={updateDraft("filePath")}
              />
            </div>
          </>
        ) : (
          <div className="px-6 py-10 text-center text-[14px] text-gray-500">
            No delivery template uploaded for this campaign yet.
          </div>
        )}
      </div>

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
          {fieldDrafts.map((field, index) => (
            <FieldRow
              key={`${field.name || "field"}-${index}`}
              name={field.name || field.field_name || ""}
              count={field.count}
              values={Array.isArray(field.values) ? field.values : []}
              editing={editing}
              onNameChange={updateFieldDraft(index, "name")}
              onValuesChange={updateFieldDraft(index, "values")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}