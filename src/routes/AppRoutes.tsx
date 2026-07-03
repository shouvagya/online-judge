import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProblemsPage from "../pages/ProblemsPage";
import ProblemPage from "../pages/ProblemPage";
import ContestsPage from "../pages/ContestsPage";
import ContestPage from "../pages/ContestPage";
import SubmissionsPage from "../pages/SubmissionsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/problems"
          element={<ProblemsPage />}
        />

        <Route
          path="/problems/:slug"
          element={<ProblemPage />}
        />

        <Route
          path="/contests"
          element={<ContestsPage />}
        />

        <Route
          path="/contests/:id"
          element={<ContestPage />}
        />

        <Route
          path="/submissions"
          element={<SubmissionsPage />}
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;