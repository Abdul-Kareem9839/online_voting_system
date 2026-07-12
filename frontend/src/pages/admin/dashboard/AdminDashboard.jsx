import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Vote, Users, TrendingUp } from "lucide-react";
import { API_URL } from "../../../../config/api";
import OverviewTab from "../overviewTab/OverviewTab.jsx";
import ElectionsTab from "../electionsTab/ElectionsTab.jsx";
import ResultsTab from "../results/ResultsTab.jsx";
import AdminProfile from "../adminProfile/AdminProfile.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (res.status === 401) return;

        const data = await res.json();

        if (data.user?.role == "admin") {
          navigate("/admins/dashboard");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/admins/dashboard`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch admin data");
        }

        setAdminData(data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      component: <OverviewTab data={adminData} onTabChange={setActiveTab} />,
    },
    {
      id: "elections",
      label: "Elections",
      icon: Vote,
      component: <ElectionsTab data={adminData} />,
    },

    {
      id: "results",
      label: "Results",
      icon: TrendingUp,
      component: <ResultsTab />,
    },
    {
      id: "admin",
      label: "Admin Profile",
      icon: Users,
      component: <AdminProfile data={adminData} />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header adminData={adminData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Sidebar
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Main Content */}
          <div className="lg:col-span-3">
            {tabs.find((tab) => tab.id === activeTab)?.component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
