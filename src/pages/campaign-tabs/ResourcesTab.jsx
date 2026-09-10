import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Search, ArrowLeft, CheckCircle2 } from "lucide-react";
import FormCard from "../../components/form/FormCard";
import FileUploadField from "../../components/form/FileUploadField";
import TextAreaField from "../../components/form/TextAreaField";
// FIX: 'get' aur 'post' dono ko import kiya gaya hai
import { get, post } from "../../api"; 
import { usePopup } from "../../components/Popup";

export default function ResourcesTab({ campaignId, setCampaignId }) {
  const { show } = usePopup();
  const navigate = useNavigate();

   // --- NAYA: Context aur Smart Client ID Logic ---
  const outletContext = useOutletContext() || {};
  const selectedClient = outletContext.selectedClient;

  let targetClientId = "";
  let userRole = "";
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    userRole = storedUser.role;
    if (storedUser.role === "client") {
      targetClientId = storedUser.id;
    } else if (storedUser.role === "org" && selectedClient) {
      targetClientId = selectedClient.id;
    }
  } catch (e) {
    console.error(e);
  }
  // ---------------------------------------------


  // --- Auto Suggest States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCampaignName, setSelectedCampaignName] = useState("");
  const dropdownRef = useRef(null);

  // --- Form & Data States ---
  const [resourceFileData, setResourceFileData] = useState(null); 
  const [resourceFile, setResourceFile] = useState(null); 
  const [resourceDescription, setResourceDescription] = useState("");
  const [uploadedResources, setUploadedResources] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);

   const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value === "") {
      if (typeof setCampaignId === 'function') setCampaignId(null);
      setSelectedCampaignName("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2 && searchQuery !== selectedCampaignName) {

         if (userRole === "org" && !targetClientId) {
          console.warn("Please select a client to search campaigns.");
          return;
        }

        try {
          const result = await get(`/campaign/search?q=${searchQuery}&client_id=${targetClientId}`);
          if (result.status === "success") {
            setSuggestions(result.data);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error("Search Error:", error);
        }
      } else if (searchQuery.length < 2) {
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCampaignName, targetClientId, userRole]);

  const handleSelectCampaign = (id, name) => {
    if (typeof setCampaignId === 'function') setCampaignId(id);
    setSelectedCampaignName(name);
    setSearchQuery(name);
    setShowSuggestions(false);
    
    // (Optional) Yahan tum chaho to selected campaign ke purane resources fetch karne ki API call kar sakte ho
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ==========================================
  // FILE HANDLING & API SUBMISSION
  // ==========================================
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResourceFileData(file);
      setResourceFile(file.name);
    } else {
      setResourceFileData(null);
      setResourceFile(null);
    }
  };

  const handleUpdateResources = async () => {
    if (!campaignId) {
      show("Please search and select a Campaign first!", "warning");
      return;
    }
    if (!resourceFileData) {
      show("Please select a file to upload.", "warning");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("campaign_id", campaignId);
    formData.append("resource_file", resourceFileData);
    formData.append("resourceDescription", resourceDescription);

    try {
      const result = await post("/campaign/save_resource", formData);

      if (result.status === "success") {
        show("Resource uploaded successfully!", "success");
        
        // Backend se return hui list ko table state mein set kardo
        setUploadedResources(result.resources);
        
        // Input fields reset kar do
        setResourceFileData(null);
        setResourceFile(null);
        setResourceDescription("");
      } else {
        show(result.message || "Unable to upload the resource.", "error");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      show("Failed to connect to the backend server.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = (id) => {
    show(`Delete API needs to be connected for ID: ${id}.`, "info");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-15 py-6 flex flex-col gap-6">
      
      {/* ================= SEARCH ROW WITH AUTO-SUGGEST ================= */}
      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        <div className="flex items-center gap-3 flex-1 max-w-md h-11 bg-white border border-[#EBEBEB] rounded-full px-4 relative">
          <Search size={17} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
            placeholder="Search Campaign to add Resources...."
            className="flex-1 min-w-0 bg-transparent outline-none border-none text-[13px] text-gray-700 placeholder:text-gray-400"
          />
          {campaignId && selectedCampaignName === searchQuery && (
             <CheckCircle2 size={17} className="text-[#00A292] shrink-0" />
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-12 left-0 w-full max-w-md bg-white border border-[#EBEBEB] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {suggestions.map((camp) => (
              <div
                key={camp.id}
                onMouseDown={() => handleSelectCampaign(camp.id, camp.campaign_name)}
                className="px-4 py-3 text-[13px] text-gray-700 hover:bg-[#F5F6F7] hover:text-[#00A292] cursor-pointer border-b border-[#EBEBEB] last:border-none transition-colors"
              >
                {camp.campaign_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {!campaignId && (
        <div className="bg-amber-50 text-amber-600 border border-amber-200 text-[13px] px-4 py-3 rounded-lg">
          Please search and select a campaign above before adding resources.
        </div>
      )}
      {/* ============================================================== */}

      {/* Upload / Description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <FormCard title="Upload Resource Files">
          <FileUploadField
            fileName={resourceFile}
            onChange={handleFileChange}
            accept=".csv,.xlsx"
            hint="Only CSV and XLSX files allowed (Max 20MB)"
          />
        </FormCard>

        <FormCard title="Resource Description">
          <div className="flex flex-col gap-2">
            <TextAreaField
              placeholder="Describe the resources"
              value={resourceDescription}
              onChange={(e) => setResourceDescription(e.target.value)}
            />
            <p className="text-[11px] text-gray-400">
              Optional: Provide a description of the uploaded resources
            </p>
          </div>
        </FormCard>
      </div>

      {/* Uploaded Resources Table */}
      <FormCard title="Uploaded Resources">
        <div className="rounded-lg border border-[#EBEBEB] overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr] bg-[#F5F6F7] px-4 py-2.5 text-[12px] font-medium text-gray-500">
            <span>File Name</span>
            <span>Type</span>
            <span>Description</span>
            <span>Updated At</span>
            <span>Actions</span>
          </div>

          {uploadedResources.length === 0 ? (
            <div className="py-10 text-center text-[14px] text-[#111]">
              No resources uploaded yet.
            </div>
          ) : (
            uploadedResources.map((resource) => (
              <div
                key={resource.id}
                className="grid grid-cols-[2fr_1fr_2fr_1fr_1fr] items-center px-4 py-3 text-[13px] text-gray-700 border-t border-[#EBEBEB]"
              >
                <span className="truncate">{resource.original_file_name}</span>
                <span>{resource.file_type}</span>
                <span className="truncate">{resource.description || "-"}</span>
                <span>{new Date(resource.uploaded_at).toLocaleDateString()}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(resource.id)}
                  className="text-red-500 hover:text-red-600 text-[12px] font-medium w-fit"
                >
                  Remove
                </button>
              </div>
            ))
          )}
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
          onClick={handleUpdateResources}
          disabled={isLoading}
          className={`text-[14px] font-medium text-white rounded-md px-6 py-2.5 transition-colors ${
            isLoading ? "bg-[#00A292]/70 cursor-not-allowed" : "bg-[#00A292] hover:bg-[#008F81] cursor-pointer"
          }`}
        >
          {isLoading ? "Updating..." : "Update Resources"}
        </button>
      </div>
    </div>
  );
}