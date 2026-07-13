import { Shield, Bell, User, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../../../config/api";

export default function Header({ adminData }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      navigate("/admins/login");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-paper border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Shield className="h-7 w-7 font-bold text-ink" />
            <div>
              <h1 className="text-xl font-bold font-display text-accent">
                Admin Dashboard
              </h1>
              <p className="text-xs font-body text-muted">
                Welcome back, {adminData?.username || "Admin"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted bg-white hover:bg-neutral-200 hover:text-ink rounded-full transition-colors">
              <Bell className="h-5 w-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  showDropdown
                    ? "bg-neutral-200"
                    : "bg-white hover:bg-neutral-200"
                }`}
                style={{
                  border: "1px solid var(--surface-alt)",
                }}
              >
                <User className="h-5 w-5 text-ink" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-300 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-body font-medium text-ink truncate">
                      {adminData?.username || "Admin"}
                    </p>
                    <p className="text-xs font-body text-muted capitalize truncate mt-0.5">
                      {(adminData?.admin_role || "").replace("_", " ") ||
                        "Administrator"}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-body text-accent hover:bg-surface-alt transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
