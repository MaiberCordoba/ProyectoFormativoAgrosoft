import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const Principal = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Principal;

