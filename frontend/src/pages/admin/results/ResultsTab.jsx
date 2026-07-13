import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { API_URL } from "../../../../config/api";
import { apiFetch } from "../../../utils/apiFetch";
import ElectionResults from "./components/ElectionResults";
import ConstituencyResult from "./components/ConstituencyResult";
import ElectionCard from "./components/ElectionCard";

const ResultsTab = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedConstituency, setSelectedConstituency] = useState(null);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await apiFetch(`/admins/elections`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch elections");
        }

        setElections(data.elections);
      } catch (err) {
        alert(err.message);
      }
    };

    fetchElections();
  }, []);

  if (selectedConstituency) {
    return (
      <ConstituencyResult
        election={selectedElection}
        constituency={selectedConstituency}
        onBack={() => setSelectedConstituency(null)}
      />
    );
  }

  if (selectedElection) {
    return (
      <ElectionResults
        election={selectedElection}
        onBack={() => setSelectedElection(null)}
        onViewConstituency={setSelectedConstituency}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">
            Election Results
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Declare and manage election results
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {elections.map((election) => (
          <div key={election.election_id} className="flex flex-col h-full">
            <ElectionCard
              election={election}
              setSelectedElection={setSelectedElection}
            />

            {election.resultsDeclared && (
              <div className="mt-3 px-4 py-2.5 bg-surface-alt border border-light rounded-md flex items-center space-x-2 text-xs font-semibold text-success tracking-wide uppercase">
                <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
                <span>Results Officially Declared</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ResultsTab;
