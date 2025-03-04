import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UsersPage } from "../modules/test/pages/userPage";

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/test" element={<UsersPage />} />
      </Routes>
    </Router>
  );
}
