import { useState, useEffect, useRef } from "react";
import { Search, CheckCircle2 } from "lucide-react";
import FormCard from "../../components/form/FormCard";
import FileUploadField from "../../components/form/FileUploadField";
import TextAreaField from "../../components/form/TextAreaField";
import CheckboxOption from "../../components/form/CheckboxOption";

const inputClass =
  "w-full h-11 bg-[#F9FAFB] border border-[#EBEBEB] rounded-lg px-3 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#00A292] transition-colors";

// Props mein 'campaignId' aur 'onCriteriaSaved' pass karna zaroori hai
export default function CriteriaTab({ campaignId, onCriteriaSaved, setCampaignId }) {

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCampaignName, setSelectedCampaignName] = useState("");
  const dropdownRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  // File Objects (For Backend API) & File Names (For UI Display)
  const [targetAccountFileData, setTargetAccountFileData] = useState(null);
  const [targetAccountFile, setTargetAccountFile] = useState(null);
  const [targetAccountExact, setTargetAccountExact] = useState(false);

  const [jobTitleFileData, setJobTitleFileData] = useState(null);
  const [jobTitleFile, setJobTitleFile] = useState(null);
  const [manualJobTitles, setManualJobTitles] = useState("");
  const [jobTitleExact, setJobTitleExact] = useState(false);

  const [pacingFileData, setPacingFileData] = useState(null);
  const [pacingFile, setPacingFile] = useState(null);
  const [pacingExact, setPacingExact] = useState(false);
  const [pacingDescription, setPacingDescription] = useState("");

  // Other fields
  const [geography, setGeography] = useState("");
  const [geographyExact, setGeographyExact] = useState(false);

  const [industries, setIndustries] = useState("");
  const [industriesExact, setIndustriesExact] = useState(false);

  const [jobLevel, setJobLevel] = useState("");
  const [jobLevelExact, setJobLevelExact] = useState(false);

  const [companySize, setCompanySize] = useState("");
  const [companySizeExact, setCompanySizeExact] = useState(false);

  const [customQuestions, setCustomQuestions] = useState("");
  const [customQuestionsExact, setCustomQuestionsExact] = useState(false);

  const [criteriaInstructions, setCriteriaInstructions] = useState("");
  
  const [criteriaCsvFileData, setCriteriaCsvFileData] = useState(null);
  const [criteriaCsvFile, setCriteriaCsvFile] = useState(null);

  // Form ke saare fields ko clear karne ka function
  const resetForm = () => {
    // 1. Search & Campaign Selection Reset
    if (typeof setCampaignId === 'function') setCampaignId(null);
    setSearchQuery("");
    setSelectedCampaignName("");
    setSuggestions([]);

    // 2. File Objects & File Names Reset
    setTargetAccountFileData(null); setTargetAccountFile(null);
    setJobTitleFileData(null); setJobTitleFile(null);
    setPacingFileData(null); setPacingFile(null);
    setCriteriaCsvFileData(null); setCriteriaCsvFile(null);

    // 3. Text Inputs Reset
    setManualJobTitles("");
    setPacingDescription("");
    setGeography("");
    setIndustries("");
    setJobLevel("");
    setCompanySize("");
    setCustomQuestions("");
    setCriteriaInstructions("");

    // 4. Checkboxes Reset
    setTargetAccountExact(false);
    setJobTitleExact(false);
    setPacingExact(false);
    setGeographyExact(false);
    setIndustriesExact(false);
    setJobLevelExact(false);
    setCompanySizeExact(false);
    setCustomQuestionsExact(false);
  };


