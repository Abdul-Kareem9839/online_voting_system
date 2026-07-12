import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, Search, Clock, Vote } from "lucide-react";
import { API_URL } from "../../../../../config/api";
import ConstituencyCard from "./ConstituencyCard";

const ElectionResults = ({ election, onBack, onViewConstituency }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [constituencies, setConstituencies] = useState([]);

  useEffect(() => {
    const fetchConstituencies = async () => {
      try {
        const res = await fetch(
          `${API_URL}/admins/elections/${election.election_id}/constituencies`,
          {
            credentials: "include",
          },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        setConstituencies(data.constituencies);
      } catch (err) {
        alert(err.message);
      }
    };

    fetchConstituencies();
  }, [election.election_id]);

  const filteredConstituencies = constituencies.filter((c) =>
    c.constituency_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const declaredCount = constituencies.filter(
    (c) => c.status === "declared",
  ).length;

  const pendingCount = constituencies.filter(
    (c) => c.status !== "declared",
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg text-muted hover:text-ink hover:bg-surface-alt transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              {election.election_name}
            </h2>
            <p className="text-xs text-muted font-medium mt-0.5">
              View and manage constituency-wise results
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-5 bg-surface border-light">
          <h4 className="text-[10px] uppercase tracking-wider font-bold text-muted mb-2">
            Total Constituencies
          </h4>
          <p className="font-display text-3xl font-bold text-ink">
            {constituencies.length}
          </p>
        </div>

        <div className="card p-5 bg-surface border-light">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-[10px] uppercase tracking-wider font-bold text-muted mb-2">
                Declared
              </h4>
              <p className="font-display text-3xl font-bold text-success">
                {declaredCount}
              </p>
            </div>
            <div className="p-2 bg-surface-alt rounded-md border border-light/50 text-success">
              <CheckCircle size={14} />
            </div>
          </div>
        </div>

        <div className="card p-5 bg-surface border-light">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-[10px] uppercase tracking-wider font-bold text-muted mb-2">
                Pending
              </h4>
              <p className="font-display text-3xl font-bold text-accent-gold">
                {pendingCount}
              </p>
            </div>
            <div className="p-2 bg-surface-alt rounded-md border border-light/50 text-accent-gold">
              <Clock size={14} />
            </div>
          </div>
        </div>

        <div className="card p-5 bg-surface border-light">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-[10px] uppercase tracking-wider font-bold text-muted mb-2">
                Total Votes Casted
              </h4>
              <p className="font-display text-3xl font-bold text-ink font-mono">
                {election.electionTurnout?.votesCast?.toLocaleString("en-IN") ||
                  0}
              </p>
            </div>
            <div className="p-2 bg-surface-alt rounded-md border border-light/50 text-ink">
              <Vote size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Search Block */}
      <div className="card p-4 bg-surface border-light">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            placeholder="Search constituency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-xs bg-surface-alt border border-light rounded-md text-ink placeholder-muted/70 focus:outline-none focus:border-ink transition-colors font-medium"
          />
        </div>
      </div>

      {/* Constituencies  Grid */}
      {filteredConstituencies.map((constituency) => {
        const isDeclared = constituency.status === "declared";
        return (
          <ConstituencyCard
            key={constituency.constituency_id}
            constituency={constituency}
            isDeclared={isDeclared}
            onViewConstituency={onViewConstituency}
          />
        );
      })}
    </motion.div>
  );
};

export default ElectionResults;
