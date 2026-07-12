import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { API_URL } from "../../../config/api";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setErrorMsg("");
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (res.status === 401) {
          return;
        }

        const data = await res.json();

        if (data.user) {
          navigate("/voters/dashboard");
        }
      } catch (err) {
        setErrorMsg("Authorization Failed");
      }
    };

    checkAuth();
  }, []);

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setErrorMsg("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetch(`${API_URL}/voters/login/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message);
        return;
      }

      setOtpSent(true);
      alert("OTP sent successfully");
    } catch (err) {
      setErrorMsg("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setErrorMsg("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetch(`${API_URL}/voters/login/verify-otp`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message);
        return;
      }

      alert("Login successful");
      navigate("/voters/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMsg("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-surface-alt">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-card relative w-full max-w-md p-8 border border-gray-300"
      >
        <span className="block text-center font-body text-[10px] tracking-[0.2em] uppercase font-bold text-accent mb-2">
          Voter Portal
        </span>

        <h2 className="font-display text-3xl text-center text-ink mb-6">
          Sign in to vote
        </h2>

        {errorMsg && (
          <div
            className="text-xs p-3 rounded mb-4 text-center font-body border"
            style={{
              background: "rgba(224, 110, 110, 0.08)",
              borderColor: "var(--red)",
              color: "var(--red)",
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Email Field Step */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1.5 font-body text-xs uppercase tracking-wide text-muted">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={otpSent}
              className="w-full font-body text-sm bg-paper border border-gray-300 rounded px-4 py-2.5 text-ink focus:outline-none focus:border-ink transition-colors disabled:opacity-50"
            />
          </div>

          {!otpSent ? (
            <>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-ink text-paper font-body text-xs font-medium py-3 rounded transition-colors hover:bg-neutral-800 disabled:opacity-40"
              >
                {loading ? "Sending OTP…" : "Get OTP"}
              </button>

              <div className="text-center mt-5 pt-2">
                <p className="text-xs font-body text-muted">
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="font-medium underline underline-offset-4 text-accent transition-colors hover:text-ink"
                  >
                    Register here
                  </a>
                </p>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4 pt-1"
            >
              <div>
                <label className="block mb-1.5 font-body text-xs uppercase tracking-wide text-muted">
                  One-Time Password
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full font-body text-sm bg-paper border border-gray-300 rounded px-4 py-2.5 text-ink focus:outline-none focus:border-ink transition-colors"
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-ink text-paper font-body text-xs font-medium py-3 rounded transition-colors hover:bg-neutral-800 disabled:opacity-40"
              >
                {loading ? "Verifying…" : "Verify OTP"}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
