import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import logo from "../assets/images/logo-4syte.png";
import loginBg from "../assets/images/login-bg.jpg";
import { Eye, EyeOff } from "lucide-react";
import { post } from "../api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username || !password) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await post("/auth/login", { username, password });

      if (result.status === "success") {
        localStorage.setItem("user", JSON.stringify(result.data));


        if (result.data.role === "main_admin") {
          navigate("/org/manage-client");
        } else if (result.data.role === "org") {
          navigate("/org/campaigns");
        } else if (result.data.role === "client") {
          navigate("/campaigns"); 
        }
      } else {
        setErrorMsg(result.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center gap-10 lg:gap-80 px-10 lg:px-20 overflow-hidden bg-[#F7F8F9]"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex items-center gap-4 z-10">
        <img
          src={logo}
          alt="4SYTE"
          className="w-[450px] h-[450px] object-contain"
        />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[450px] h-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] px-8 py-9 z-10">
        <h1 className="text-[26px] font-semibold text-[#00A292]">
          Welcome back!
        </h1>
        <p className="text-[14px] font-medium text-[#00A292] mb-6">
          Please sign in to continue
        </p>

        {errorMsg && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 text-[13px] rounded">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-wide text-gray-500">
              USERNAME / EMAIL
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="enter your email or username"
              className="h-11 bg-[#F5F6F7] border border-[#EBEBEB] rounded-lg px-4 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#00A292] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-wide text-gray-500">
              PASSWORD
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="enter your password"
                className="h-11 w-full bg-[#F5F6F7] border border-[#EBEBEB] rounded-lg px-4 pr-11 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#00A292] transition-colors"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-[13px] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300  text-black focus:ring-[#00A292] cursor-pointer"
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 h-12 mt-2 rounded-full text-white text-[14px] font-semibold transition-colors ${isLoading ? 'bg-gray-400' : 'bg-[#00A292] hover:bg-[#008F81]'}`}
          >
            <LogIn size={16} />
            {isLoading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <p className="text-center text-[13px] mt-4">
          <span className="text-[#00A292] underline underline-offset-2 hover:text-[#008F81] cursor-pointer transition-colors">
            Need access?
          </span>
          {"  "}
          Contact administrator
        </p>
      </div>
    </div>
  );
}