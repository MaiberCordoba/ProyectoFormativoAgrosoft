import React from "react";

interface FooterProps {
  isSidebarOpen: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isSidebarOpen }) => {
  return (
    <footer className="bg-white border-t border-gray-200 p-4 w-full">
      <div className={`mx-auto flex justify-between items-center ${isSidebarOpen ? 'max-w-[calc(100%-14rem)]' : 'max-w-full'}`}>
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} Agrosoft - SENA
        </p>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
            Términos
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
            Privacidad
          </a>
        </div>
      </div>
    </footer>
  );
};