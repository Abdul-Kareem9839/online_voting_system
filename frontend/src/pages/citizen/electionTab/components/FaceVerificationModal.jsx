import { motion, AnimatePresence } from "framer-motion";
import { Camera, Loader2, ShieldCheck, CheckCircle2, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { API_URL } from "../../../../../config/api";


const FaceVerificationModal = ({
  onVerified,
  onCancel,
  voter_id,
  election_id,
  constituency_id,
  candidate,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [hasStream, setHasStream] = useState(false);
  const [success, setSuccess] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setHasStream(true);
    } catch (err) {
      alert("Unable to access camera.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setHasStream(false);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg");
  };

  const verify = async () => {
    try {
      setLoading(true);

      const image = captureImage();

      if (!image) {
        throw new Error("Unable to capture image.");
      }

      const verifyRes = await fetch(
        `${API_URL}/votes/verify-face`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            voter_id,
            image,
          }),
        },
      );

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        throw new Error(verifyData.message || "Face verification failed");
      }

      if (!verifyData.verified) {
        throw new Error("Face does not match. Vote cannot be submitted.");
      }

      const voteRes = await fetch(`${API_URL}/votes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voter_id,
          election_id,
          constituency_id,
          candidate_id: candidate.candidate_id,
        }),
      });

      const voteData = await voteRes.json();

      if (!voteRes.ok) {
        throw new Error(voteData.message || voteData.error);
      }

      setSuccess(true);

      stopCamera();

      setTimeout(() => {
        onVerified();
      }, 1800);
      onSuccess();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="bg-paper rounded-xl w-full max-w-2xl border border-gray-300 shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-surface-alt flex items-center justify-center">
                <ShieldCheck className="text-ink" size={20} />
              </div>

              <div>
                <h2 className="font-display text-lg text-ink">
                  Face Verification
                </h2>
                <p className="font-body text-xs text-muted mt-0.5">
                  Secure biometric authentication
                </p>
              </div>
            </div>

            {!loading && !success && (
              <button
                onClick={() => {
                  stopCamera();
                  onCancel();
                }}
                className="p-2 rounded-full hover:bg-surface-alt transition-colors"
              >
                <X size={18} className="text-muted hover:text-ink" />
              </button>
            )}
          </div>

          {!loading && !success && (
            <div className="p-6">
              {/* Camera Preview */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-surface-alt border border-gray-200">
                {hasStream && (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                  />
                )}

                {/* Face Guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="w-56 h-56 rounded-full border-2 border-dashed shadow-lg"
                    style={{
                      borderColor: "var(--sage)",
                      backgroundColor: "rgba(238, 243, 235, 0.15)",
                    }}
                  />
                </div>

                {!hasStream && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Camera size={40} className="text-muted animate-pulse" />
                    <p className="font-body text-xs text-muted mt-2">
                      Starting Camera...
                    </p>
                  </div>
                )}
              </div>

              {/* Instructions Box */}
              <div
                className="rounded-lg p-4 mt-5 border-l-3"
                style={{
                  background: "var(--surface-alt)",
                  borderLeft: "3px solid var(--ink)",
                }}
              >
                <p className="font-body text-xs text-muted leading-relaxed">
                  Position your face inside the indicator zone and look directly
                  at the camera before finalizing your ballot submission.
                </p>
              </div>

              {/* Hidden Canvas */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Action Row */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    stopCamera();
                    onCancel();
                  }}
                  className="flex-1 font-body text-xs font-medium border border-gray-300 text-ink py-3 rounded transition-colors hover:bg-surface-alt"
                >
                  Cancel
                </button>

                <button
                  onClick={verify}
                  disabled={!hasStream}
                  className="flex-1 font-body text-xs font-medium bg-ink text-paper py-3 rounded transition-colors hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Verify & Submit Vote
                </button>
              </div>
            </div>
          )}

          {/* Loading Block */}
          {loading && (
            <div className="py-16 flex flex-col items-center">
              <Loader2 size={40} className="animate-spin text-ink" />
              <h3 className="mt-4 font-display text-base text-ink">
                Verifying Face
              </h3>
              <p className="font-body text-xs text-muted mt-1">
                Matching biometric profile layers...
              </p>
            </div>
          )}

          {/* Success Block */}
          {success && (
            <div className="py-16 flex flex-col items-center">
              <CheckCircle2 size={56} className="text-success" />
              <h3 className="mt-4 font-display text-lg text-ink">
                Vote Successfully Cast
              </h3>
              <p className="font-body text-xs text-muted mt-1 text-center max-w-sm leading-relaxed">
                Your identity validation is complete. Your choices have been
                safely cataloged.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FaceVerificationModal;