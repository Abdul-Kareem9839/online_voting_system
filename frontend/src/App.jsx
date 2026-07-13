import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const LandingPage = lazy(() => import("./pages/landingPage/LandingPage.jsx"));
const VoterLogin = lazy(() => import("./pages/citizen/VoterLogin.jsx"));
const Register = lazy(
  () => import("./pages/citizen/registration/VoterRegister.jsx"),
);
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.jsx"));
const VoterDashboard = lazy(() => import("./pages/citizen/VoterDashboard.jsx"));
const AdminDashboard = lazy(
  () => import("./pages/admin/dashboard/AdminDashboard.jsx"),
);
const AddCandidate = lazy(
  () => import("./pages/admin/electionsTab/candidates/AddCandidate.jsx"),
);
const CandidatesList = lazy(
  () => import("./pages/admin/electionsTab/candidates/CandidatesList.jsx"),
);
const VotingInterface = lazy(
  () => import("./pages/citizen/electionTab/components/VotingInterface.jsx"),
);

function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="h-screen w-full grid place-items-center bg-[#EDEAE3] text-[#15191F]">
            Loading…
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/voters/login" element={<VoterLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/voters/dashboard" element={<VoterDashboard />} />
          <Route path="/admins/login" element={<AdminLogin />} />
          <Route path="/admins/dashboard" element={<AdminDashboard />} />
          <Route
            path="/admins/elections/:election_id/constituencies/:constituency_id/candidates/create"
            element={<AddCandidate />}
          />
          <Route
            path="/admins/elections/:election_id/constituencies/:constituency_id/candidates"
            element={<CandidatesList />}
          />
          <Route path="vote/:election_id" element={<VotingInterface />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
