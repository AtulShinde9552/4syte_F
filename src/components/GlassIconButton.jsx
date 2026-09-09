export default function GlassIconButton({
  icon: Icon,
  size = 20,
  stroke = "#00A292",
  fill = "none",
  onClick,
  className = "",
  as = "button",
}) {
  const Tag = as;

  return (
    <Tag
      onClick={onClick}
      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
        backdrop-blur-md backdrop-saturate-150
        border border-white/50
        shadow-[0_2px_8px_rgba(0,0,0,0.06)]
        bg-white/30 ${className}`}
    >
      <Icon size={size} stroke={stroke} fill={fill} />
    </Tag>
  );
}