import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#00A292", "#5FC3B6", "#B7E4DC"];

export default function RegionPieChart({ data = [] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex items-center gap-6">
      <PieChart width={140} height={140}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={0}
          outerRadius={65}
          startAngle={90}
          endAngle={-270}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} stroke="white" />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value} (${((value / total) * 100).toFixed(1)}%)`, name]}
        />
      </PieChart>

      <div className="flex flex-col gap-2.5">
        <p className="text-[12px] text-gray-500 mb-1">Lead distribution by top region</p>
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2 text-[13px] text-[#111]">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            {entry.name}: {entry.value} ({((entry.value / total) * 100).toFixed(1)}%)
          </div>
        ))}
      </div>
    </div>
  );
}