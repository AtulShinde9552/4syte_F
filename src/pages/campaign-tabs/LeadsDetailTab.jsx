import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, Upload } from "lucide-react";
import UploadedLeadFilesTable from "../../components/leads/UploadedLeadFilesTable";

export default function LeadsDetailTab({ templates = [] }) {
  const { id } = useParams();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [leadFile, setLeadFile] = useState(null);
  const [leadFilesList, setLeadFilesList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchUploadedLeads();
  }, [id]);

  const fetchUploadedLeads = async () => {
    try {
      const response = await fetch(`http://localhost/clientportal/leads/get_list/${id}`);
      const result = await response.json();
      if (result.status === "success") {
        setLeadFilesList(result.data);
      }
    } catch (error) {
      console.error("Error fetching leads list:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setLeadFile(file || null);
  };

  const handleUploadAndValidate = async () => {
    if (!selectedTemplate || !leadFile || !id) return;
    
    setIsUploading(true);

    const formData = new FormData();
    formData.append("campaign_id", id);
    formData.append("template_id", selectedTemplate);
    formData.append("lead_file", leadFile);

    try {
      const response = await fetch("http://localhost/clientportal/leads/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result.status === "success") {
        alert("Lead file uploaded successfully!");
        setLeadFile(null);
        setSelectedTemplate("");
        // Table data turant refresh karo
        fetchUploadedLeads();
      } else {
        alert(result.message || "Failed to upload lead file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Something went wrong during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const canSubmit = Boolean(selectedTemplate && leadFile && !isUploading);

  return (
    <div className="px-4 sm:px-6 lg:px-15 py-6 flex flex-col gap-6">
      {/* Header */}
      <h2 className="text-[18px] font-semibold text-[#00A292]">Leads</h2>

      {/* Upload panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: intro copy */}
        <div className="flex flex-col items-center text-center gap-2 py-6">
          <h3 className="text-[20px] font-semibold text-[#111]">
            Upload New Leads
          </h3>
          <p className="text-[13px] text-gray-500">
            Select the matching delivery template, then upload your lead file.
          </p>
        </div>

        {/* Right: form */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold text-[#111]">
              1. Select Delivery Template
            </p>
            <div className="relative">
             <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full h-11 appearance-none bg-[#F5F6F7] border border-[#EBEBEB] rounded-lg pl-4 pr-10 text-[13px] text-gray-700 outline-none focus:border-[#00A292] transition-colors"
              >
                <option value="" disabled>
                  Choose a template to Validate against
                </option>
                
                {/* SAFE MAP FUNCTION */}
                {Array.isArray(templates) && templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.fileName || template.name}
                  </option>
                ))}

              </select>
              <ChevronDown
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold text-[#111]">
              2. Upload Lead File
            </p>
            <label className="flex items-center justify-center h-11 bg-[#F5F6F7] border border-[#EBEBEB] rounded-lg text-[13px] text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="truncate max-w-[200px]">
                {leadFile ? leadFile.name : "Choose file"}
              </span>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleUploadAndValidate}
            disabled={!canSubmit}
            className={`flex items-center justify-center gap-2 h-11 rounded-lg text-[14px] font-medium text-white transition-colors ${
              canSubmit
                ? "bg-[#00A292] hover:bg-[#008F81] cursor-pointer"
                : "bg-[#00A292]/40 cursor-not-allowed"
            }`}
          >
            <Upload size={15} />
            {isUploading ? "Uploading..." : "Upload & Validate Leads"}
          </button>
        </div>
      </div>

      {/* Uploaded lead files table */}
      <UploadedLeadFilesTable rows={leadFilesList} />
    </div>
  );
}