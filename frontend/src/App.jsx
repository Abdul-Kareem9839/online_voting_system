import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage/LandingPage.jsx";
import VoterLogin from "./pages/citizen/VoterLogin.jsx";
import Register from "./pages/citizen/registration/VoterRegister.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import VoterDashboard from "./pages/citizen/VoterDashboard.jsx";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import AddCandidate from "./pages/admin/electionsTab/candidates/AddCandidate.jsx";
import CandidatesList from "./pages/admin/electionsTab/candidates/CandidatesList.jsx";
import VotingInterface from "./pages/citizen/electionTab/components/VotingInterface.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/voters/login" element={<VoterLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/voters/dashboard" element={<VoterDashboard />} />
        <Route path="/admins/login" element={<AdminLogin />} /> */
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
    </Router>
  );
}

export default App;
