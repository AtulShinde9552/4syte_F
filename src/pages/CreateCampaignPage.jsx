import { useState } from "react";
import { useOutletContext } from "react-router-dom"; // Naya import
import CampaignTabsBar from "../components/CampaignTabsBar";
import OverviewTab from "./campaign-tabs/OverviewTab";
import CriteriaTab from "./campaign-tabs/CriteriaTab";
import ResourcesTab from "./campaign-tabs/ResourcesTab";
import DeliveryTemplateTab from "./campaign-tabs/DeliveryTemplateTab";
import ExclusionTab from "./campaign-tabs/ExclusionTab";
import LeadsTab from "./campaign-tabs/LeadsTab";

export default function CreateCampaignPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [campaignId, setCampaignId] = useState(null);

  // 1. Context se selectedClient nikalo
  const outletContext = useOutletContext() || {};
  const selectedClient = outletContext.selectedClient;

  // 2. Target Client ID nikalne ka smart logic
  let targetClientId = "";
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser.role === "client") {
      targetClientId = storedUser.id; // Client khud
    } else if (storedUser.role === "org" && selectedClient) {
      targetClientId = selectedClient.id; // Dropdown wala selected client
    }
  } catch (e) {
    console.error(e);
  }

  const handleCampaignCreated = (id) => {
    setCampaignId(id);
    setActiveTab("Criteria");
  };

  return (
    <div className="h-full min-h-0 flex flex-col bg-white rounded-[20px] sm:rounded-[30px] shadow-[0_4px_25px_rgba(0,0,0,0.04)] overflow-y-auto">
      <div className="shrink-0 px-4 sm:px-6 lg:px-15 pt-4 flex flex-col gap-4 ">
        <CampaignTabsBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tabs rendering with targetClientId Prop passed to OverviewTab */}
      {activeTab === "Overview" ? (
        <OverviewTab 
          onCampaignCreated={handleCampaignCreated} 
          targetClientId={targetClientId} // <--- YAHAN PASS KIYA HAI
        />
      ) : activeTab === "Criteria" ? (
        <CriteriaTab campaignId={campaignId} setCampaignId={setCampaignId} />
      ) : activeTab === "Resources" ? (
        <ResourcesTab campaignId={campaignId} setCampaignId={setCampaignId} />
      ) : activeTab === "Delivery Template" ? (
        <DeliveryTemplateTab campaignId={campaignId} setCampaignId={setCampaignId}/>
      ) : activeTab === "Exclusion" ? (
        <ExclusionTab campaignId={campaignId} setCampaignId={setCampaignId}/>
      ) : activeTab === "Leads" ? (
        <LeadsTab campaignId={campaignId} setCampaignId={setCampaignId}/>
      ) : (
        <div className="flex-1 min-h-0 flex items-center justify-center px-10 py-16">
          <p className="text-[16px] text-gray-400">{activeTab} — coming soon</p>
        </div>
      )}
    </div>
  );
}