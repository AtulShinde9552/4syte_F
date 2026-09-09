import { useRef, useState, useEffect } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

const COLUMNS = [
  // Contact info
  { key: "aid", label: "AID", width: "120px" },
  { key: "firstName", label: "First_name", width: "120px" },
  { key: "lastName", label: "Last_name", width: "120px" },
  { key: "email", label: "Email", width: "200px" },
  { key: "phone", label: "Phone", width: "150px" },
  { key: "linkedinUrl", label: "LinkedIn URL", width: "200px" },
  { key: "jobTitle", label: "Job_title", width: "160px" },
  { key: "seniority", label: "Seniority Level", width: "150px" },
  { key: "department", label: "Department", width: "150px" },

  // Company info
  { key: "companyName", label: "Company Name", width: "160px" },
  { key: "companyWebsite", label: "Company Website", width: "180px" },
  { key: "industry", label: "Industry", width: "170px" },
  { key: "subIndustry", label: "Sub-Industry", width: "170px" },
  { key: "employeeSize", label: "Employee Size", width: "140px" },
  { key: "revenue", label: "Annual Revenue", width: "150px" },

  // Location
  { key: "country", label: "Country", width: "130px" },
  { key: "state", label: "State", width: "130px" },
  { key: "city", label: "City", width: "130px" },
  { key: "zipCode", label: "Zip Code", width: "110px" },
  { key: "timezone", label: "Time Zone", width: "130px" },

  // Asset / campaign info
  { key: "assetTitle", label: "Asset_title", width: "220px" },
  { key: "assetType", label: "Asset Type", width: "140px" },
  { key: "campaignName", label: "Campaign Name", width: "200px" },
  { key: "leadSource", label: "Lead Source", width: "150px" },
  { key: "syndicationVendor", label: "Syndication Vendor", width: "180px" },
  { key: "channel", label: "Channel", width: "130px" },

  // Engagement & scoring
  { key: "leadScore", label: "Lead Score", width: "110px" },
  { key: "engagementLevel", label: "Engagement Level", width: "160px" },
  { key: "downloadDate", label: "Download Date", width: "150px" },
  { key: "lastActivityDate", label: "Last Activity Date", width: "170px" },
  { key: "callDisposition", label: "Call Disposition", width: "160px" },

  // Compliance & status
  { key: "consentStatus", label: "Consent Status", width: "150px" },
  { key: "leadStatus", label: "Status", width: "130px" },
  { key: "notes", label: "Notes", width: "220px" },
];

const CHECKBOX_WIDTH = 56;
const AID_WIDTH = 250;
const FIXED_WIDTH = CHECKBOX_WIDTH + AID_WIDTH;
const ROW_HEIGHT = 56; 

