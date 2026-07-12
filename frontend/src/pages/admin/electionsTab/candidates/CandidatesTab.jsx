// components/admin/CandidatesTab.jsx
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Eye,
  User,
  Shield,
  FileText,
} from "lucide-react";

const CandidatesTab = () => {
  const getStatusConfig = (status) => {
    const config = {
      approved: {
        color: "green",
        label: "Approved",
        icon: <CheckCircle className="h-4 w-4" />,
      },
      pending: {
        color: "orange",
        label: "Pending Review",
        icon: <FileText className="h-4 w-4" />,
      },
      rejected: {
        color: "red",
        label: "Rejected",
        icon: <XCircle className="h-4 w-4" />,
      },
    };
    return config[status] || config.pending;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Candidate Management
          </h2>
          <p className="text-gray-600">
            Review and approve candidate applications
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Candidates</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => {
          const statusConfig = getStatusConfig(candidate.status);

          return (
            <motion.div
              key={candidate.id}
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {candidate.name}
                  </h3>
                  <p className="text-sm text-gray-600">{candidate.party}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-2" />
                  {candidate.constituency}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Manifesto:</strong> {candidate.manifesto}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Documents:</strong> {candidate.documents.length} files
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    statusConfig.color === "green"
                      ? "bg-green-100 text-green-800"
                      : statusConfig.color === "orange"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {statusConfig.icon}
                  <span className="ml-1">{statusConfig.label}</span>
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(candidate.registrationDate).toLocaleDateString()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>Review</span>
                </button>

                {candidate.status === "pending" && (
                  <>
                    <button className="p-2 text-green-600 hover:text-green-900 transition-colors">
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-red-600 hover:text-red-900 transition-colors">
                      <XCircle className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Candidate Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {candidates.length}
            </div>
            <div className="text-sm text-blue-600">Total Candidates</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {candidates.filter((c) => c.status === "pending").length}
            </div>
            <div className="text-sm text-orange-600">Pending Review</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {candidates.filter((c) => c.status === "approved").length}
            </div>
            <div className="text-sm text-green-600">Approved</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {candidates.filter((c) => c.status === "rejected").length}
            </div>
            <div className="text-sm text-red-600">Rejected</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CandidatesTab;
