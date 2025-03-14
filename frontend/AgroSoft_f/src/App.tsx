import { Route, Routes } from "react-router-dom";
import Principal from "@/layouts/principal";
import { Inicio } from "./pages/Inicio";
import IoTPage from "./modules/IoT/pages/IoTPage";
import SensorDetail from "./modules/IoT/pages/SensorDetail";

function App() {
  return (
    <Routes>
      <Route element={<Principal />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/iot" element={<IoTPage />} />
        <Route path="/iot/sensor/:id" element={<SensorDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
