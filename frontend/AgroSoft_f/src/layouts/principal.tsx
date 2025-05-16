import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Outlet } from "react-router-dom";

const Principal: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-48' : 'w-0'} fixed h-full z-30 transition-all duration-300`}>
        <Sidebar isOpen={isSidebarOpen} />
      </div>

      {/* Contenedor Principal */}
      <div className={`flex flex-col flex-1 ${isSidebarOpen ? 'ml-48' : 'ml-0'} transition-all duration-300`}>
        {/* Navbar */}
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        {/* Contenido Principal */}
        <main className="flex-1 pb-16 pt-0 relative"> {/* Agregamos relative para posicionar el overlay */}
          <div 
            className="absolute inset-0 bg-[url('../../public/fondo.jpg')] bg-cover bg-center bg-no-repeat bg-fixed opacity-90" 
            aria-hidden="true" 
          />

          {/* Overlay para oscurecer/transparentar el fondo */}
          <div className="absolute inset-0  backdrop" aria-hidden="true" />

          {/* Contenido principal con posición relativa y z-index para que aparezca sobre el fondo */}
          <div className="relative z-10 min-h-screen">
            <Outlet />
          </div>

          <div ref={sentinelRef} className="h-px w-full relative z-10" />
        </main>
      </div>

      {/* Footer - Versión corregida */}
      <div
        className={`fixed bottom-0 ${
          isSidebarOpen ? 'left-48' : 'left-0'
        } right-0 transition-all duration-300 ${
          isFooterVisible ? 'translate-y-0' : 'translate-y-full'
        } z-20`}
      >
        <Footer isSidebarOpen={isSidebarOpen}/>
      </div>
    </div>
  );
};

export default Principal;