import { useState } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Outlet } from "react-router-dom";

const Principal: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar con scroll independiente */}
      <div 
        className={`
          ${isSidebarOpen ? 'w-56' : 'w-0'} 
          fixed h-full z-10 
          transition-all duration-300
          overflow-y-auto 
          sidebar-scroll
        `}
      >
        <Sidebar isOpen={isSidebarOpen} />
      </div>
      
      {/* Contenedor Principal */}
      <div className={`flex flex-col flex-1 h-full ${isSidebarOpen ? 'ml-56' : 'ml-0'} transition-all duration-300`}>
        {/* Navbar */}
        <div className="sticky top-0 z-10">
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>
      
        {/* Contenido principal con scroll */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="min-h-[calc(100vh-112px)] p-6">
            <Outlet />
          </div>
          <Footer isSidebarOpen={isSidebarOpen} />
        </main>
      </div>
    </div>
  );
};

export default Principal;