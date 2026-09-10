import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "../../components/form/TextField";
import SelectField from "../../components/form/SelectField";
import FormCard from "../../components/form/FormCard";
import RadioGroup from "../../components/form/RadioGroup";
import TextAreaField from "../../components/form/TextAreaField";
import FileUploadField from "../../components/form/FileUploadField";
import { ArrowLeft } from "lucide-react";
import { post } from "../../api";
import { usePopup } from "../../components/Popup";

const marketingChannels = [
  "Email Marketing",
  "Social Media",
  "Tele Marketing",
  "SEO",
];

const cadenceOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const pacingOptions = [
  { value: "even", label: "Even" },
  { value: "front-loaded", label: "Front-loaded" },
];

// NAYA: Yahan 'targetClientId' ko receive kiya
export default function OverviewTab({ onCampaignCreated, targetClientId }) {
  const { show } = usePopup();
  const navigate = useNavigate();
  
  // Input states
  const [campaignName, setCampaignName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [productLine, setProductLine] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [qualityAllocated, setQualityAllocated] = useState("");
  const [deliveryCadence, setDeliveryCadence] = useState("");
  const [pacing, setPacing] = useState("");
  const [maxLeads, setMaxLeads] = useState("");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [description, setDescription] = useState("");
  
  // File states
  const [fileData, setFileData] = useState(null); 
  const [fileName, setFileName] = useState(null); 
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileData(file);
      setFileName(file.name);
    } else {
      setFileData(null);
      setFileName(null);
    }
  };

  const handleCreateCampaign = async () => {
    // Basic frontend validation
    if (!campaignName || !ownerName || !startDate || !endDate) {
      show("Please fill all required fields (Campaign Name, Owner Name, Dates).", "warning");
      return;
    }

    // NAYA: Strict Check for Client ID
    if (!targetClientId) {
      show("Client ID is missing. Please select a client first!", "warning");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    // NAYA: Client ID ko backend bhejne ke liye append kiya
    formData.append("client_id", targetClientId); 
    
    formData.append("campaignName", campaignName);
    formData.append("ownerName", ownerName);
    formData.append("productLine", productLine);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("qualityAllocated", qualityAllocated);
    formData.append("deliveryCadence", deliveryCadence);
    formData.append("pacing", pacing);
    formData.append("maxLeads", maxLeads);
    formData.append("marketingChannel", selectedChannel || "");
    formData.append("description", description);
    
    if (fileData) {
      formData.append("overview_file", fileData);
    }

    try {
      const result = await post("/campaign/create_overview", formData);

      if (result.status === "success") {
        onCampaignCreated(result.campaign_id);
      } else {
        show(result.message || "Unable to create the campaign overview.", "error");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      show("Failed to connect to the backend server.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-15 py-6 flex flex-col gap-6">
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <TextField
          label="Campaign Name"
          type="text"
          placeholder="Enter campaign name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />
        <TextField
          label="Campaign Owner Name"
          type="text"
          placeholder="Enter campaign Co-ordinator name"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
        />
        <TextField
          label="Campaign Product Line"
          type="text"
          placeholder="Specify the product line for this campaign"
          value={productLine}
          onChange={(e) => setProductLine(e.target.value)}
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <TextField 
          label="Start Date" 
          type="date" 
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="Quality Allocated"
          type="number"
          placeholder="Enter total number of leads to allocate"
          value={qualityAllocated}
          onChange={(e) => setQualityAllocated(e.target.value)}
        />
        <SelectField
          label="Delivery Cadence"
          placeholder="Select Cadence"
          options={cadenceOptions}
          value={deliveryCadence}
          onChange={(e) => setDeliveryCadence(e.target.value)}
        />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <TextField 
          label="End Date" 
          type="date" 
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <SelectField
          label="Pacing"
          placeholder="Select Pacing"
          options={pacingOptions}
          value={pacing}
          onChange={(e) => setPacing(e.target.value)}
        />
        <TextField
          label="Max Leads Per Company"
          type="number"
          placeholder="Enter Max Leads"
          value={maxLeads}
          onChange={(e) => setMaxLeads(e.target.value)}
        />
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <FormCard title="Marketing Channel">
          <RadioGroup
            name="marketingChannel"
            options={marketingChannels}
            value={selectedChannel}
            onChange={setSelectedChannel}
          />
        </FormCard>

        <FormCard title="Campaign Description">
          <TextAreaField
            placeholder="Describe the campaign"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormCard>

        <FormCard title="Upload CSV File (Overview)">
          <FileUploadField
            fileName={fileName}
            onChange={handleFileChange}
            hint="Optional: Upload CSV file (Max 10MB)"
          />
        </FormCard>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate(-1)} // Dynamically go back (works for both org & client)
          className="flex items-center gap-1.5 text-[14px] font-medium text-[#505050] border border-[#EBEBEB] bg-[#FAFAFA] rounded-md px-5 py-2.5 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCreateCampaign}
          disabled={isLoading}
          className={`text-[14px] font-medium text-white rounded-md px-6 py-2.5 transition-colors ${
            isLoading ? "bg-[#00A292]/70 cursor-not-allowed" : "bg-[#00A292] hover:bg-[#008F81] cursor-pointer"
          }`}
        >
          {isLoading ? "Saving..." : "Create Campaign"}
        </button>
      </div>
    </div>
  );
}