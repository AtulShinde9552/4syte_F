import { useMemo, useState, useEffect } from "react";
import { Plus, Rocket } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";

import SearchText from "../components/SearchText";
import GenericTable from "../components/GenericTable";
import Pagination from "../components/Pagination";

export default function OrgCampaignListPage() {
  const { selectedClient } = useOutletContext();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const rowsPerPage = 10;

  // --- Dynamic States ---
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Jab bhi selectedClient change ho, tab data fetch karo
  useEffect(() => {
    // Agar selectedClient nahi hai (jaise shuru mein), toh fetch mat karo
    if (selectedClient && selectedClient.id) {
      fetchCampaignList(selectedClient.id);
    } else {
      setCampaigns([]); // Client selected nahi hai toh table khali kar do
    }
  }, [selectedClient]);

  const fetchCampaignList = async (clientId) => {
    setIsLoading(true);
    try {
      // Yahan humne GET request mein client_id parameter bheja hai
      const response = await fetch(`http://localhost/clientportal/campaign/get_list?client_id=${clientId}`);
      const result = await response.json();

      if (result.status === "success") {
        const formattedData = result.data.map(camp => {
          // DATABASE KEYS USE KAR RAHE HAIN YAHAN:
          const allocation = parseInt(camp.quality_allocated) || 0;
          // Asli total leads database join query se aa raha hai
          const totalLeads = parseInt(camp.total_leads) || 0; 
          
          // Progress Calculation
          const progress = allocation > 0 
            ? Math.min(100, Math.round((totalLeads / allocation) * 100)) 
            : 0;

          return {
            id: camp.id,
            name: camp.campaign_name, // DATABASE KEY: campaign_name
            allocation: allocation,
            totalLeads: totalLeads,
            progress: progress,
            // DATABASE KEYS: start_date, end_date
            startDate: camp.start_date ? new Date(camp.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
            endDate: camp.end_date ? new Date(camp.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
          };
        });
        
        setCampaigns(formattedData);
      } else {
        setCampaigns([]);
      }
    } catch (error) {
      console.error("Error fetching campaign list:", error);
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCampaigns = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    if (!searchValue) return campaigns;
    return campaigns.filter((campaign) =>
      campaign.name.toLowerCase().includes(searchValue),
    );
  }, [search, campaigns]);

  const totalPages = Math.ceil(filteredCampaigns.length / rowsPerPage);

  const paginatedCampaigns = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredCampaigns.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredCampaigns, currentPage]);

  const columns = [
    {
      key: "name",
      header: "Campaign name",
      width: "250px",
      headerAlign: "center",
      align: "center",
      render: (campaign) => (
        <span
          className="block truncate text-[15px] text-[#111]"
          title={campaign.name}
        >
          {campaign.name}
        </span>
      ),
    },
    {
      key: "allocation",
      header: "Allocation",
      width: "150px",
      headerAlign: "center",
      align: "center",
      render: (campaign) => <span>{campaign.allocation}</span>,
    },
    {
      key: "totalLeads",
      header: "Total Leads",
      width: "150px",
      headerAlign: "center",
      align: "center",
      render: (campaign) => <span>{campaign.totalLeads}</span>,
    },
    {
      key: "startDate",
      header: "Start Date",
      width: "150px",
      headerAlign: "center",
      align: "center",
      render: (campaign) => <span>{campaign.startDate}</span>,
    },
    {
      key: "endDate",
      header: "End Date",
      width: "150px",
      headerAlign: "center",
      align: "center",
      render: (campaign) => <span>{campaign.endDate}</span>,
    },
    {
      key: "progress",
      header: "Progress",
      width: "180px",
      headerAlign: "center",
      align: "left",
      render: (campaign) => (
        <div className="flex items-center justify-center gap-2">
          <div className="w-[85px] h-[8px] rounded-full bg-[#E5E5E5] overflow-hidden shrink-0">
            <div
              className="h-full rounded-full bg-[#00A292]"
              style={{
                width: `${campaign.progress}%`,
              }}
            />
          </div>

          <span className="text-xs text-gray-700">{campaign.progress}%</span>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      width: "100px",
      headerAlign: "left",
      align: "left",
      render: (campaign) => (
        <button
          type="button"
          onClick={() => navigate(`/org/campaigns/${campaign.id}`)}
          className="
          text-[#00A292]
          text-[15px]
          underline
          underline-offset-2
          hover:text-[#008F81]
          transition-colors
          cursor-pointer
        "
        >
          View
        </button>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div className="h-full min-h-0 flex flex-col bg-white rounded-[20px] sm:rounded-[30px] shadow-[0_4px_25px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 lg:px-10 pt-5 sm:pt-7 pb-4 sm:pb-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-[18px] sm:text-[22px] lg:text-[26px] font-medium text-[#00A292] whitespace-nowrap">
            Campaign List
          </h1>
          <span className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#00A292] flex items-center justify-center shrink-0">
            <Rocket
              size={14}
              className="sm:size-[17px]"
              color="white"
              fill="white"
            />
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {selectedClient && (
            <SearchText
              value={search}
              onChange={handleSearch}
              placeholder="SEARCH CAMPAIGN"
            />
          )}
          <button
            type="button"
            disabled={!selectedClient}
            onClick={() =>
              navigate("/org/create-campaign", { state: { selectedClient } })
            }
            className={`flex items-center gap-1.5 text-[14px] font-medium rounded-md px-5 py-2.5 whitespace-nowrap transition-colors ${
              selectedClient
                ? "bg-[#00A292] text-white hover:bg-[#008F81] cursor-pointer"
                : "bg-[#00A292]/30 text-white/70 cursor-not-allowed"
            }`}
          >
            Create Campaign
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      {selectedClient ? (
        <div className="flex-1 min-h-0 flex flex-col px-4 sm:px-6 lg:px-10">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading Campaigns...
            </div>
          ) : (
            <>
              <GenericTable
                columns={columns}
                data={paginatedCampaigns}
                rowKey="id"
                emptyMessage={`No campaigns found for ${selectedClient.company_name || 'Client'}`}
              />
              {paginatedCampaigns.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <p className="text-[20px] text-gray-500">Please select a client from the top bar</p>
        </div>
      )}
    </div>
  );
}