import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemPage from "./pages/ProblemPage";
import SubmissionsPage from "./pages/SubmissionsPage";
import SubmissionDetailsPage from "./pages/SubmissionDetailsPage";
import ContestsPage from "./pages/ContestsPage";
import ContestPage from "./pages/ContestPage";
import LeaderboardPage from "./pages/LeaderboardPage";


function App() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl p-6">
        <Routes>

          <Route path="/contests/:id/leaderboard" element={<LeaderboardPage />}/>

          <Route path="/contests/:id" element={<ContestPage />}/>

          <Route path="/contests" element={<ContestsPage />}/>

          <Route path="/submissions/:id" element={<SubmissionDetailsPage />} />

          <Route path="/" element={<ProblemsPage />} />

          <Route path="/problems" element={<ProblemsPage />} />

          <Route path="/problems/:slug" element={<ProblemPage />} />

          <Route path="/submissions" element={<SubmissionsPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />
          
        </Routes>
      </main>
    </>
  );
}

export default App;