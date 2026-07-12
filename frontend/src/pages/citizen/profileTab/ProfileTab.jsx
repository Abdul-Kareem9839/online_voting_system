import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  User,
  Mail,
  MapPin,
  Shield,
  Calendar,
} from "lucide-react";

const ProfileTab = ({ data }) => {
  if (!data) return null;

  const { voter, stats } = data;
  const profileVoter = voter || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="dashboard-card">
        <div className="flex flex-col items-center text-center pb-6 border-b border-gray-200">
          <div className="relative">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileVoter.voter_name || "Voter")}&background=282824&color=f4f4f0`}
              alt="Voter Avatar"
              className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm"
            />
          </div>

          <h2 className="mt-4 font-display text-2xl text-ink">
            {profileVoter.voter_name || "Not Available"}
          </h2>

          <div className="flex items-center gap-1.5 mt-2">
            {profileVoter.face_registered ? (
              <CheckCircle2 size={16} className="text-success" />
            ) : (
              <XCircle size={16} className="text-accent" />
            )}
            <span
              className="font-body text-xs font-medium uppercase tracking-wider"
              style={{
                color: profileVoter.face_registered
                  ? "var(--sage)"
                  : "var(--red)",
              }}
            >
              {profileVoter.face_registered ? "Verified Voter" : "Not Verified"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-8">
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <User className="text-muted mt-0.5" size={18} />
              <div>
                <p className="font-body text-xs uppercase tracking-wide text-muted">
                  Full Name
                </p>
                <p className="font-body text-sm font-medium text-ink mt-0.5">
                  {profileVoter.voter_name || "Not Available"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-muted mt-0.5" size={18} />
              <div>
                <p className="font-body text-xs uppercase tracking-wide text-muted">
                  Email Address
                </p>
                <p className="font-body text-sm font-medium text-ink mt-0.5">
                  {profileVoter.email || "Not Available"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="text-muted mt-0.5" size={18} />
              <div>
                <p className="font-body text-xs uppercase tracking-wide text-muted">
                  Voter ID Number
                </p>
                <p className="font-body text-sm font-medium text-ink mt-0.5">
                  {profileVoter.voter_id_number || "Not Available"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <MapPin className="text-muted mt-0.5" size={18} />
              <div>
                <p className="font-body text-xs uppercase tracking-wide text-muted">
                  Constituency
                </p>
                <p className="font-body text-sm font-medium text-ink mt-0.5">
                  {profileVoter.constituency_name || "Not Assigned"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-muted mt-0.5" size={18} />
              <div>
                <p className="font-body text-xs uppercase tracking-wide text-muted">
                  Registration Date
                </p>
                <p className="font-body text-sm font-medium text-ink mt-0.5">
                  {profileVoter.registered_at
                    ? new Date(profileVoter.registered_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {profileVoter.face_registered ? (
                <CheckCircle2 size={18} className="text-success mt-0.5" />
              ) : (
                <XCircle size={18} className="text-accent mt-0.5" />
              )}
              <div>
                <p className="font-body text-xs uppercase tracking-wide text-muted">
                  Face Biometrics
                </p>
                <p
                  className="font-body text-sm font-medium mt-0.5"
                  style={{
                    color: profileVoter.face_registered
                      ? "var(--sage)"
                      : "var(--red)",
                  }}
                >
                  {profileVoter.face_registered
                    ? "Registered & Verified"
                    : "Pending Registration"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div
            className="rounded-lg p-4 flex items-start gap-3"
            style={{
              background: "var(--surface-alt)",
              borderLeft: profileVoter.face_registered
                ? "3px solid var(--sage)"
                : "3px solid var(--red)",
            }}
          >
            {profileVoter.face_registered ? (
              <CheckCircle2 className="text-success mt-0.5" size={20} />
            ) : (
              <XCircle className="text-accent mt-0.5" size={20} />
            )}
            <div>
              <h4 className="font-body font-semibold text-sm text-ink">
                {profileVoter.face_registered
                  ? "Secure Voting Enabled"
                  : "Face Biometrics Action Required"}
              </h4>
              <p className="font-body text-xs text-muted mt-1 leading-relaxed">
                {profileVoter.face_registered
                  ? "Your biometric face profile is actively synchronized. Identity credentials match security protocols."
                  : "Please complete your facial scan configuration step to authorize casting digital ballots."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-ink">
              Election Registrations
            </h3>
            <span className="font-body text-xs uppercase tracking-wide text-muted">
              {data?.elections?.length || 0} entries
            </span>
          </div>

          <div className="space-y-3">
            {(data?.elections || []).map((election) => (
              <div
                key={`${election.election_id}-${election.voter_id}`}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-body text-sm font-semibold text-ink">
                      {election.election_name}
                    </p>
                    <p className="font-body text-xs text-muted mt-1">
                      {election.constituency_name || "No constituency"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide"
                      style={{
                        background:
                          election.status === "ongoing"
                            ? "rgba(34, 197, 94, 0.12)"
                            : election.status === "completed"
                              ? "rgba(59, 130, 246, 0.12)"
                              : "rgba(245, 158, 11, 0.12)",
                        color:
                          election.status === "ongoing"
                            ? "var(--sage)"
                            : election.status === "completed"
                              ? "var(--blue)"
                              : "var(--amber)",
                      }}
                    >
                      {election.status || "upcoming"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm">
                  <div>
                    <p className="font-body text-[11px] uppercase tracking-wide text-muted">
                      Voter ID
                    </p>
                    <p className="font-body text-sm font-medium text-ink mt-1">
                      {election.voter_id_number || "Not Available"}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-[11px] uppercase tracking-wide text-muted">
                      Registration Date
                    </p>
                    <p className="font-body text-sm font-medium text-ink mt-1">
                      {election.registered_at
                        ? new Date(election.registered_at).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-[11px] uppercase tracking-wide text-muted">
                      Vote Status
                    </p>
                    <p className="font-body text-sm font-medium text-ink mt-1">
                      {election.has_voted ? "Voted" : "Not Voted"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileTab;
