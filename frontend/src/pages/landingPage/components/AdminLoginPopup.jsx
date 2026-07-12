import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, X, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminLoginPopup = ({ isOpen, onClose, targetRoute }) => {
  const navigate = useNavigate();

  const handleProceed = () => {
    onClose();
    navigate(targetRoute);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-body">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1C2541]/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden p-6 rounded-xl shadow-xl"
            style={{ background: "#FAF8F3", border: "1px solid #D8D4C8" }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 transition-opacity hover:opacity-60"
              style={{ color: "#6B6A63" }}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div
                className="p-2 rounded-lg border"
                style={{ background: "#FAF4EC", borderColor: "#E5DCC6" }}
              >
                <ShieldAlert className="w-5 h-5" style={{ color: "#9C2B2B" }} />
              </div>
              <h3
                className="font-display text-xl font-medium"
                style={{ color: "#1C2541" }}
              >
                Admin Security Gateway
              </h3>
            </div>

            <div className="space-y-4 text-sm leading-relaxed">
              <p className="font-medium font-body" style={{ color: "#1C2541" }}>
                This portal is strictly reserved for Authorized Personnel and
                System Administrators.
              </p>

              <div
                className="space-y-3 p-4 rounded-lg border"
                style={{ background: "#FFFFFF", borderColor: "#D8D4C8" }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-wider font-body"
                  style={{ color: "#9C2B2B" }}
                >
                  Before proceeding, verify that:
                </p>
                <ul
                  className="space-y-2 text-xs font-body"
                  style={{ color: "#6B6A63" }}
                >
                  <li className="flex items-start space-x-2">
                    <ShieldCheck
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: "#5C7461" }}
                    />
                    <span>
                      You have been explicitly authorized by the Super
                      Administrator.
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ShieldCheck
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: "#5C7461" }}
                    />
                    <span>
                      You possess an active, valid administrative credential
                      identifier (Admin ID).
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ShieldCheck
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: "#5C7461" }}
                    />
                    <span>
                      Your localized admin profile parameters have already been
                      provisioned.
                    </span>
                  </li>
                </ul>
              </div>

              <p
                className="text-xs rounded-lg p-3 leading-normal font-body border"
                style={{
                  background: "#FAF4EC",
                  borderColor: "#E5DCC6",
                  color: "#6B6A63",
                }}
              >
                If you are not a registered administrator, please cancel
                immediately and planetary{" "}
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=abdulkareem98979897@gmail.com&su=Admin%20Gateway%20Access%20Request&body=Hello%20Super%20Admin%2C%0A%0APlease%20provision%20the%20following%20admin%20account%3A%0A%0AName%3A%20%5BYour%20Name%5D%0AAdmin%20ID%3A%20%5BDesired%20Admin%20ID%5D%0AEmail%3A%20%5Byour.email%40example.com%5D%0AReason%3A%20%5BWhy%20you%20need%20access%5D%0A%0APlease%20provide%20login%20details%20or%20a%20secure%20setup%20link.%0A%0AThank%20you%2C%0A%5BYour%20Name%5D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline transition-opacity hover:opacity-70"
                  style={{ color: "#9C2B2B" }}
                >
                  contact the Super Admin
                </a>{" "}
                for account registration. Access attempts are monitored under
                the Digital Voting Act.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded text-sm font-body font-medium transition-opacity hover:opacity-70"
                style={{ color: "#6B6A63" }}
              >
                Cancel
              </button>

              <button
                onClick={handleProceed}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-body font-medium transition-opacity active:scale-95"
                style={{ background: "#1C2541", color: "#EDEAE3" }}
              >
                <span>Proceed to Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminLoginPopup;
