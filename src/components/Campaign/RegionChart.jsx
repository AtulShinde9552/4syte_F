import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#18A89B", "#69C6BC", "#C4ECE8", "#A5DED8", "#E3F6F3"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const { name, value, percentage } = payload[0].payload;

  return (
    <div className="bg-white rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.12)] px-4 py-3 border border-gray-100">
      <p className="text-[12px] font-medium text-gray-500">{name}</p>
      <p className="text-[16px] font-semibold text-[#111]">
        {value.toLocaleString()}{" "}
        <span className="text-[13px] font-normal text-gray-500">leads</span>
      </p>
      <p className="text-[12px] font-medium text-[#00A292]">{percentage}%</p>
    </div>
  );
}

export default function RegionChart({ data = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const regions = useMemo(() => {
    const total = data.reduce((sum, r) => sum + r.value, 0);
    return data.map((r) => ({
      ...r,
      percentage: total > 0 ? ((r.value / total) * 100).toFixed(1) : 0,
    }));
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No region data available yet.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-8 h-full">
      {/* ================= PIE ================= */}
      <div className="relative w-67.5 h-[270px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={regions}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={130}
              startAngle={90}
              endAngle={-270}
              stroke="#fff"
              strokeWidth={6}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {regions.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                  style={{
                    filter:
                      activeIndex === index
                        ? "brightness(1.08)"
                        : "brightness(1)",
                    cursor: "pointer",
                    transition: "filter 0.15s ease",
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ================= LEGEND ================= */}
      <div className="flex flex-col items-start justify-start gap-16 self-start">
        <p className="text-[13px] text-gray-500">
          Lead distribution by top region
        </p>

        <div className="flex flex-col gap-4">
          {regions.map((region, index) => (
            <div key={region.name} className="flex items-center gap-2">
              <span
                className="w-[13px] h-[13px] rounded-sm shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-[13px] text-[#333]">
                {region.name}: {region.value} ({region.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}