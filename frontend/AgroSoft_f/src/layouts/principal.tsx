import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Outlet } from "react-router-dom";

const Principal: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Configuración Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Margen negativo para detectar antes
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
      <div className={`${isSidebarOpen ? 'w-48' : 'w-0'} fixed h-full z-20 transition-all duration-300`}>
        <Sidebar isOpen={isSidebarOpen} />
      </div>

      {/* Contenedor Principal */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-48' : 'ml-0'}`}>
        {/* Navbar */}
        <div className="sticky top-0 z-10">
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        {/* Contenido Principal */}
        <main className="flex-1 pb-16"> {/* Padding para el footer */}
          <div className="p-6">
            <Outlet />
          </div>
          {/* Sentinel (detector invisible) */}
          <div ref={sentinelRef} className="h-px w-full" />
        </main>
      </div>

      {/* Footer (siempre visible pero con transición) */}
      <div
        ref={footerRef}
        className={`fixed bottom-0 left-0 right-0 transition-transform duration-500 ${
          isSidebarOpen ? 'ml-48' : 'ml-0'
        } ${
          isFooterVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <Footer isSidebarOpen={isSidebarOpen} />
      </div>
    </div>
  );
};

export default Principal;