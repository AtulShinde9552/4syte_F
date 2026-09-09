import { useMemo } from "react";
import { TrendingUp, PieChart as PieIcon, Target, Calendar, BarChart2, Info } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import StatPill from "./StatPill";

// Temporary data — replace with API-driven weekly totals later.
const DATA = Array.from({ length: 52 }, (_, i) => {
  const week = i + 1;
  const base = 95000 + Math.sin(i / 4) * 15000 + Math.sin(i / 1.3) * 8000;
  const spike = week === 18 ? 32000 : week === 52 ? 20000 : 0;
  return {
    week: `W${week}`,
    leads: Math.max(30000, Math.round(base + spike)),
  };
});

const HIGHLIGHT_WEEK = "W18";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const value = payload[0].value;
  const index = DATA.findIndex((d) => d.week === label);
  const prev = index > 0 ? DATA[index - 1].leads : null;
  const pctChange = prev ? (((value - prev) / prev) * 100).toFixed(1) : null;

  return (
    <div className="bg-white rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.12)] px-4 py-3 border border-gray-100">
      <p className="text-[12px] font-medium text-gray-500">{label}</p>
      <p className="text-[18px] font-semibold text-[#111]">
        {value.toLocaleString()} <span className="text-[13px] font-normal text-gray-500">leads</span>
      </p>
      {pctChange && (
        <>
          <p className={`text-[12px] font-medium ${pctChange >= 0 ? "text-[#00A292]" : "text-red-500"}`}>
            {pctChange >= 0 ? "↗" : "↘"} {Math.abs(pctChange)}%
          </p>
          <p className="text-[11px] text-gray-400">
            vs {DATA[index - 1].week} ({DATA[index - 1].leads.toLocaleString()})
          </p>
        </>
      )}
    </div>
  );
}

export default function WeeklyLeadDeliveryChart() {
  const { total, avgPerWeek, best, highest, lowest, growth } = useMemo(() => {
    const total = DATA.reduce((sum, d) => sum + d.leads, 0);
    const avg = Math.round(total / DATA.length);
    const best = DATA.reduce((a, b) => (b.leads > a.leads ? b : a));
    const lowest = DATA.reduce((a, b) => (b.leads < a.leads ? b : a));
    return { total, avgPerWeek: avg, best, highest: best, lowest, growth: 18.6 };
  }, []);

  return (
    <div className="w-full min-w-0 bg-white rounded-[14px] sm:rounded-[18px] border border-white/60 shadow-[0_4px_25px_rgba(0,0,0,0.04)] p-4 sm:p-5 lg:p-7 overflow-hidden">
      {/* Header row */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6 min-w-0">
        <div className="min-w-0">
          <h2 className="text-[15px] sm:text-[16px] lg:text-[18px] font-semibold text-[#111]">
            Weekly Lead Delivery
          </h2>
          <p className="flex items-center gap-1.5 text-[12px] sm:text-[13px] text-gray-500 mt-1">
            Real-time overview of leads delivered across weeks
            <Info size={13} className="text-gray-400 shrink-0" />
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-8 min-w-0">
          <StatPill icon={TrendingUp} label="Total Leads" value={total.toLocaleString()} sub="↗ 18.6%" subClassName="text-[#00A292]" />
          <StatPill icon={PieIcon} label="Average / Week" value={avgPerWeek.toLocaleString()} sub="↗ 12.4%" subClassName="text-[#00A292]" />
          <StatPill icon={Target} label="Best Week" value={best.leads.toLocaleString()} sub={best.week} subClassName="text-gray-400" />
          <StatPill icon={Calendar} label="Period" value="52 Weeks" sub="May 2024 – Apr 2025" subClassName="text-gray-400 font-normal truncate" />
        </div>
      </div>

      {/* Chart */}
      <div className="h-[200px] sm:h-[240px] lg:h-[280px] -ml-2 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00A292" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#00A292" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="4 6" stroke="#EEE" />

            <XAxis
              dataKey="week"
              interval={window.innerWidth < 640 ? 7 : window.innerWidth < 1024 ? 5 : 3}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
            />
            <YAxis
              domain={[0, 150000]}
              ticks={[0, 25000, 50000, 75000, 100000, 125000, 150000]}
              tickFormatter={(v) => (v === 0 ? "0" : v >= 1000 ? `${v / 1000}K` : v)}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              width={38}
            />

            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={HIGHLIGHT_WEEK} stroke="#00A292" strokeWidth={1} />

            <Area
              type="monotone"
              dataKey="leads"
              stroke="#00A292"
              strokeWidth={2}
              fill="url(#leadsFill)"
              dot={{ r: 3, stroke: "#00A292", strokeWidth: 1.5, fill: "#fff" }}
              activeDot={{ r: 5, stroke: "#00A292", strokeWidth: 2, fill: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-100 min-w-0">
        <StatPill icon={TrendingUp} label="Highest Delivered" value={highest.leads.toLocaleString()} sub={highest.week} subClassName="text-gray-400" />
        <StatPill icon={BarChart2} label="Lowest Delivered" value={lowest.leads.toLocaleString()} sub={lowest.week} subClassName="text-gray-400" />
        <StatPill icon={TrendingUp} label="Growth (vs Last Year)" value={`${growth}%`} sub="↗" subClassName="text-[#00A292]" />
        <StatPill icon={PieIcon} label="Projected (Next 4 Weeks)" value="3,45,000+" sub="↗" subClassName="text-[#00A292]" />
      </div>
    </div>
  );
}