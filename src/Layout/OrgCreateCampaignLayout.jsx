import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import OrgNavbar from "../components/OrgNavbar";

export default function OrgCreateCampaignLayout() {
  const location = useLocation();
  const [selectedClient, setSelectedClient] = useState(
    location.state?.selectedClient ?? null,
  );

  return (
    <div className="flex gap-5 h-screen overflow-hidden bg-linear-to-b from-[#00A292]/20 to-white/20 p-5">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 min-h-0">
        <OrgNavbar selectedClient={selectedClient} onClientChange={setSelectedClient} />
        <div className="flex-1 min-h-0 px-6 overflow-hidden">
          <Outlet context={{ selectedClient }} />
        </div>
      </main>
    </div>
  );
}