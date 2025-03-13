import { useState } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

const Principal: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex flex-col flex-1">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Principal;
