import { useMemo, useState, useEffect } from "react";
import { Copy, Search } from "lucide-react";
// Naya import: useOutletContext
import { useOutletContext } from "react-router-dom"; 

import Pagination from "../components/Pagination";
import ActionsDropdown from "../components/LeadsFile/ActionsDropdown";
import GenericTable from "../components/GenericTable";
import FilterBar from "../components/LeadsFile/FilterBar";
import { get } from "../api";
import { usePopup } from "../components/Popup";
const ROWS_PER_PAGE = 11;

export default function LeadsFilePage() {
  const { show } = usePopup();
  const [allLeads, setAllLeads] = useState([]);
  const [dynamicHeaders, setDynamicHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- AUTO-COMPLETE STATES ---
  const [campaignSearchText, setCampaignSearchText] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(""); 
  const [campaignSuggestions, setCampaignSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [search, setSearch] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState([]);

  const [showFilters, setShowFilters] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [campaignGroup, setCampaignGroup] = useState([]);
  const [leadStatus, setLeadStatus] = useState(null);
  const [period, setPeriod] = useState(null);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Context se selectedClient nikaalo
  const outletContext = useOutletContext() || {};
  const selectedClient = outletContext.selectedClient;

  // Jab bhi selectedClient badle, data naya laao aur purani state reset karo
  useEffect(() => {
    setAllLeads([]);
    setCampaignSearchText("");
    setSelectedCampaign("");
    setCampaignGroup([]);
    fetchRealLeads();
  }, [selectedClient]);

  const fetchRealLeads = async () => {
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

      // Agar Org Admin hai aur client select nahi kiya, toh API call mat karo
      if (storedUser.role === "org" && !targetClientId) {
        setAllLeads([]);
        setIsLoading(false);
        return;
      }

      // API call mein client_id parameter bhejo
      const clientIdParam = targetClientId ? `?client_id=${targetClientId}` : "";
        const result = await get(`/leads/get_all_leads_data${clientIdParam}`);
      
      if (result.status === "success") {
        setAllLeads(result.data);
        setDynamicHeaders(result.headers || []);
      }
    } catch (error) {
      console.error("Error fetching real leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- AUTO-SUGGESTION LOGIC ---
  const allUniqueCampaigns = useMemo(() => {
    return Array.from(new Set(allLeads.map((l) => l.campaignName))).filter(Boolean);
  }, [allLeads]);

  function handleCampaignSearchChange(e) {
    const val = e.target.value;
    setCampaignSearchText(val);

    if (val.trim()) {
      const matches = allUniqueCampaigns.filter(c => c.toLowerCase().includes(val.toLowerCase()));
      setCampaignSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      if(selectedCampaign) {
        setSelectedCampaign("");
        setCampaignGroup([]);
      }
    }
  }

  function selectCampaign(campaign) {
    setCampaignSearchText(campaign);
    setSelectedCampaign(campaign);
    setCampaignGroup([]); // Naya campaign select kiya toh files clear kardo
    setShowSuggestions(false);
  }

  const uniqueCampaignGroups = useMemo(() => {
    if (!selectedCampaign) return []; 
    const filesForCampaign = allLeads
      .filter(l => l.campaignName === selectedCampaign)
      .map(l => l.assetTitle);
      
    return Array.from(new Set(filesForCampaign)).map((file) => ({
      value: file,
      label: file,
    }));
  }, [allLeads, selectedCampaign]);

  const filteredLeads = useMemo(() => {
    if (!selectedCampaign || campaignGroup.length === 0) return [];
    
    let results = allLeads.filter(
      (lead) => lead.campaignName === selectedCampaign && campaignGroup.includes(lead.assetTitle)
    );

    if (search.trim()) {
      const query = search.toLowerCase();
      results = results.filter((lead) =>
        Object.values(lead).some((value) =>
          String(value).toLowerCase().includes(query),
        ),
      );
    }
    return results;
  }, [search, campaignGroup, allLeads, selectedCampaign]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / ROWS_PER_PAGE));
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  function handleSearchChange(value) { setSearch(value); setCurrentPage(1); }
  function handleCampaignGroupChange(selectedFiles) { setCampaignGroup(selectedFiles); setCurrentPage(1); }

  const allSelected = paginatedLeads.length > 0 && paginatedLeads.every((lead) => selected.includes(lead.aid));

  function toggleAll() {
    setSelected((prev) => {
      const pageIds = paginatedLeads.map((lead) => lead.aid);
      const allOnPageSelected = pageIds.every((id) => prev.includes(id));
      return allOnPageSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : [...new Set([...prev, ...pageIds])];
    });
  }

  function toggleOne(aid) {
    setSelected((prev) => prev.includes(aid) ? prev.filter((id) => id !== aid) : [...prev, aid]);
  }

  const downloadCSV = (dataToExport, fileName) => {
    if (!dataToExport || dataToExport.length === 0) {
      show("No data available to download!", "info");
      return;
    }
    const headers = ["campaignName", "aid", ...dynamicHeaders];
    
    let csvContent = "\uFEFF";
    
    // Header row
    csvContent += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(",") + "\r\n";

    // Data rows
    dataToExport.forEach((row) => {
      const rowData = headers.map((header) => {
        let val = row[header] !== undefined && row[header] !== null ? String(row[header]) : "";
        return `"${val.replace(/"/g, '""')}"`;
      });
      csvContent += rowData.join(",") + "\r\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        key: "campaignName", width: "306px", header: "Campaign Name", headerAlign: "left", align: "left",
        render: (row) => (
          <div className="flex items-center gap-3">
            <input
              type="checkbox" checked={selected.includes(row.aid)} onChange={() => toggleOne(row.aid)}
              className="w-4 h-4 accent-[#00A292] rounded cursor-pointer"
            />
            <span className="truncate">{row.campaignName}</span>
          </div>
        ),
      },
      { key: "aid", header: "AID", width: "120px" },
    ];
    const excelColumns = dynamicHeaders.map((headerText) => ({
      key: headerText, header: headerText, width: "180px",
      render: (row) => <span className="truncate max-w-[160px] block">{row[headerText] || '-'}</span>
    }));
    return [...baseColumns, ...excelColumns];
  }, [selected, allSelected, dynamicHeaders]);

  return (
    <div className="h-full min-h-0 flex flex-col bg-white rounded-[18px] sm:rounded-[26px] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.04)] px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <div
        onMouseEnter={() => setShowFilters(true)}
        onMouseLeave={() => setShowFilters(false)}
        className="bg-[#FCFCFC] shrink-0 border-b border-gray-100 mb-4 sm:mb-7 rounded-md shadow-sm relative "
      >
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 lg:px-9">
          <div className="flex items-center gap-2">
            <h1 className="text-[17px] sm:text-[19px] lg:text-[22px] font-medium text-[#00A292] whitespace-nowrap">Lead Files</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 relative w-full sm:w-64">
            
            {/* --- FIX: POSITION RELATIVE & Z-INDEX ADD KIYA --- */}
            <div className="relative w-full ">
              <div className="flex items-center bg-[#F5F6F7] border border-[#EBEBEB] rounded-lg px-3 py-2 w-full">
                <Search size={16} className="text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={campaignSearchText}
                  onChange={handleCampaignSearchChange}
                  onFocus={() => { if(campaignSearchText) setShowSuggestions(true); }}
                  placeholder="Search Campaign Name..."
                  className="bg-transparent border-none outline-none text-[13px] w-full text-gray-700"
                />
              </div>
              
              {showSuggestions && campaignSearchText.trim() !== "" && (
                <div className="absolute top-[110%] left-0 w-full bg-white border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-lg z-[999] max-h-48 overflow-y-auto">
                  {campaignSuggestions.length > 0 ? (
                    campaignSuggestions.map((c, i) => (
                      <div
                        key={i}
                        onClick={() => selectCampaign(c)}
                        className="px-4 py-2.5 text-[13px] hover:bg-[#EAF6F4] hover:text-[#00A292] cursor-pointer text-gray-700 transition-colors border-b border-gray-100 last:border-0"
                      >
                        {c}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2.5 text-[13px] text-gray-400">No campaigns found</div>
                  )}
                </div>
              )}
            </div>
            {/* ----------------------------------------------- */}

            <ActionsDropdown
              actions={[
                { 
                  label: "Download Page", 
                  onClick: () => downloadCSV(paginatedLeads, "leads_current_page.csv") 
                },
                { 
                  label: "Download All", 
                  onClick: () => downloadCSV(filteredLeads, "leads_all_pages.csv") 
                },
              ]}
            />
          </div>
        </div>

        <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${showFilters ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"}`} onTransitionEnd={(e) => { if (e.propertyName === "grid-template-rows") setFiltersExpanded(showFilters); }}>
          <div className={filtersExpanded ? "overflow-visible" : "overflow-hidden"}>
            <FilterBar
              campaignGroup={campaignGroup}
              onCampaignGroupChange={handleCampaignGroupChange}
              campaignGroupOptions={uniqueCampaignGroups} 
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">Loading leads data...</div>
      ) : !selectedCampaign ? (
        <div className="flex-1 flex flex-col items-center justify-center m-6 rounded-[20px] bg-[#FAFAFA] border border-dashed border-gray-300">
          <p className="text-[16px] font-medium text-[#111]">Search Campaign First</p>
          <p className="text-[14px] text-gray-500 mt-1">Please search and select a <strong className="text-[#00A292]">Campaign Name</strong> (e.g., Q3 Enterprise...) from the top right search bar.</p>
        </div>
      ) : campaignGroup.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center m-6 rounded-[20px] bg-[#FAFAFA] border border-dashed border-gray-300">
          <p className="text-[16px] font-medium text-[#111]">No File Selected</p>
          <p className="text-[14px] text-gray-500 mt-1">
            Campaign selected! Now select a file from the <span className="font-semibold text-[#00A292]">Campaign Group</span> dropdown.
          </p>
        </div>
      ) : (
        <GenericTable columns={columns} data={paginatedLeads} rowKey="aid" />
      )}
      
      <div className="shrink-0 bg-[#EAF6F4]">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}