import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SensorProvider } from "../context/SensorContext";

const queryClient = new QueryClient();

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SensorProvider>{children}</SensorProvider>
    </QueryClientProvider>
  );
};

export default Provider;
