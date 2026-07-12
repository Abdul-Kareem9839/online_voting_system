import { motion } from "framer-motion";
import { useState } from "react";
import { API_URL } from "../../../../config/api";


export default function OtpStep({
  data,
  updateData,
  next,
  back,
  errorMsg,
  setErrorMsg,
}) {
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const sendOtp = async () => {
    try {
      setSending(true);
      setErrorMsg("");

      const res = await fetch(`${API_URL}/voters/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          voter_id_number: data.voter_id_number,
          election_id: data.election_id,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      setOtpSent(true);
      setErrorMsg("");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    try {
      if (!otp) {
        return setErrorMsg("Please enter OTP.");
      }

      setVerifying(true);
      setErrorMsg("");

      const res = await fetch(`${API_URL}/voters/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          election_id: data.election_id,
          otp,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      updateData({
        otp,
      });

      next();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#EDEAE3" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8"
        style={{
          background: "#FAF8F3",
          border: "1px solid #D8D4C8",
        }}
      >
        <span
          className="block text-center text-xs tracking-[0.2em] uppercase mb-2"
          style={{ color: "#9C2B2B" }}
        >
          Step 3 of 5
        </span>

        <h2
          className="font-display text-3xl text-center mb-2"
          style={{ color: "#1C2541" }}
        >
          Verify Email
        </h2>

        <p className="text-center text-sm mb-6" style={{ color: "#6B6A63" }}>
          {data.email}
        </p>

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

        {!otpSent ? (
          <button className="btn w-full" disabled={sending} onClick={sendOtp}>
            {sending ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="inp mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              className="btn w-full"
              disabled={verifying}
              onClick={verifyOtp}
            >
              {verifying ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              className="text-sm underline mt-4 w-full"
              onClick={sendOtp}
              disabled={sending}
              style={{ color: "#9C2B2B" }}
            >
              Resend OTP
            </button>
          </>
        )}

        <button onClick={back} className="btn w-full mt-6">
          Back
        </button>
      </motion.div>
    </div>
  );
}