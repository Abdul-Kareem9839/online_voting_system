import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Check, Loader2 } from "lucide-react";
import { API_URL } from "../../../../config/api";


export default function FaceRegistration({ formData, errorMsg, setErrorMsg }) {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const MAX_IMAGES = 5;

  const capture = () => {
    if (images.length >= MAX_IMAGES) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) setImages((prev) => [...prev, imageSrc]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRegister = async () => {
    if (images.length < 3) {
      setErrorMsg("Need at least 3 photos");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const payload = {
        email: formData.email,
        voter_id_number: formData.voter_id_number,
        election_id: formData.election_id,
        otp: formData.otp,
        images,
      };

      const res = await fetch(`${API_URL}/voters/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSuccess(true);
      setImages([]);

      setTimeout(() => {
        navigate("/voters/dashboard");
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const progress = (images.length / MAX_IMAGES) * 100;

  return (
    <div
      className="min-h-screen lg:h-screen w-full flex items-center justify-center p-4 overflow-y-auto lg:overflow-hidden font-body"
      style={{ background: "#EDEAE3" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-7xl h-auto lg:h-full p-6 flex flex-col"
        style={{ background: "#FAF8F3", border: "1px solid #D8D4C8" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 shrink-0 pl-4">
          <div>
            <h1 className="font-display text-2xl" style={{ color: "#1C2541" }}>
              Face Registration
            </h1>
            <p className="text-sm font-body" style={{ color: "#6B6A63" }}>
              Capture at least 3 photos
            </p>
          </div>

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

          <div className="flex items-center gap-3">
            <span
              className="text-sm font-body font-medium"
              style={{ color: "#1C2541" }}
            >
              {images.length}/{MAX_IMAGES}
            </span>
            <div
              className="w-24 h-1.5 rounded-full overflow-hidden"
              style={{ background: "#E5DCC6" }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progress}%`, background: "#1C2541" }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 lg:overflow-hidden pl-4">
          <div className="lg:col-span-3 flex flex-col h-auto lg:h-full">
            <div
              className="relative aspect-video lg:aspect-auto lg:flex-1 rounded-xl overflow-hidden min-h-[240px] lg:min-h-0"
              style={{ background: "#FFFFFF", border: "1px solid #D8D4C8" }}
            >
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                mirrored
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Viewfinder Target Framing Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-48 h-48 border-2 rounded-full border-dashed"
                  style={{ borderColor: "#B8B4A8" }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4 shrink-0">
              <button
                onClick={capture}
                disabled={images.length >= MAX_IMAGES}
                className="flex-1 py-3 rounded-xl font-body font-medium flex items-center justify-center gap-2 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: "#1C2541", color: "#EDEAE3" }}
              >
                <Camera size={18} />
                Capture
              </button>

              <button
                type="submit"
                onClick={() => handleRegister()}
                disabled={loading || images.length < 3}
                className="flex-1 py-3 rounded-xl font-body font-medium flex items-center justify-center gap-2 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: "#5C7461", color: "#EDEAE3" }}
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : success ? (
                  <Check size={18} />
                ) : (
                  "Register"
                )}
              </button>
            </div>

            {images.length > 0 && images.length < 3 && (
              <p
                className="text-center text-xs mt-2 shrink-0 font-body"
                style={{ color: "#9C2B2B" }}
              >
                {3 - images.length} more photos needed
              </p>
            )}
          </div>

          <div
            className="lg:col-span-2 rounded-xl p-4 flex flex-col h-auto lg:h-full min-h-[200px] lg:min-h-0"
            style={{ background: "#FAF4EC", border: "1px solid #E5DCC6" }}
          >
            <div className="flex items-center justify-between mb-3 shrink-0">
              <span
                className="text-sm font-body font-medium"
                style={{ color: "#6B6A63" }}
              >
                Photos
              </span>
              {images.length > 0 && (
                <button
                  onClick={() => setImages([])}
                  className="text-xs font-body underline transition-opacity hover:opacity-70"
                  style={{ color: "#9C2B2B" }}
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 gap-2 flex-1 overflow-y-auto content-start max-h-[300px] lg:max-h-none">
              <AnimatePresence>
                {images.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative aspect-square rounded-lg overflow-hidden border bg-white"
                    style={{ borderColor: "#D8D4C8" }}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-[#1C2541]/80 hover:bg-[#1C2541] text-[#EDEAE3] rounded-full p-1 transition-colors"
                    >
                      <X size={12} />
                    </button>
                    <div
                      className="absolute bottom-1 left-1 text-[10px] px-1 rounded font-body font-medium"
                      style={{
                        background: "#FAF8F3",
                        color: "#6B6A63",
                        border: "1px solid #D8D4C8",
                      }}
                    >
                      #{i + 1}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {images.length === 0 && (
                <div
                  className="col-span-full flex flex-col items-center justify-center h-32"
                  style={{ color: "#B8B4A8" }}
                >
                  <Camera size={28} />
                  <p className="text-xs font-body mt-2">
                    No photos captured yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}