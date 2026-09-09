export default function FormCard({ title, children }) {
  return (
    <div className="border border-gray-200 rounded-2xl p-4">
      <p className="text-[14px] font-medium text-[#505050] mb-3">{title}</p>
      {children}
    </div>
  );
}