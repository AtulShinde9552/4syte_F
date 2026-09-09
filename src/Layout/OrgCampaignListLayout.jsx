import { useState } from "react";
import { Outlet } from "react-router-dom";
import OrgNavbar from "../components/OrgNavbar";
import Sidebar from "../components/Sidebar";

export default function OrgCampaignListLayout() {
  const [selectedClient, setSelectedClient] = useState(null);

  return (
    <div className="flex gap-5 h-screen overflow-hidden bg-linear-to-b from-[#00A292]/20 to-white/20 p-5">
      {/* Yahan par humne selectedClient prop pass kar diya hai */}
      <Sidebar selectedClient={selectedClient} />
      
      <main className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Org Navbar with State & Dropdown */}
        <OrgNavbar 
          selectedClient={selectedClient} 
          onClientChange={(client) => setSelectedClient(client)} 
        />
        
        <div className="flex-1 min-h-0 px-6 overflow-hidden">
          <Outlet context={{ selectedClient }} />
        </div>
      </main>
    </div>
  );
}