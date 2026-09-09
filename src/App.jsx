import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import CampaignListLayout from "./Layout/CampaignListLayout.jsx";
import CampaignListPage from "./pages/CampaignListPage.jsx";
import CampaignDetailPage from "./pages/CampaignDetailPage.jsx";
import LeadsFileLayout from "./Layout/LeadsFileLayout.jsx";
import LeadsFilePage from "./pages/LeadsFilePage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import ReportsLayout from "./Layout/ReportsLayout.jsx";
import MessageLayout from "./Layout/MessageLayout.jsx";
import MessagePage from "./pages/MessagePage.jsx";
import OrgCampaignListPage from "./pages/OrgCampaignListPage.jsx";
import CreateCampaignPage from "./pages/CreateCampaignPage.jsx";
import OrgCreateCampaignLayout from "./Layout/OrgCreateCampaignLayout.jsx";
import OrgCampaignListLayout from "./Layout/OrgCampaignListLayout.jsx";
import OrgCampaignDetailLayout from "./Layout/OrgCampaignDetailLayout.jsx";
import OrgCampaignDetailPage from "./pages/OrgCampaignDetailPage.jsx";
import ManageClientLayout from "./Layout/ManageClientLayout.jsx";
import ManageClientPage from "./pages/ManageClientPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

// --- SMART SECURITY GUARD COMPONENT ---
const ProtectedRoute = ({ allowedRole }) => {
  const userStr = localStorage.getItem("user");
  
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }
  
  const user = JSON.parse(userStr);
  if (user.role === "org") {
    return <Outlet />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/campaigns" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ================= CLIENT PROTECTED ROUTES ================= */}
        <Route element={<ProtectedRoute allowedRole="client" />}>
          <Route element={<CampaignListLayout />}>
            <Route path="/campaigns" element={<CampaignListPage />} />
            <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
          </Route>

          <Route element={<LeadsFileLayout />}>
            <Route path="/leads-file" element={<LeadsFilePage />} />
          </Route>

          <Route element={<MessageLayout />}>
            <Route path="/messages" element={<MessagePage />} />
          </Route>

          <Route element={<ReportsLayout />}>
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Route>

        {/* ================= ORG (ADMIN) PROTECTED ROUTES ================= */}
        <Route element={<ProtectedRoute allowedRole="org" />}>
          
          <Route element={<OrgCampaignListLayout />}>
            <Route path="/org/campaigns" element={<OrgCampaignListPage />} />
            {/* Org ke baaki saare tabs ab OrgCampaignListLayout ke andar chalenge taaki Navbar & Dropdown hamesha dikhe */}
            <Route path="/org/messages" element={<MessagePage />} />
            <Route path="/org/reports" element={<ReportsPage />} />
            <Route path="/org/leads-file" element={<LeadsFilePage />} />
          </Route>

          <Route element={<OrgCreateCampaignLayout />}>
            <Route path="/org/create-campaign" element={<CreateCampaignPage />} />
          </Route>

          <Route element={<OrgCampaignDetailLayout />}>
            <Route path="/org/campaigns/:id" element={<OrgCampaignDetailPage />} />
          </Route>

          <Route element={<ManageClientLayout />}>
            <Route path="/org/manage-client" element={<ManageClientPage />} />
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;