const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Agar input clear kar diya, to sab reset kar do
    if (value === "") {
      if (typeof setCampaignId === 'function') setCampaignId(null);
      setSelectedCampaignName("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // 2. Debounce API Call (Typing rukne ke 500ms baad call hogi)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // API tabhi hit hogi jab 2+ characters honge aur query selected naam jaisi na ho
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


  const handleFile = (setFileObj, setFileName) => (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileObj(file);
      setFileName(file.name);
    } else {
      setFileObj(null);
      setFileName(null);
    }
  };

  // API Submission Logic
  const handleSaveCriteria = async () => {
    // Validation: Ensure campaign overview is created first
    if (!campaignId) {
      alert("Please create the Campaign Overview first!");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("campaign_id", campaignId);

    // Text Fields
    formData.append("manualJobTitles", manualJobTitles);
    formData.append("pacingDescription", pacingDescription);
    formData.append("geography", geography);
    formData.append("industries", industries);
    formData.append("jobLevel", jobLevel);
    formData.append("companySize", companySize);
    formData.append("customQuestions", customQuestions);
    formData.append("criteriaInstructions", criteriaInstructions);

    // Checkboxes (Boolean sent as true/false string)
    formData.append("targetAccountExact", targetAccountExact);
    formData.append("jobTitleExact", jobTitleExact);
    formData.append("pacingExact", pacingExact);
    formData.append("geographyExact", geographyExact);
    formData.append("industriesExact", industriesExact);
    formData.append("jobLevelExact", jobLevelExact);
    formData.append("companySizeExact", companySizeExact);
    formData.append("customQuestionsExact", customQuestionsExact);

    // Append Actual File Objects
    if (targetAccountFileData) formData.append("targetAccountFile", targetAccountFileData);
    if (jobTitleFileData) formData.append("jobTitleFile", jobTitleFileData);
    if (pacingFileData) formData.append("pacingFile", pacingFileData);
    if (criteriaCsvFileData) formData.append("criteriaCsvFile", criteriaCsvFileData);

    try {
      const response = await fetch("http://localhost/clientportal/campaign/save_criteria", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Criteria saved successfully!");
      resetForm();
        
        if (onCriteriaSaved) onCriteriaSaved(); 
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to connect to the backend server.");
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
            placeholder="Search Campaign to add Criteria...."
            className="flex-1 min-w-0 bg-transparent outline-none border-none text-[13px] text-gray-700 placeholder:text-gray-400"
          />
          {/* Show checkmark if campaign is selected */}
          {campaignId && selectedCampaignName === searchQuery && (
             <CheckCircle2 size={17} className="text-[#00A292] shrink-0" />
          )}
        </div>

        {/* Dropdown Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-12 left-0 w-full max-w-md bg-white border border-[#EBEBEB] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {suggestions.map((camp) => (
              <div
                key={camp.id}
                // YAHAN CHANGE KIYA HAI: onClick ki jagah onMouseDown
                onMouseDown={() => handleSelectCampaign(camp.id, camp.campaign_name)}
                className="px-4 py-3 text-[13px] text-gray-700 hover:bg-[#F5F6F7] hover:text-[#00A292] cursor-pointer border-b border-[#EBEBEB] last:border-none transition-colors"
              >
                {camp.campaign_name}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* ============================================================== */}

      {/* Agar campaign selected nahi hai, toh ek warning alert dikha sakte ho */}
      {!campaignId && (
        <div className="bg-amber-50 text-amber-600 border border-amber-200 text-[13px] px-4 py-3 rounded-lg">
          Please search and select a campaign above before adding criteria.
        </div>
      )}

      {/* Row 1: Target Account List / Job Title Criteria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <FormCard title="Upload Target Account List (CSV / XLSX)">
          <div className="flex flex-col gap-4">
            <FileUploadField
              fileName={targetAccountFile}
              onChange={handleFile(setTargetAccountFileData, setTargetAccountFile)}
              hint="Optional: Upload multiple CSV or XLSX files for Target Account List (Max 10MB each)"
            />
            <CheckboxOption
              label="Target Account are exact match"
              description="If checked, only leads from these accounts will be accepted."
              checked={targetAccountExact}
              onChange={setTargetAccountExact}
            />
          </div>
        </FormCard>

        <FormCard title="Job Title Criteria">
          <div className="flex flex-col gap-4">
            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-0">
              <div className="flex flex-col gap-2 sm:pr-6">
                <p className="text-[13px] font-semibold text-[#111]">
                  Upload Job Title List (CSV/XLSX)
                </p>
                <FileUploadField
                  fileName={jobTitleFile}
                  onChange={handleFile(setJobTitleFileData, setJobTitleFile)}
                  hint="Optional: Upload multiple CSV or XLSX files for Target Account List (Max 10MB each)"
                />
              </div>

              {/* Divider + "Or" badge */}
              <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-px bg-[#EBEBEB] -translate-x-1/2" />
              <div className="hidden sm:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-[#EBEBEB] bg-white text-[11px] text-gray-500 shadow-sm">
                Or
              </div>

              <div className="flex flex-col gap-2 sm:pl-6">
                <p className="text-[13px] font-semibold text-[#111]">
                  Manually Enter Job Titles
                </p>
                <TextAreaField
                  placeholder="Enter Job Titles (One per line or comma-separated)"
                  value={manualJobTitles}
                  onChange={(e) => setManualJobTitles(e.target.value)}
                />
                <p className="text-[11px] text-gray-400">
                  Optional: Enter job titles manually.
                </p>
              </div>
            </div>

            <CheckboxOption
              label="Job Title are exact match"
              description="If checked, leads will ONLY be accepted if their job title exactly matches an entry from the file or the manual list."
              checked={jobTitleExact}
              onChange={setJobTitleExact}
            />
          </div>
        </FormCard>
      </div>

      {/* Row 2: Pacing File / Pacing Description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <FormCard title="Upload Pacing File (CSV or XLSX, Optional)">
          <div className="flex flex-col gap-4">
            <FileUploadField
              fileName={pacingFile}
              onChange={handleFile(setPacingFileData, setPacingFile)}
              hint="Optional: Upload a CSV or XLSX files for pacing data (Max 10MB)"
            />
            <CheckboxOption
              label="Target Account are exact match"
              description="If checked, only leads from these accounts will be accepted."
              checked={pacingExact}
              onChange={setPacingExact}
            />
          </div>
        </FormCard>

        <FormCard title="Pacing file Description">
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold text-[#111]">
              Manually Enter Job Titles
            </p>
            <TextAreaField
              placeholder="Enter description for the pacing file"
              value={pacingDescription}
              onChange={(e) => setPacingDescription(e.target.value)}
            />
            <p className="text-[11px] text-gray-400">
              Optional: Provide a description for the pacing file
            </p>
          </div>
        </FormCard>
      </div>

      {/* Row 3: Geography / Industries / Job-Level */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <FormCard title="Geography">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={geography}
              onChange={(e) => setGeography(e.target.value)}
              className={inputClass}
            />
            <p className="text-[11px] text-gray-400">
              Specify the target geographic regions (e.g., North America, EU)
            </p>
            <CheckboxOption
              label="Geography are exact match"
              description="If checked, only leads from these regions will be accepted."
              checked={geographyExact}
              onChange={setGeographyExact}
            />
          </div>
        </FormCard>

        <FormCard title="Industries">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={industries}
              onChange={(e) => setIndustries(e.target.value)}
              className={inputClass}
            />
            <p className="text-[11px] text-gray-400">
              List target industries (e.g., Technology, Healthcare)
            </p>
            <CheckboxOption
              label="Industry are exact match"
              description="If checked, only leads from these industries will be accepted."
              checked={industriesExact}
              onChange={setIndustriesExact}
            />
          </div>
        </FormCard>

        <FormCard title="Job-Level">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={jobLevel}
              onChange={(e) => setJobLevel(e.target.value)}
              className={inputClass}
            />
            <p className="text-[11px] text-gray-400">
              Specify target job levels (e.g., C-Level, Manager)
            </p>
            <CheckboxOption
              label="Job Level are exact match"
              description="If checked, only leads from these job levels will be accepted."
              checked={jobLevelExact}
              onChange={setJobLevelExact}
            />
          </div>
        </FormCard>
      </div>

      {/* Row 4: Company Size / Custom Questions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <FormCard title="Company Size">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className={inputClass}
            />
            <p className="text-[11px] text-gray-400">
              Specify target company size (e.g., 50-200 employees)
            </p>
            <CheckboxOption
              label="Company Size are exact match"
              description="If checked, only leads from this size range will be accepted."
              checked={companySizeExact}
              onChange={setCompanySizeExact}
            />
          </div>
        </FormCard>

        <div className="sm:col-span-2">
          <FormCard title="Custom Questions">
            <div className="flex flex-col gap-2">
              <TextAreaField
                placeholder=""
                value={customQuestions}
                onChange={(e) => setCustomQuestions(e.target.value)}
              />
              <p className="text-[11px] text-gray-400">
                Optional: Add any custom questions for this campaign
              </p>
              <CheckboxOption
                label="Custom Question are exact match"
                description="If checked, only leads that meet custom question criteria will be accepted."
                checked={customQuestionsExact}
                onChange={setCustomQuestionsExact}
              />
            </div>
          </FormCard>
        </div>
      </div>

      {/* Row 5: Instructions / Upload CSV File (Criteria) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <FormCard title="Criteria & Execution Specific Instructions">
          <div className="flex flex-col gap-2">
            <TextAreaField
              placeholder="Enter specific criteria and execution instruction"
              value={criteriaInstructions}
              onChange={(e) => setCriteriaInstructions(e.target.value)}
            />
            <p className="text-[11px] text-gray-400">
              Provide detailed criteria and instructions for campaign execution
            </p>
          </div>
        </FormCard>

        <FormCard title="Upload CSV File (Criteria)">
          <FileUploadField
            fileName={criteriaCsvFile}
            onChange={handleFile(setCriteriaCsvFileData, setCriteriaCsvFile)}
            hint="Optional: Upload CSV file (Max 10MB each)"
          />
        </FormCard>
      </div>

      {/* Save Criteria */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSaveCriteria}
          disabled={isLoading}
          className={`text-[14px] font-medium text-white rounded-md px-8 py-2.5 transition-colors ${
            isLoading ? "bg-[#00A292]/70 cursor-not-allowed" : "bg-[#00A292] hover:bg-[#008F81] cursor-pointer"
          }`}
        >
          {isLoading ? "Saving..." : "Save Criteria"}
        </button>
      </div>
    </div>
  );
}