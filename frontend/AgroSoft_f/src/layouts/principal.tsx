import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Outlet } from "react-router-dom";

const Principal: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Nuevo estado para menú móvil
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
    <div className="flex flex-col min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Sidebar para desktop */}
      <div className={`
        fixed h-full z-30 transition-all duration-300
        ${isSidebarOpen ? 'w-48' : 'w-0 -translate-x-full'}
        hidden md:block
      `}>
        <Sidebar isOpen={isSidebarOpen} />
      </div>

      {/* Sidebar móvil con overlay */}
      <div className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity
        ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar móvil */}
      <div className={`
        md:hidden fixed h-full z-50 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64
      `}>
        <Sidebar isOpen={true} />
      </div>

      {/* Contenedor Principal */}
      <div className={`
        flex flex-col flex-1
        transition-all duration-300
        ${isSidebarOpen ? 'md:ml-48' : 'ml-0'}
        min-w-0
      `}>
        {/* Navbar con menú móvil */}
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          <Navbar 
            toggleSidebar={() => {
              setIsSidebarOpen(!isSidebarOpen);
              setIsMobileMenuOpen(false); // Cerrar menú móvil al abrir sidebar
            }}
            onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isMobileMenuOpen={isMobileMenuOpen}
          />
        </div>

        {/* Contenido Principal */}
        <main className="flex-1 pb-16 pt-0 relative">
          <div 
            className="fixed inset-0 bg-[url('../../public/fondo.jpg')] 
              bg-cover bg-center bg-no-repeat opacity-90 " 
            aria-hidden="true"
          />

          <div className="relative z-10 min-h-screen">
            <div className="max-w-full overflow-x-hidden">
              <Outlet />
            </div>
          </div>

          <div ref={sentinelRef} className="h-px w-full relative z-10" />
        </main>
      </div>

      {/* Footer */}
      <div
        className={`
          fixed bottom-0 right-0 left-0
          transition-transform duration-300
          ${isFooterVisible ? 'translate-y-0' : 'translate-y-full'}
          ${isSidebarOpen ? 'md:left-48' : 'left-0'}
          z-20
        `}
      >
        <Footer isSidebarOpen={isSidebarOpen}/>
      </div>
    </div>
  );
};

export default Principal;