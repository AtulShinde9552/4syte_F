import { useMemo, useState, useEffect } from "react";
import { Rocket } from "lucide-react";
import SearchText from "../components/SearchText";
import GenericTable from "../components/GenericTable";
import Pagination from "../components/Pagination";
import { get } from "../api";
// Naya import: useOutletContext
import { useNavigate, useOutletContext } from "react-router-dom";

export default function CampaignListPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const rowsPerPage = 10;

  // Context se selectedClient nikaalo
  const outletContext = useOutletContext() || {};
  const selectedClient = outletContext.selectedClient;

  // Jab bhi selectedClient badle, data naya laao
  useEffect(() => {
    fetchCampaignList();
  }, [selectedClient]);

  const fetchCampaignList = async () => {
    setIsLoading(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      // SMART CLIENT ID LOGIC:
      let targetClientId = "";
      if (storedUser.role === "client") {
        targetClientId = storedUser.id;
      } else if (storedUser.role === "org" && selectedClient) {
        targetClientId = selectedClient.id;
      }
      if (storedUser.role === "org" && !targetClientId) {
        setCampaigns([]);
        setIsLoading(false);
        return;
      }

      const clientIdParam = targetClientId
        ? `?client_id=${targetClientId}`
        : "";

      const result = await get(`/campaign/get_list${clientIdParam}`);

      if (result.status === "success") {
        const formattedData = result.data.map((camp) => {
          const allocation = parseInt(camp.quality_allocated) || 0;
          const totalLeads = parseInt(camp.total_leads) || 0;

          const progress =
            allocation > 0
              ? Math.min(100, Math.round((totalLeads / allocation) * 100))
              : 0;

          return {
            id: camp.id,
            name: camp.campaign_name,
            allocation: allocation,
            totalLeads: totalLeads,
            progress: progress,
            startDate: camp.start_date
              ? new Date(camp.start_date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "N/A",
            endDate: camp.end_date
              ? new Date(camp.end_date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "N/A",
          };
        });

        setCampaigns(formattedData);
      }
    } catch (error) {
      console.error("Error fetching campaign list:", error);
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
      render: (c) => <span>{c.allocation}</span>,
    },
    {
      key: "totalLeads",
      header: "Total Leads",
      width: "150px",
      headerAlign: "center",
      align: "center",
      render: (c) => <span>{c.totalLeads}</span>,
    },
    {
      key: "startDate",
      header: "Start Date",
      width: "150px",
      headerAlign: "center",
      align: "center",
      render: (c) => <span>{c.startDate}</span>,
    },
    {
      key: "endDate",
      header: "End Date",
      width: "150px",
      headerAlign: "center",
      align: "center",
      render: (c) => <span>{c.endDate}</span>,
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
              style={{ width: `${campaign.progress}%` }}
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
          onClick={() => navigate(`/campaigns/${campaign.id}`)}
          className="text-[#00A292] text-[15px] underline underline-offset-2 hover:text-[#008F81] transition-colors cursor-pointer"
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
        <div className="w-full sm:w-auto">
          <SearchText
            value={search}
            onChange={handleSearch}
            placeholder="SEARCH CAMPAIGN"
          />
        </div>
      </div>
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
              emptyMessage="No campaigns found"
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
