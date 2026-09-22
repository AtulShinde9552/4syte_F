import { useState, useCallback, useEffect, createContext, useContext } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

const PopupContext = createContext(null);

const VARIANTS = {
  success: { icon: CheckCircle2, ring: "#E1F5EE", accent: "#00A292", title: "Success" },
  error: { icon: XCircle, ring: "#FBEAEA", accent: "#E24B4A", title: "Something went wrong" },
  warning: { icon: AlertTriangle, ring: "#FDF3E3", accent: "#D89614", title: "Heads up" },
  info: { icon: Info, ring: "#E6F1FB", accent: "#378ADD", title: "Info" },
};

export function PopupProvider({ children }) {
  const [popup, setPopup] = useState(null);

  const show = useCallback((message, type = "info", options = {}) => {
    setPopup({ message, type, ...options });
  }, []);

  const close = useCallback(() => setPopup(null), []);

  return (
    <PopupContext.Provider value={{ show, close }}>
      {children}
      {popup && <Popup {...popup} onClose={close} />}
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error("usePopup must be used within a PopupProvider");
  return ctx;
}

function Popup({
  message,
  type = "info",
  title,
  onClose,
  onConfirm,
  confirmText,
  cancelText,
  showButton = true,
  autoClose,
}) {
  const variant = VARIANTS[type] || VARIANTS.info;
  const Icon = variant.icon;

  useEffect(() => {
    if (!autoClose) return;
    const t = setTimeout(onClose, autoClose);
    return () => clearTimeout(t);
  }, [autoClose, onClose]);

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[300px] bg-white rounded-3xl px-6 pt-8 pb-6 flex flex-col items-center text-center shadow-2xl animate-[popup-in_0.25s_cubic-bezier(0.34,1.56,0.64,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-[64px] h-[64px] rounded-full flex items-center justify-center mb-3"
          style={{ background: variant.ring }}
        >
          <Icon size={32} color={variant.accent} strokeWidth={2} />
        </div>

        <p className={`text-[15px] font-semibold text-gray-800 ${message ? "mb-1" : ""}`}>
          {title || variant.title}
        </p>
        {message && (
          <p className="text-[12.5px] text-gray-500 leading-relaxed mb-1">{message}</p>
        )}

        {showButton && (
          <div className="flex gap-2 w-full mt-5">
            {onConfirm && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-10 rounded-full border border-gray-200 text-[12.5px] font-semibold text-gray-600 cursor-pointer"
              >
                {cancelText || "Cancel"}
              </button>
            )}
            <button
              type="button"
              onClick={onConfirm ? handleConfirm : onClose}
              className="flex-1 h-10 rounded-full text-white text-[12.5px] font-semibold cursor-pointer"
              style={{ background: variant.accent }}
            >
              {confirmText || "OK"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}