export default function LeadsTable({ leads }) {
  const scrollRef = useRef(null);
  const fixedBodyRef = useRef(null);
  const [selected, setSelected] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const allSelected = leads.length > 0 && selected.length === leads.length;

  function toggleAll() {
    setSelected(allSelected ? [] : leads.map((lead) => lead.aid));
  }

  function toggleOne(aid) {
    setSelected((prev) =>
      prev.includes(aid) ? prev.filter((id) => id !== aid) : [...prev, aid],
    );
  }

  function scrollLeft() {
    scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  }

  function scrollRight() {
    scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  }

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;

    if (fixedBodyRef.current) {
      fixedBodyRef.current.scrollTop = el.scrollTop;
    }

    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollWidth > el.clientWidth + el.scrollLeft + 2);
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    handleScroll();
    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leads]);

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      <div className="flex h-full">
        {/* ================= FIXED: CHECKBOX + AID ================= */}
        <div
          className="shrink-0 h-full overflow-hidden border-r border-gray-200"
          style={{ width: FIXED_WIDTH }}
        >
          <table
            className="border-collapse text-sm"
            style={{ width: FIXED_WIDTH }}
          >
            <thead>
              <tr className="bg-[#EAF6F4]">
                <th
                  className="px-5 py-4 text-center rounded-tl-[26px] border-r border-gray-200"
                  style={{ height: ROW_HEIGHT, width: CHECKBOX_WIDTH }}
                >
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 accent-[#00A292] rounded cursor-pointer"
                  />
                </th>
                <th
                  className="px-5 py-4 text-center font-medium text-[#111] whitespace-nowrap"
                  style={{ height: ROW_HEIGHT, width: AID_WIDTH }}
                >
                  Camplaign Name
                </th>
              </tr>
            </thead>
          </table>

          <div
            ref={fixedBodyRef}
            className="overflow-hidden"
            style={{ height: "calc(100% - " + ROW_HEIGHT + "px)" }}
          >
            <table
              className="border-collapse text-sm"
              style={{ width: FIXED_WIDTH }}
            >
              <tbody>
                {leads.map((lead, index) => (
                  <tr
                    key={lead.aid + index}
                    className={`
                      border-t border-gray-100
                      hover:bg-[#F7FCFB]
                      transition-colors
                      ${selected.includes(lead.aid) ? "bg-[#F0FFFC]" : "bg-white"}
                    `}
                    style={{ height: ROW_HEIGHT }}
                  >
                    <td
                      className="px-5 py-4 text-center border-r border-gray-100"
                      style={{ width: CHECKBOX_WIDTH }}
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(lead.aid)}
                        onChange={() => toggleOne(lead.aid)}
                        className="w-4 h-4 accent-[#00A292] rounded cursor-pointer"
                      />
                    </td>
                    <td
                      className="px-5 py-4 whitespace-nowrap text-[#333]"
                      style={{ width: AID_WIDTH }}
                    >
                      {lead.campaignName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= SCROLLABLE: FIRST_NAME ONWARD ================= */}
        <div
          ref={scrollRef}
          className="flex-1 min-w-0 h-full overflow-auto scrollbar-hide"
        >
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#EAF6F4]">
                {COLUMNS.map((col, i) => (
                  <th
                    key={col.key}
                    style={{ minWidth: col.width, height: ROW_HEIGHT }}
                    className={`px-5 py-4 text-center font-medium text-[#111] whitespace-nowrap ${
                      i !== COLUMNS.length - 1 ? "border-r border-gray-200" : ""
                    } ${i === COLUMNS.length - 1 ? "rounded-tr-[26px]" : ""}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {leads.map((lead, index) => (
                <tr
                  key={lead.aid + index}
                  className={`
                    border-t border-gray-100
                    hover:bg-[#F7FCFB]
                    transition-colors
                    ${selected.includes(lead.aid) ? "bg-[#F0FFFC]" : "bg-white"}
                  `}
                  style={{ height: ROW_HEIGHT }}
                >
                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.aid}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.firstName}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.lastName}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.email}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.phone}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.linkedinUrl}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.jobTitle}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.seniority}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.department}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.companyName}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.companyWebsite}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.industry}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.subIndustry}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.employeeSize}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.revenue}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.country}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.state}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.city}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.zipCode}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.timezone}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] truncate max-w-[220px] border-r border-gray-100">
                    {lead.assetTitle}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.assetType}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.campaignName}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.leadSource}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.syndicationVendor}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.channel}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.leadScore}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.engagementLevel}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.downloadDate}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.lastActivityDate}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.callDisposition}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.consentStatus}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333] border-r border-gray-100">
                    {lead.leadStatus}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[#333]">
                    {lead.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Left scroll arrow */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={scrollLeft}
          className="
            absolute top-0 h-11
            flex items-center justify-center
            w-10
            bg-[#EAF6F4]
            hover:bg-[#DBEFEC]
            transition-colors
            cursor-pointer
            z-20
          "
          style={{ left: FIXED_WIDTH }}
        >
          <ChevronsLeft size={16} className="text-gray-500" />
        </button>
      )}

      {/* Right scroll arrow */}
      {canScrollRight && (
        <button
          type="button"
          onClick={scrollRight}
          className="
            absolute top-0 right-0 h-11
            flex items-center justify-center
            w-10
            bg-[#EAF6F4]
            hover:bg-[#DBEFEC]
            transition-colors
            cursor-pointer
            z-20
          "
        >
          <ChevronsRight size={16} className="text-gray-500" />
        </button>
      )}
    </div>
  );
}
