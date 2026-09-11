import logoSrc from "../assets/images/4syte_SVG_Logo.svg";

function PulseLoader({ size = 72 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img
        src={logoSrc}
        alt="logo"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          animation: "pulse 1.4s ease-in-out infinite",
          display: "block", 
        }}
      />
      {/* Properly injecting CSS in React */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pulse {
          0%, 100% { transform: scale(0.9); opacity: 0.75; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}} />
    </div>
  );
}

export default PulseLoader;