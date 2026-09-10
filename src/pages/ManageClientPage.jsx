import { useState, useEffect } from "react";
import { Power, Plus } from "lucide-react";
import GenericTable from "../components/GenericTable";
import CreateClientDrawer from "../components/CreateClientDrawer";
import { get, post } from "../api";
import { usePopup } from "../components/Popup";


const statusStyles = { Active: "text-[#00A292]", Deactivated: "text-red-500" };
const actionButtonStyles = {
  Active: "bg-[#00A292] hover:bg-[#008F81]",
  Deactivated: "bg-red-500 hover:bg-red-600",
};

export default function ManageClientPage() {
  const { show } = usePopup();
  const [clients, setClients] = useState([]);
  const [handlers, setHandlers] = useState([]); // NAYA: Handlers state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Logged in user info nikalo
  const user = JSON.parse(localStorage.getItem("user") || "{}");

 const fetchClientsAndHandlers = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      // NAYA LOGIC: Agar Org Admin hai toh sab mangao
      const apiUrl = user.role === "org" 
        ? "/clients/get_list" 
        : `/clients/get_list?admin_id=${user.id}`;
        
      const clientRes = await get(apiUrl);
      if (clientRes.status === "success") {
        if (user.role === "org") {
          setClients(clientRes.data); // Org admin ko sab dikhega
        } else {
          // Main Admin ko sirf wahi dikhega jo exactly assign hua hai
          setClients(clientRes.data.filter(c => String(c.admin_id) === String(user.id)));
        }
      }

      const handlerRes = await get("/auth/get_handlers");
      if (handlerRes.status === "success") {
        setHandlers(handlerRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientsAndHandlers();
  }, []);

  const handleToggleStatus = async (client) => {
    const newStatus = client.status === "Active" ? "Deactivated" : "Active";
    try {
      const result = await post("/clients/toggle_status", {
        id: client.id,
        status: newStatus,
      });
      if (result.status === "success") {
        setClients((prev) =>
          prev.map((c) =>
            c.id === client.id ? { ...c, status: newStatus } : c,
          ),
        );
      } else {
        show("Failed to update status.", "error");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleCreateClient = async (newClient) => {
    const formData = new FormData();
    formData.append("company_name", newClient.companyName);
    formData.append("login_email", newClient.loginEmail);
    formData.append("password", newClient.password);
    formData.append("status", newClient.status);
    formData.append("admin_id", newClient.clientManager); // NAYA: Handler ki ID bhej rahe hain

    if (newClient.avatarFile) formData.append("avatar", newClient.avatarFile);

    try {
      const result = await post("/clients/create", formData);
      if (result.status === "success") {
        fetchClientsAndHandlers(); // Refresh list
        setIsDrawerOpen(false);
        show("Client Created Successfully", "success");
      } else {
        show(result.message || "Failed to create client.", "error");
      }
    } catch (err) {
      console.error("Error creating client:", err);
    }
  };

  const columns = [
    {
      key: "clientName",
      header: "Client Name",
      width: "220px",
      headerAlign: "center",
      align: "left",
      render: (client) => (
        <span className="text-[15px] font-semibold text-[#111]">
          {client.clientName || client.company_name}
        </span>
      ),
    },
    {
      key: "loginEmail",
      header: "Login Email",
      width: "260px",
      headerAlign: "center",
      align: "center",
      render: (client) => (
        <span className="text-[14px] text-gray-600">
          {client.loginEmail || client.login_email}
        </span>
      ),
    },
    {
      key: "password",
      header: "Password",
      width: "200px",
      headerAlign: "center",
      align: "center",
      render: () => (
        <span className="text-[16px] tracking-[4px] text-gray-500 mt-1">
          ••••••••
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "150px",
      headerAlign: "center",
      align: "center",
      render: (client) => (
        <span
          className={`text-[14px] font-medium ${statusStyles[client.status] ?? "text-gray-600"}`}
        >
          {client.status}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      width: "120px",
      headerAlign: "center",
      align: "center",
      render: (client) => (
        <div className="w-full flex justify-center items-center">
          <button
            type="button"
            onClick={() => handleToggleStatus(client)}
            title={client.status === "Active" ? "Deactivate" : "Activate"}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer ${actionButtonStyles[client.status] ?? "bg-gray-400"}`}
          >
            <Power size={14} className="text-white" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full min-h-0 flex flex-col bg-white rounded-[20px] sm:rounded-[30px] shadow-[0_4px_25px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-10 pt-5 sm:pt-7 pb-4 sm:pb-5">
        <h1 className="text-[18px] sm:text-[22px] lg:text-[26px] font-medium text-[#00A292]">
          Access Management
        </h1>
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-1.5 text-[14px] font-medium text-[#00A292] underline underline-offset-2 hover:text-[#008F81] transition-colors cursor-pointer"
        >
          <Plus size={15} /> Add New
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col px-4 sm:px-6 lg:px-10">
        {isLoading ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            Loading Clients...
          </div>
        ) : (
          <GenericTable
            columns={columns}
            data={clients}
            rowKey="id"
            emptyMessage="No clients found for you"
          />
        )}
      </div>

      {/* NAYA: handlers prop bheja ja raha hai */}
      <CreateClientDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleCreateClient}
        handlers={handlers}
      />
    </div>
  );
}
