import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import CampaignSectionTitle from "../components/Campaign/CampaignSectionTitle";
import ProgressBar from "../components/Campaign/ProgressBar";
import RegionChart from "../components/Campaign/RegionChart";
import { ArrowLeft } from "lucide-react";
import { get } from "../api";

export default function CampaignDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [stats, setStats] = useState({
    region: [],
    industries: [],
    employeeSize: [],
    assets: []
  });
  
  // NEW: State to hold the dynamic campaign name
  const [campaignName, setCampaignName] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Campaign Stats
        // Note: Removed index.php to match your other API calls, add it back if your server strictly requires it
        const statsResult = await get(`/leads/get_campaign_stats/${id}`);
        
        if (statsResult.status === "success") {
          setStats(statsResult.data); 
        }

        // 2. Fetch Campaign Details to get the Dynamic Name
        const detailResult = await get(`/campaign/get_detail/${id}`);
        
        if (detailResult.status === "success" && detailResult.data.campaign) {
          setCampaignName(detailResult.data.campaign.campaign_name);
        } else {
          setCampaignName("Unknown Campaign");
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setCampaignName("Campaign Details Unavailable");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCampaignData();
    }
  }, [id]);

  if (isLoading) {
    return <div className="h-full flex items-center justify-center text-gray-500">Loading campaign data...</div>;
  }

  return (
    <div className="h-full min-h-0 flex flex-col bg-white rounded-[20px] sm:rounded-[26px] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="h-[60px] sm:h-[74px] min-h-[60px] sm:min-h-[74px] shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-11 bg-white/35 backdrop-blur-[20px] backdrop-saturate-[100%] border-b border-white/60 shadow-[0_4px_25px_rgba(0,0,0,0.04)]">
        
        {/* UPDATED: Renders the dynamic campaign name from state */}
        <h1 className="text-[15px] sm:text-[18px] lg:text-[20px] font-medium text-[#111] truncate">
          {campaignName}
        </h1>
        
        <button
          type="button"
          onClick={() => navigate(-1)} // Navigates back automatically based on history
          className=" flex items-center gap-2 text-[#00A292] text-[13px] sm:text-[15px] lg:text-[18px] hover:text-[#008F81] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
         <ArrowLeft size={16} /> <div>Back</div>
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden shadow-md px-4 sm:px-6 lg:px-11 py-6 sm:py-8 lg:py-11">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 lg:gap-x-11 gap-y-8 sm:gap-y-12 lg:gap-y-20">

          <section>
            <CampaignSectionTitle>Region</CampaignSectionTitle>
            <div className="mt-4 h-[240px] sm:h-[290px] rounded-[18px] bg-white border border-white/60 shadow-[0_4px_25px_rgba(0,0,0,0.04)] px-4 sm:px-7 py-4 overflow-hidden">
              <RegionChart data={stats.region} />
            </div>
          </section>

          <section>
            <CampaignSectionTitle>Industries</CampaignSectionTitle>
            <div className="mt-4 h-[240px] sm:h-[290px] rounded-[18px] bg-white border border-white/60 shadow-[0_4px_25px_rgba(0,0,0,0.04)] px-4 sm:px-7 py-4 flex flex-col min-h-0 overflow-hidden">
              <div className="flex justify-between mb-4 sm:mb-7 shrink-0">
                <p className="text-[12px] sm:text-[13px] text-gray-500">Top 5 Industries by lead count</p>
                <p className="text-[12px] sm:text-[13px] text-gray-500">No. of leads</p>
              </div>
              <div className="flex flex-col gap-3 sm:gap-[17px] overflow-y-auto scrollbar-hide min-h-0 pr-1">
                {stats.industries.map((industry, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[110px_1fr_50px] sm:grid-cols-[175px_1fr_70px] items-center gap-2 sm:gap-3 shrink-0"
                  >
                    <span className="text-[12px] sm:text-[13px] text-[#111] truncate">{industry.label}</span>
                    <ProgressBar value={industry.percent} />
                    <span className="text-right text-[14px] sm:text-[16px] text-[#111]">{industry.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <CampaignSectionTitle>Employee Size</CampaignSectionTitle>
            <div className="mt-4 h-[220px] sm:h-[270px] rounded-[18px] bg-white border border-white/60 shadow-[0_4px_25px_rgba(0,0,0,0.04)] px-4 sm:px-7 py-4 flex flex-col min-h-0 overflow-hidden">
              <div className="flex justify-between mb-4 sm:mb-7 shrink-0">
                <p className="text-[12px] sm:text-[13px] text-gray-500">Leads by employees headcount</p>
                <p className="text-[12px] sm:text-[13px] text-gray-500">No. of leads</p>
              </div>
              <div className="flex flex-col gap-3 sm:gap-5 overflow-y-auto scrollbar-hide min-h-0 pr-1">
                {stats.employeeSize.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[100px_1fr_50px] sm:grid-cols-[150px_1fr_70px] items-center gap-2 sm:gap-3 shrink-0"
                  >
                    <span className="text-[12px] sm:text-[13px] text-[#111]">{item.label}</span>
                    <ProgressBar value={item.percent} />
                    <span className="text-right text-[14px] sm:text-[16px]">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <CampaignSectionTitle>Assets</CampaignSectionTitle>
            <div className="mt-4 h-[240px] sm:h-[290px] rounded-[18px] bg-white border border-white/60 px-3 sm:px-4 py-3 flex flex-col min-h-0 overflow-hidden">
              <div className="flex justify-between px-1 mb-3 sm:mb-4 shrink-0">
                <p className="text-[12px] sm:text-[13px] text-gray-500">Top performing content by leads</p>
                <p className="text-[12px] sm:text-[13px] text-gray-500">No. of leads</p>
              </div>
              <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide min-h-0">
                {stats.assets.map((asset, index) => (
                  <div
                    key={index}
                    className={`
                      grid grid-cols-[1fr_60px_50px] sm:grid-cols-[1fr_70px_60px] items-center gap-2 sm:gap-3
                      rounded-[10px] px-3 sm:px-4 py-2.5 sm:py-3 shrink-0
                      ${index === 0 ? "bg-[#F0FFFC]" : "bg-[#FAFAFA]"}
                    `}
                  >
                    <div className="min-w-0">
                      <p className="text-[12px] sm:text-[13px] text-[#111] truncate">{asset.name}</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 mt-1">{asset.subtitle}</p>
                    </div>
                    <span className="text-[13px] sm:text-[14px] font-medium text-[#00A292] text-center">
                      {asset.percent}%
                    </span>
                    <span className="text-[14px] sm:text-[16px] text-[#111] text-right">{asset.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}