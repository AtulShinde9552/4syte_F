import StatCard from "./StatCard";
import RegionPieChart from "./RegionPieChart";
import BarStatList from "./BarStatList";
import AssetStatList from "./AssetStatList";

export default function LeadDetailPanel({
  region = [],
  industries = [],
  employeeSize = [],
  assets = [],
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-5 bg-white">
      <StatCard title="Region">
        <RegionPieChart data={region} />
      </StatCard>

      <StatCard title="Industries">
        <BarStatList title="Top 5 industries by lead count" rows={industries} />
      </StatCard>

      <StatCard title="Employee Size">
        <BarStatList title="Leads by employee headcount" rows={employeeSize} />
      </StatCard>

      <StatCard title="Assets">
        <AssetStatList rows={assets} />
      </StatCard>
    </div>
  );
}