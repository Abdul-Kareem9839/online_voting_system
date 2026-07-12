import { motion } from "framer-motion";
import { useState } from "react";
import { API_URL } from "../../../../config/api";


export default function IdentityStep({
  data,
  updateData,
  next,
  errorMsg,
  setErrorMsg,
}) {
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setErrorMsg("");

    updateData({
      [e.target.name]: e.target.value,
    });
  };

  const handleContinue = async () => {
    try {
      setErrorMsg("");

      if (!data.email || !data.voter_id_number) {
        return setErrorMsg("Please fill in all fields.");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(data.email)) {
        return setErrorMsg("Please enter a valid email address.");
      }

      setLoading(true);

      const res = await fetch(
        `${API_URL}/voters/check-eligibility`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            voter_id_number: data.voter_id_number,
          }),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Something went wrong.");
      }

      updateData({
        pendingElections: result.pendingElections,
      });

      next();
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
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
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md p-8"
        style={{
          background: "#FAF8F3",
          border: "1px solid #D8D4C8",
        }}
      >
        <span
          className="block text-center text-xs tracking-[0.2em] uppercase mb-2"
          style={{ color: "#9C2B2B" }}
        >
          Step 1 of 5
        </span>

        <h2
          className="font-display text-3xl text-center mb-6"
          style={{ color: "#1C2541" }}
        >
          Verify Identity
        </h2>

        {/* Semantic Error Alert Box */}
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

        <div className="space-y-4">
          <input
            type="text"
            name="voter_id_number"
            placeholder="Voter ID Number"
            value={data.voter_id_number}
            onChange={handleChange}
            className="inp"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={data.email}
            onChange={handleChange}
            className="inp"
          />

          <button onClick={handleContinue} disabled={loading} className="btn">
            {loading ? "Checking..." : "Continue"}
          </button>

          <div className="text-center mt-5">
            <p className="text-sm" style={{ color: "#6B6A63" }}>
              Already registered?{" "}
              <a
                href="/voters/login"
                className="underline underline-offset-2 hover:opacity-70"
                style={{ color: "#9C2B2B" }}
              >
                Login here
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}