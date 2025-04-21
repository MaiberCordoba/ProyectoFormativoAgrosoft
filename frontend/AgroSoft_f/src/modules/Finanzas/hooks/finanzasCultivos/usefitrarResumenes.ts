// hooks/useFiltrarResumenes.ts

import { useGetEspecies } from "@/modules/Trazabilidad/hooks/especies/useGetEpecies";
import { ResumenEconomicoListado } from "../../types";

export const useFiltrarResumenes = (
  resumenes: ResumenEconomicoListado[],
  tipoEspecieId: number | null,
  especieId: number | null
) => {
  const { data: especies } = useGetEspecies();

  const resumenesFiltrados = resumenes.filter((resumen) => {
    // Si no hay filtros, mostrar todo
    if (!tipoEspecieId && !especieId) return true;
    
    // Encontrar la especie correspondiente al nombre en el resumen
    const especie = especies?.find(e => e.nombre === resumen.nombre_especie);
    
    // Filtrar por tipo de especie si está seleccionado
    if (tipoEspecieId && (!especie || especie.fk_tipoespecie !== tipoEspecieId)) {
      return false;
    }
    
    // Filtrar por especie si está seleccionada
    if (especieId && (!especie || especie.id !== especieId)) {
      return false;
    }
    
    return true;
  });

  return resumenesFiltrados;
};