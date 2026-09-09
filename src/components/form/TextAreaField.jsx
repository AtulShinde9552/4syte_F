export default function TextAreaField({ placeholder, value, onChange }) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full h-[130px] bg-[#FFFFFF] resize-none  shadow-sm p-4 text-[14px] placeholder:text-gray-400 focus:outline-none"
    />
  );
}