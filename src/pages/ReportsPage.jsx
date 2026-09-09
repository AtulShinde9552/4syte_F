import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FileText, ArrowLeft, TrendingUp, Target, CheckCircle2, Layers, ChevronDown } from "lucide-react";
import GenericTable from "../components/GenericTable";
import StatPill from "../components/Reports/StatPill";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const STATUS_STYLES = {
  Processed: "text-[#1FA971]",
  Pending: "text-[#E8A33D]",
};

export default function ReportsPage() {
  const navigate = useNavigate();
  
  const outletContext = useOutletContext() || {};
  const selectedClient = outletContext.selectedClient;

  // States
  const [stats, setStats] = useState({
    total_allocation: 0,
    total_delivered: 0,
    completion_rate: 0,
    active_campaigns: 0
  });
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let user = {};
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error("Auth parse error:", e);
  }

  // Data fetch function
  const fetchReportData = async (clientId = null) => {
    setIsLoading(true);
    try {
      let url = "http://localhost/clientportal/reports/get_dashboard_data";
      if (clientId) {
        url += `?client_id=${clientId}`;
      } else if (user.role === "client" && user.id) {
        url += `?client_id=${user.id}`;
      }

      const res = await fetch(url);
      const result = await res.json();

      if (result.status === "success") {
        setStats(result.data.stats);
        setHistory(result.data.history);
        setChartData(result.data.chart);
      }
    } catch (err) {
      console.error("Error fetching report data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Jab bhi client change ho ya page load ho
  useEffect(() => {
    if (user.role === "org") {
      if (selectedClient && selectedClient.id) {
        fetchReportData(selectedClient.id);
      } else {
        setHistory([]);
        setChartData([]);
      }
    } else {
      fetchReportData();
    }
  }, [selectedClient]);

  // Table Columns Setup
  const REPORTS_COLUMNS = [
    {
      key: "campaign_name",
      header: "Campaign Name",
      width: "260px",
      align: "left",
      render: (row) => <span className="font-medium text-[#111]">{row.campaign_name}</span>
    },
    {
      key: "submitted_count",
      header: "Leads Delivered",
      width: "140px",
      align: "center",
      render: (row) => <span>{row.submitted_count}</span>
    },
    {
      key: "file_name",
      header: "File Name",
      width: "200px",
      align: "center",
      render: (row) => <span className="text-gray-600 truncate max-w-[180px] block">{row.file_name}</span>
    },
    {
      key: "uploaded_at",
      header: "Upload Date",
      width: "160px",
      align: "center",
      render: (row) => <span>{new Date(row.uploaded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
    },
    {
      key: "status",
      header: "Status",
      width: "140px",
      align: "center",
      render: () => (
        <span className="font-medium text-[#1FA971]">Processed</span>
      ),
    },
    {
      key: "action",
      header: "Action",
      width: "150px",
      align: "center",
      render: (row) => (
        <a
          href={`http://localhost/clientportal/${row.file_path}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#00A292] hover:text-[#008F81] font-medium underline underline-offset-2"
        >
          Download <ChevronDown size={14} />
        </a>
      ),
    },
  ];

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col gap-4 sm:gap-6 bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-5">
        
        {/* Top Section / Chart Container */}
        <div className="rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-5 bg-[#FCFCFC] flex flex-col gap-4 sm:gap-5 shrink-0 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <h1 className="flex items-center gap-2 text-[19px] sm:text-[22px] lg:text-[26px] font-medium text-[#00A292]">
              Reports <FileText size={16} className="sm:size-4.5 lg:size-5" strokeWidth={2.5} />
            </h1>
            <button
              type="button"
              onClick={() => navigate(user.role === "org" ? "/org/campaigns" : "/campaigns")}
              className="flex items-center gap-2 text-[#00A292] text-[13px] sm:text-[15px] lg:text-[18px] hover:text-[#008F81] transition-colors self-start sm:self-auto cursor-pointer"
            >
              <ArrowLeft size={16} /> <div>Campaign List</div>
            </button>
          </div>

          {/* Stats Pills Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-8 bg-white p-4 rounded-xl border border-gray-100">
            <StatPill icon={TrendingUp} label="Total Allocation" value={stats.total_allocation.toLocaleString()} />
            <StatPill icon={Target} label="Total Delivered" value={stats.total_delivered.toLocaleString()} sub={`${stats.completion_rate}%`} subClassName="text-[#00A292]" />
            <StatPill icon={CheckCircle2} label="Completion Rate" value={`${stats.completion_rate}%`} sub="Overall" subClassName="text-gray-400" />
            <StatPill icon={Layers} label="Active Campaigns" value={stats.active_campaigns} sub="Running" subClassName="text-[#00A292]" />
          </div>

          {/* Area Chart for Lead Delivery Trend */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
            <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#111] mb-4">
              Lead Delivery Trend (Recent Activity)
            </h2>
            <div className="h-[220px] sm:h-[260px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00A292" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#00A292" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="4 6" stroke="#EEE" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} width={35} />
                    <Tooltip />
                    <Area type="monotone" dataKey="leads" stroke="#00A292" strokeWidth={2} fill="url(#leadsFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No delivery data available to plot chart.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delivery History Table */}
        <div className="rounded-[14px] sm:rounded-[18px] border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.04)] overflow-hidden shrink-0 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-100 font-medium text-gray-800 text-[16px]">
            Lead Batch Delivery History
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading Reports...</div>
          ) : (
            <GenericTable
              columns={REPORTS_COLUMNS}
              data={history}
              rowKey="id"
              emptyMessage="No lead files uploaded or delivered yet."
            />
          )}
        </div>

      </div>
    </div>
  );
}