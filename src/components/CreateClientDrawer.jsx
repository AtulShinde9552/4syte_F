import { useState, useEffect, useRef } from "react";
import { UserRound, X, ChevronRight, Camera } from "lucide-react";

const statusOptions = ["Active", "Deactivated"];

export default function CreateClientDrawer({ isOpen, onClose, onSubmit }) {
  const [companyName, setCompanyName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setCompanyName("");
      setLoginEmail("");
      setPassword("");
      setStatus("");
      setAvatarFile(null);
      setAvatarPreview("");
    }
  }, [isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleGenerateAccess = () => {
    if (!companyName || !loginEmail || !password || !status) return;
    // Avatar file bhi pass kar rahe hain parent ko
    onSubmit?.({ companyName, loginEmail, password, status, avatarFile });
  };

  const canSubmit = companyName && loginEmail && password && status;

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="shrink-0 flex items-center justify-between gap-3 bg-[#00A292] px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
              <UserRound size={16} className="text-white" />
            </span>
            <h2 className="text-[18px] font-semibold text-white">
              Create Client Credentials
            </h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
          
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-3">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-20 h-20 rounded-full bg-[#F5F6F7] border-2 border-dashed border-[#00A292]/50 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-[#EAF6F4] transition-colors group"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera size={24} className="text-[#00A292]/60 group-hover:text-[#00A292]" />
              )}
              {/* Overlay for hover */}
              {avatarPreview && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} className="text-white" />
                </div>
              )}
            </div>
            <p className="text-[12px] text-gray-500 font-medium">Upload Profile Picture</p>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-[#111]">Client / Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Atul / Meta Business"
              className="w-full h-11 bg-[#F5F6F7] border border-[#EBEBEB] rounded-lg px-4 text-[13px] text-gray-700 outline-none focus:border-[#00A292] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-[#111]">Login Email Address</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="client@company.com"
              className="w-full h-11 bg-[#F5F6F7] border border-[#EBEBEB] rounded-lg px-4 text-[13px] text-gray-700 outline-none focus:border-[#00A292] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-[#111]">Password (Plain Text Mode)</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full h-11 bg-[#F5F6F7] border border-[#EBEBEB] rounded-lg px-4 text-[13px] text-gray-700 outline-none focus:border-[#00A292] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-[#111]">Status</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-11 appearance-none bg-[#F5F6F7] border border-[#EBEBEB] rounded-lg pl-4 pr-10 text-[13px] text-gray-700 outline-none focus:border-[#00A292] transition-colors"
              >
                <option value="" disabled>Select Status</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <ChevronRight size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="shrink-0 px-6 pb-6 pt-2">
          <button
            type="button"
            onClick={handleGenerateAccess}
            disabled={!canSubmit}
            className={`w-full h-12 rounded-lg text-[14px] font-medium text-white transition-colors ${
              canSubmit ? "bg-[#00A292] hover:bg-[#008F81] cursor-pointer" : "bg-[#00A292]/40 cursor-not-allowed"
            }`}
          >
            Generate Access
          </button>
        </div>
      </aside>
    </>
  );
}