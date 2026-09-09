import { UploadCloud } from "lucide-react";

export default function FileUploadField({ fileName, onChange, accept = ".csv", hint }) {
  return (
    <label className="flex flex-col items-center justify-center h-32.5 border-2 border-dotted bg-[#FBFBFB] border-[#A2A2A2] rounded-2xl cursor-pointer">
      <span className="w-8 h-8 rounded-md bg-[#00A292] flex items-center justify-center mb-2">
        <UploadCloud size={16} color="white" />
      </span>
      <span className="text-[13px] font-medium text-[#111]">
        {fileName || "No file chosen"}
      </span>
      {hint && <span className="text-[11px] text-gray-400 mt-1">{hint}</span>}
      <input type="file" accept={accept} onChange={onChange} className="hidden" />
    </label>
  );
}