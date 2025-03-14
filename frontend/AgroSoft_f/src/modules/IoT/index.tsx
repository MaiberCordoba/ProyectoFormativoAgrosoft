import { Outlet } from "react-router-dom";

const Principal = () => {
  return (
    <div>
      <h1>Aplicación IoT</h1>
      <Outlet />
    </div>
  );
};

export default Principal;
