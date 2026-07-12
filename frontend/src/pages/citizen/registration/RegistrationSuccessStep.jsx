import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RegistrationSuccessStep({ data }) {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#EDEAE3" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 text-center"
        style={{
          background: "#FAF8F3",
          border: "1px solid #D8D4C8",
        }}
      >
        <div className="flex justify-center mb-6">
          <CheckCircle size={70} strokeWidth={1.8} color="#2E7D32" />
        </div>

        <span
          className="block text-xs tracking-[0.2em] uppercase mb-2"
          style={{ color: "#9C2B2B" }}
        >
          Registration Complete
        </span>

        <h2 className="font-display text-3xl mb-4" style={{ color: "#1C2541" }}>
          Registration Successful
        </h2>

        <p className="text-sm leading-6 mb-6" style={{ color: "#6B6A63" }}>
          Your identity has been verified and your registration has been
          completed successfully.
        </p>

        <div
          className="rounded-md border p-4 mb-6 text-left"
          style={{
            borderColor: "#D8D4C8",
            background: "#FDFCF8",
          }}
        >
          <p className="text-sm mb-2">
            <strong>Election</strong>
          </p>

          <p className="text-sm" style={{ color: "#6B6A63" }}>
            {data.election_name}
          </p>
        </div>

        <button
          className="btn w-full"
          onClick={() => navigate("/voters/dashboard")}
        >
          Go to Dashboard
        </button>
      </motion.div>
    </div>
  );
}
