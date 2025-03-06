import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


import { UsersPage } from "./modules/test/pages/userPage";
import Principal from "@/layouts/principal";

const queryClient = new QueryClient(); // Crea la instancia de QueryClient

function App() {
  return (

    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<Principal />}>
          <Route path="/" element={<UsersPage />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
