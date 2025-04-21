import { useState } from "react";

export const useFiltrosCultivos = () => {
  const [tipoEspecieId, setTipoEspecieId] = useState<number | null>(null);
  const [especieId, setEspecieId] = useState<number | null>(null);

  const handleTipoEspecieChange = (id: number | null) => {
    setTipoEspecieId(id);
    setEspecieId(null); // Resetear especie cuando cambia el tipo
  };

  const handleEspecieChange = (id: number | null) => {
    setEspecieId(id);
  };

  const resetFiltros = () => {
    setTipoEspecieId(null);
    setEspecieId(null);
  };

  return {
    tipoEspecieId,
    especieId,
    handleTipoEspecieChange,
    handleEspecieChange,
    resetFiltros,
  };
};