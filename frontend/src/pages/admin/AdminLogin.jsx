import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { API_URL } from "../../../config/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    admin_id: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setErrorMsg("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (res.status === 401) return;

        const data = await res.json();

        if (data.user?.role == "admin") {
          navigate("/admins/dashboard");
        }
      } catch (err) {
        setErrorMsg("Authorization failed");
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetch(`${API_URL}/admins/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || `Login failed (${res.status})`);
        return;
      }

      navigate(`/admins/dashboard`);
    } catch (err) {
      setErrorMsg("Network error. Please check if server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 font-body"
      style={{ background: "#EDEAE3" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md p-8"
        style={{ background: "#FAF8F3", border: "1px solid #D8D4C8" }}
      >
        <span
          className="block text-center font-body text-xs tracking-[0.2em] uppercase mb-2"
          style={{ color: "#9C2B2B" }}
        >
          Administration
        </span>
        <h2
          className="font-display text-3xl text-center mb-6"
          style={{ color: "#1C2541" }}
        >
          Admin Login
        </h2>

        {errorMsg && (
          <div
            className="text-sm p-3 rounded mb-4 text-center font-body"
            style={{
              background: "#FAEAEA",
              border: "1px solid #E0B8B8",
              color: "#9C2B2B",
            }}
          >
            {errorMsg}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              className="block text-xs font-body uppercase tracking-wider mb-2"
              style={{ color: "#6B6A63" }}
            >
              Admin ID
            </label>
            <input
              type="text"
              name="admin_id"
              placeholder="Enter your Admin ID"
              value={formData.admin_id}
              onChange={handleChange}
              className="inp"
            />
          </div>

          <div>
            <label
              className="block text-xs font-body uppercase tracking-wider mb-2"
              style={{ color: "#6B6A63" }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
              className="inp"
            />
          </div>

          <div>
            <label
              className="block text-xs font-body uppercase tracking-wider mb-2"
              style={{ color: "#6B6A63" }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
              className="inp"
            />
          </div>
        </div>

        <button onClick={handleLogin} disabled={loading} className="btn">
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center mt-5">
          <p className="text-sm font-body" style={{ color: "#6B6A63" }}>
            Go back to{" "}
            <button
              onClick={() => navigate("/voters/login")}
              className="font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
              style={{ color: "#9C2B2B" }}
            >
              User Login
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
