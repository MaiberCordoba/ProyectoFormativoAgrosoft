import { CosechasResumenCard } from "../CardFinanzas";
import { VentasList } from "../components/ventas/VentasList";
import { useQuery } from "@tanstack/react-query";

export function Ventas() {
  const { data: cosechas = [], isLoading } = useQuery({
    queryKey: ['cosechas'],
    queryFn: () => fetch("http://127.0.0.1:8000/api/cosechas").then((res) => res.json())
  });

  return (
    <div className="p-4">
      {isLoading ? (
        <p>Cargando cosechas...</p>
      ) : (
        <CosechasResumenCard cosechas={cosechas} />
      )}
      <VentasList />
    </div>
  );
}
