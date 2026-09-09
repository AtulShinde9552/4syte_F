import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Info, CheckCircle2 } from "lucide-react";
import FormCard from "../../components/form/FormCard";
import FileUploadField from "../../components/form/FileUploadField";

const exclusionFileTypes = [
  {
    title: "Normal Email Files:",
    description: "Use these headers for normal email addresses:",
    tags: ["email", "e-mail", "mail", "email_id", "email_address"],
  },
  {
    title: "Hashed Email Files:",
    description: "Use these headers for hashed email addresses:",
    tags: ["hashed_email", "hashed", "md5", "sha1", "sha256", "md5_hash", "sha1_hash"],
  },
  {
    title: "Domain Files:",
    description: "Use these headers for domain exclusion:",
    tags: ["domain", "website", "url", "web_address"],
  },
  {
    title: "Company Files:",
    description: "Use these headers for company exclusion:",
    tags: ["company", "company_name", "organization", "business", "enterprise"],
  },
];

const importantNotes = [
  "Files with additional columns may cause validation issues",
  <>The maximum allowed records per file is <strong>30,000</strong></>,
  "If your file exceeds this limit, please split it into smaller files before uploading",
  "File type will be automatically detected based on headers and content",
  <>Supported file formats: <strong>CSV, XLSX</strong></>,
];

export default function ExclusionTab({ campaignId, setCampaignId }) {
  const navigate = useNavigate();

  // --- Auto Suggest States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCampaignName, setSelectedCampaignName] = useState("");
  const dropdownRef = useRef(null);

  // --- File & API States ---
  const [exclusionFileData, setExclusionFileData] = useState(null); // Actual File Object
  const [exclusionFileName, setExclusionFileName] = useState(null); // File Name for UI
  const [isLoading, setIsLoading] = useState(false);

  // ==========================================
  // SEARCH & AUTO-SUGGEST LOGIC
  // ==========================================
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
        try {
          const response = await fetch(`http://localhost/clientportal/campaign/search?q=${searchQuery}`);
          const result = await response.json();
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
  }, [searchQuery, selectedCampaignName]);

  const handleSelectCampaign = (id, name) => {
    if (typeof setCampaignId === 'function') setCampaignId(id);
    setSelectedCampaignName(name);
    setSearchQuery(name);
    setShowSuggestions(false);
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
      setExclusionFileData(file);
      setExclusionFileName(file.name);
    } else {
      setExclusionFileData(null);
      setExclusionFileName(null);
    }
  };

  const handleUpdateExclusionList = async () => {
    if (!campaignId) {
      alert("Please search and select a Campaign first!");
      return;
    }
    if (!exclusionFileData) {
      alert("Please select an exclusion file to upload.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("campaign_id", campaignId);
    formData.append("exclusion_file", exclusionFileData);

    try {
      // API call for large file upload
      const response = await fetch("http://localhost/clientportal/campaign/save_exclusion", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Exclusion file uploaded successfully!");
        
        // Reset file input after successful upload
        setExclusionFileData(null);
        setExclusionFileName(null);
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to connect to the backend server. The file might be too large.");
    } finally {
      setIsLoading(false);
    }
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
            placeholder="Search Campaign to add Exclusion List...."
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
          Please search and select a campaign above before adding an exclusion list.
        </div>
      )}
      {/* ============================================================== */}

      {/* Exclusion File Requirements */}
      <div className="flex flex-col gap-4 px-1">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#2E7DD1] text-white shrink-0">
            <Info size={13} strokeWidth={2.5} />
          </span>
          <h3 className="text-[14px] font-semibold text-[#111]">
            Exclusion File Requirements
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8">
          {/* Left: file type sections */}
          <div className="flex flex-col gap-4">
            {exclusionFileTypes.map((section) => (
              <div key={section.title} className="flex flex-col gap-1">
                <p className="text-[13px] font-semibold text-[#2E7DD1]">
                  {section.title}
                </p>
                <p className="text-[12px] text-gray-600">{section.description}</p>
                <ul className="pl-4 list-disc marker:text-gray-400">
                  <li className="text-[12px] leading-relaxed">
                    {section.tags.map((tag, i) => (
                      <span key={tag}>
                        <span className="text-[#D64545] font-mono">{tag}</span>
                        {i < section.tags.length - 1 && (
                          <span className="text-gray-400">, </span>
                        )}
                      </span>
                    ))}
                  </li>
                </ul>
              </div>
            ))}
          </div>

          {/* Right: important notes */}
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold text-[#111]">Important Notes:</p>
            <ul className="pl-4 list-disc marker:text-gray-400 flex flex-col gap-1.5">
              {importantNotes.map((note, i) => (
                <li key={i} className="text-[12px] text-gray-600 leading-relaxed">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Upload */}
      <FormCard title="Upload Exclusion File (CSV or XLSX)">
        <FileUploadField
          fileName={exclusionFileName}
          onChange={handleFileChange}
          accept=".csv,.xlsx"
          hint="Upload CSV or XLSX files (Large files supported)"
        />
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
          onClick={handleUpdateExclusionList}
          disabled={isLoading}
          className={`text-[14px] font-medium text-white rounded-md px-6 py-2.5 transition-colors ${
            isLoading ? "bg-[#00A292]/70 cursor-not-allowed" : "bg-[#00A292] hover:bg-[#008F81] cursor-pointer"
          }`}
        >
          {isLoading ? "Uploading Large File..." : "Update Exclusion List"}
        </button>
      </div>
    </div>
  );
}