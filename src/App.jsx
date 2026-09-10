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
import { canAccessPage, defaultPathByRole } from "./accessControl.js";

const ProtectedRoute = ({ page }) => {
  const userStr = localStorage.getItem("user");
  
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }
  
  const user = JSON.parse(userStr);
  if (!canAccessPage(user.role, page)) {
    return <Navigate to={defaultPathByRole[user.role] || "/login"} replace />;
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

        <Route element={<ProtectedRoute page="campaigns" />}>
          <Route element={<CampaignListLayout />}>
            <Route path="/campaigns" element={<CampaignListPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute page="campaign-detail" />}>
          <Route element={<CampaignListLayout />}>
            <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute page="leads" />}>
          <Route element={<LeadsFileLayout />}>
            <Route path="/leads-file" element={<LeadsFilePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute page="messages" />}>
          <Route element={<MessageLayout />}>
            <Route path="/messages" element={<MessagePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute page="reports" />}>
          <Route element={<ReportsLayout />}>
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute page="campaigns" />}>
          <Route element={<OrgCampaignListLayout />}>
            <Route path="/org/campaigns" element={<OrgCampaignListPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute page="messages" />}>
          <Route element={<OrgCampaignListLayout />}>
            <Route path="/org/messages" element={<MessagePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute page="reports" />}>
          <Route element={<OrgCampaignListLayout />}>
            <Route path="/org/reports" element={<ReportsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute page="leads" />}>
          <Route element={<OrgCampaignListLayout />}>
            <Route path="/org/leads-file" element={<LeadsFilePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute page="create-campaign" />}>
          <Route element={<OrgCreateCampaignLayout />}>
            <Route path="/org/create-campaign" element={<CreateCampaignPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute page="campaign-detail" />}>
          <Route element={<OrgCampaignDetailLayout />}>
            <Route path="/org/campaigns/:id" element={<OrgCampaignDetailPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute page="manage-client" />}>
          <Route element={<ManageClientLayout />}>
            <Route path="/org/manage-client" element={<ManageClientPage />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;