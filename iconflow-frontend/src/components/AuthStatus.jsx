// src/components/AuthStatus.jsx
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Avatar from "@/components/Avatar";

export default function AuthStatus() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-center gap-2 md:flex">
        <Avatar name={user.name} />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-800">
            {user.name || "User"}
          </span>
          <span className="text-xs text-slate-500">
            {user.credits ?? 0} credits
          </span>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        Logout
      </button>
    </div>
  );
}