import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import CampaignTabsBar from "../components/CampaignTabsBar";
import OverviewDetailTab from "./campaign-tabs/OverviewDetailTab";
import CriteriaDetailTab from "./campaign-tabs/CriteriaDetailTab";
import ResourcesDetailTab from "./campaign-tabs/ResourcesDetailTab";
import DeliveryTemplateDetailTab from "./campaign-tabs/DeliveryTemplateDetailTab";
import ExclusionDetailTab from "./campaign-tabs/ExclusionDetailTab";
import LeadsDetailTab from "./campaign-tabs/LeadsDetailTab";
import { get, post } from "../api";
import { usePopup } from "../components/Popup";

export default function OrgCampaignDetailPage() {
  const { show } = usePopup();
  const { id } = useParams(); // URL se campaign ID milegi (jaise /org/campaigns/1)
  const [activeTab, setActiveTab] = useState("Overview");
const [templates, setTemplates] = useState([]);
  const [templateFields, setTemplateFields] = useState([]);
  // Dynamic Data States
  const [campaign, setCampaign] = useState(null);
  const [criteria, setCriteria] = useState(null);
  const [resources, setResources] = useState([]);
  const [exclusions, setExclusions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCampaignDetails = useCallback(async () => {
    try {
      const result = await get(`/campaign/get_detail/${id}`);

      if (result.status === "success") {
        const camp = result.data.campaign;
        
        // Database ke fields ko UI mapping ke hisaab se format karna
        setCampaign({
          id: camp.id,
          name: camp.campaign_name,
          shortName: camp.campaign_name.length > 30 ? camp.campaign_name.substring(0, 30) + "...." : camp.campaign_name,
          startDate: camp.start_date,
          endDate: camp.end_date,
          owner: camp.owner_name,
          productLine: camp.product_line || "N/A",
          maxCompany: camp.max_leads_per_company || 0,
          daysLeft: Math.max(0, Math.ceil((new Date(camp.end_date) - new Date()) / (1000 * 60 * 60 * 24))), // Dynamic days left calculation
          leadsAllocated: camp.quality_allocated,
          marketingChannel: camp.marketing_channel,
          description: camp.description,
          deliveryCadence: camp.delivery_cadence,
          pacing: camp.pacing || "N/A",
        });

        setCriteria(result.data.criteria);
        setResources(result.data.resources || []);
        setTemplates(result.data.templates || []);
        setExclusions(result.data.exclusions || []);
        setTemplateFields(result.data.templateFields || []);
      } else {
        show("Failed to load campaign details.", "error");
      }
    } catch (error) {
      console.error("Error fetching campaign details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id, show]);

  // Component load hone par API call karo
  useEffect(() => {
    // The initial API synchronization intentionally updates the page state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCampaignDetails();
  }, [fetchCampaignDetails]);

  const saveOverview = async (values) => {
    const formData = new FormData();
    formData.append("campaign_id", campaign.id);

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    const result = await post(`/campaign/update_overview/${campaign.id}`, formData);

    if (result.status !== "success") {
      throw new Error(result.message || "Unable to update campaign overview.");
    }

    await fetchCampaignDetails();
  };

  const saveCriteria = async (values) => {
    const formData = new FormData();
    formData.append("campaign_id", campaign.id);

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    const result = await post("/campaign/update_criteria", formData);

    if (result.status !== "success") {
      throw new Error(result.message || "Unable to update campaign criteria.");
    }

    await fetchCampaignDetails();
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-[30px]">
        <p className="text-[18px] text-gray-500">Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-[30px]">
        <p className="text-[18px] text-red-500">Campaign not found.</p>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 flex flex-col bg-white rounded-[20px] sm:rounded-[30px] shadow-[0_4px_25px_rgba(0,0,0,0.04)] overflow-y-auto">
      <div className="shrink-0 px-4 sm:px-6 lg:px-15 pt-4 flex flex-col gap-4">
        <div className="shadow-sm rounded-2xl py-5 px-4 bg-[#00A292]/5 flex justify-between items-center">
          <span className="truncate">{campaign.shortName}</span>
          <div className="shrink-0 p-1 px-4 rounded-lg bg-white shadow-sm text-sm">
            ID : {campaign.id}
          </div>
        </div>

        <CampaignTabsBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {activeTab === "Overview" ? (
        <OverviewDetailTab campaign={campaign} onSave={saveOverview} />
      ) : activeTab === "Criteria" ? (
        <CriteriaDetailTab criteria={criteria} onSave={saveCriteria} />
      ) : activeTab === "Resources" ? (
        <ResourcesDetailTab resources={resources} />
      ) : activeTab === "Delivery Template" ? (
        <DeliveryTemplateDetailTab template={templates[0]} fields={templateFields} />
      ) : activeTab === "Exclusion" ? (
        <ExclusionDetailTab files={exclusions} />
      ) : activeTab === "Leads" ? (
       <LeadsDetailTab templates={templates} uploadHistory={[]} />
      ) : (
        <div className="flex-1 min-h-0 flex items-center justify-center px-10 py-16">
          <p className="text-[16px] text-gray-400">{activeTab} — coming soon</p>
        </div>
      )}
    </div>
  );
}