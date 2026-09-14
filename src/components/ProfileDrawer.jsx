import { LogOut, UserRound, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileDrawer({
  isOpen,
  onClose,
  name,
  role,
  avatar,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    onClose();
    navigate("/login");
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="shrink-0 flex items-center justify-between gap-3 bg-[#00A292] px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
              <UserRound size={16} className="text-white" />
            </span>
            <h2 className="text-[18px] font-semibold text-white">Profile</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className="text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <img
              src={avatar}
              alt={name}
              className="w-16 h-16 rounded-full object-cover shrink-0 border border-[#00A292]/20"
            />
            <div className="min-w-0">
              <h3 className="text-[17px] font-semibold text-[#111] truncate">
                {name}
              </h3>
              <p className="text-[13px] text-gray-500 truncate">{role}</p>
            </div>
          </div>

          <div className="border-t border-[#EBEBEB] pt-5">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 w-full h-11 rounded-lg px-4 text-[14px] font-medium text-[#00A292] hover:bg-[#EAF6F4] transition-colors cursor-pointer"
            >
              <LogOut size={17} />
              Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
