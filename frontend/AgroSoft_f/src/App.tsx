import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { UsersPage } from "./modules/Users/pages/userPage";
import Principal from "@/layouts/principal";
import { Inicio } from "./pages/Inicio";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Login from "@/pages/Login";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route element={<Principal />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Inicio />} />
              <Route path="/usuarios" element={<UsersPage />} />
            </Route>
          </Route>
        </Routes>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
