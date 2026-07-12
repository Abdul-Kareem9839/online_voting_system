import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config/api";
import {
  User,
  BarChart3,
  Vote,
  FileText,
  Shield,
  AlertCircle,
} from "lucide-react";
import OverviewTab from "./overviewTab/OverviewTab.jsx";
import ElectionsTab from "./electionTab/ElectionsTab.jsx";
import HistoryTab from "./HistoryTab.jsx";
import ProfileTab from "./profileTab/ProfileTab.jsx";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

const VoterDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      component: <OverviewTab data={data} />,
    },
    {
      id: "elections",
      label: "My Elections",
      icon: Vote,
      component: <ElectionsTab data={data} loading={loading} />,
    },
    {
      id: "history",
      label: "Voting History",
      icon: FileText,
      component: <HistoryTab data={data} />,
    },
    {
      id: "profile",
      label: "My Profile",
      icon: User,
      component: <ProfileTab data={data} loading={loading} />,
    },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/voters/login");
          return;
        }

        const data = await res.json();
      } catch (err) {
        navigate("/voters/login");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/voters/dashboard`, {
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();

          throw new Error(
            errorData.message || "Failed to fetch dashboard data",
          );
        }

        const data = await response.json();

        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Error Loading Dashboard
          </h2>

          <p className="text-gray-600 mb-4">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data || !data.elections?.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No Elections Found
          </h2>

          <p className="text-gray-600">
            This email is not registered in any election.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header voterData={data.voter} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Sidebar
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            data={data}
          />

          <div className="lg:col-span-3">
            {tabs.find((tab) => tab.id === activeTab)?.component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoterDashboard;
