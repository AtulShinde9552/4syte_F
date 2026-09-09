import { ChevronDown } from "lucide-react";

const STATUS_STYLES = {
  Completed: "text-[#1FA971]",
  Pending: "text-[#E8A33D]",
};

const COLUMNS = ["Campaign name", "Allocation", "Total Leads", "Start Date", "End Date", "Status", "Action"];

export default function ReportsTable({ rows }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-[#EAF6F4]">
          {COLUMNS.map((label, i) => (
            <th
              key={label}
              className={`px-6 py-5 text-center font-medium text-[#111] whitespace-nowrap ${
                i === 0 ? "rounded-tl-[18px] text-left" : ""
              } ${i === COLUMNS.length - 1 ? "rounded-tr-[18px]" : ""}`}
            >
              {label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, index) => (
          <tr key={index} className="border-t border-gray-100 hover:bg-[#F7FCFB] transition-colors">
            <td className="px-6 py-5 text-[#111]">{row.name}</td>
            <td className="px-6 py-5 text-center text-[#333]">{row.allocation}</td>
            <td className="px-6 py-5 text-center text-[#333]">{row.totalLeads}</td>
            <td className="px-6 py-5 text-center text-[#333]">{row.startDate}</td>
            <td className="px-6 py-5 text-center text-[#333]">{row.endDate}</td>
            <td className={`px-6 py-5 text-center font-medium ${STATUS_STYLES[row.status] ?? "text-gray-500"}`}>
              {row.status}
            </td>
            <td className="px-6 py-5 text-center">
              <button className="inline-flex items-center gap-1 text-[#00A292] hover:text-[#008F81] font-medium underline underline-offset-2">
                Download <ChevronDown size={14} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}