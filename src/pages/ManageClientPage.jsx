import { useState, useEffect } from "react";
import { Power, Plus } from "lucide-react";
import GenericTable from "../components/GenericTable";
import CreateClientDrawer from "../components/CreateClientDrawer";

const statusStyles = {
  Active: "text-[#00A292]",
  Deactivated: "text-red-500",
};

const actionButtonStyles = {
  Active: "bg-[#00A292] hover:bg-[#008F81]",
  Deactivated: "bg-red-500 hover:bg-red-600",
};

export default function ManageClientPage() {
  const [clients, setClients] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch Clients from Database
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost/clientportal/clients/get_list");
      const result = await res.json();
      if (result.status === "success") {
        setClients(result.data); // Controller direct UI format me data bhej raha hai
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // 2. Toggle Status API (Updated for JSON payload)
  const handleToggleStatus = async (client) => {
    const newStatus = client.status === "Active" ? "Deactivated" : "Active";
    
    try {
      const res = await fetch("http://localhost/clientportal/clients/toggle_status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: client.id,
          status: newStatus
        }),
      });
      const result = await res.json();
      
      if (result.status === "success") {
        setClients((prev) =>
          prev.map((c) =>
            c.id === client.id ? { ...c, status: newStatus } : c
          )
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // 3. Create Client API (Updated for JSON payload)
  // 3. Create Client API (Updated for Image Upload & FormData)
  const handleCreateClient = async (newClient) => {
    const formData = new FormData();
    
    // Yahan keys backend ke $_POST variables se match karni chahiye
    formData.append("company_name", newClient.companyName);
    formData.append("login_email", newClient.loginEmail);
    formData.append("password", newClient.password);
    formData.append("status", newClient.status);
    
    // Agar image select ki gayi hai, toh usko bhi append karo
    if (newClient.avatarFile) {
      formData.append("avatar", newClient.avatarFile);
    }

    try {
      const res = await fetch("http://localhost/clientportal/clients/create", {
        method: "POST",
        body: formData, 
      });
      const result = await res.json();

      if (result.status === "success") {
        fetchClients();
        setIsDrawerOpen(false);
      } else {
        alert(result.message || "Failed to create client");
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
          {client.clientName}
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
        <span className="text-[14px] text-gray-600">{client.loginEmail}</span>
      ),
    },
    {
      key: "password", 
      header: "Password",
      width: "200px",
      headerAlign: "center",
      align: "center",
      render: (client) => (
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
          className={`text-[14px] font-medium ${
            statusStyles[client.status] ?? "text-gray-600"
          }`}
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
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer ${
              actionButtonStyles[client.status] ?? "bg-gray-400"
            }`}
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
          <Plus size={15} />
          Add New
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col px-4 sm:px-6 lg:px-10">
        {isLoading ? (
          <div className="flex justify-center items-center h-full text-gray-500">Loading Clients...</div>
        ) : (
          <GenericTable
            columns={columns}
            data={clients}
            rowKey="id"
            emptyMessage="No clients found in the database"
          />
        )}
      </div>

      <CreateClientDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleCreateClient}
      />
    </div>
  );
}