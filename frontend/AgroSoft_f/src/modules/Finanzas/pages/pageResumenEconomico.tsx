import { useGetTiposEspecie } from "@/modules/Trazabilidad/hooks/tiposEspecie/useGetTiposEpecie";
import { CultivoResumenList } from "../components/finanzasCultivos/CultivoResumenList";
import { FiltrosCultivos } from "../components/finanzasCultivos/FiltrosCultivo";
import { useCultivoSelection } from "../hooks/finanzasCultivos/useCultivoSelection";
import { useResumenesEconomicos } from "../hooks/finanzasCultivos/useGetListResumenesEconomicos";
import { useGetEspecies } from "@/modules/Trazabilidad/hooks/especies/useGetEpecies";
import { useFiltrosCultivos } from "../hooks/finanzasCultivos/useFiltrosCultivo";
import { useFiltrarResumenes } from "../hooks/finanzasCultivos/usefitrarResumenes";
import { DetalleCultivoModal } from "../components/finanzasCultivos/DetalleCultivoModal";
import HistorialBeneficioCostoModal from "../components/finanzasCultivos/HistorialBeneficioCostoModal";
import { ResumenEconomicoListado } from "../types";
import { useState } from "react";
import { Button } from "@heroui/react";

const ResumenFinancieroPage = () => {
  // Obtener datos
  const { data: resumenes, isLoading } = useResumenesEconomicos();
  const { data: tiposEspecie } = useGetTiposEspecie();
  const { data: especies } = useGetEspecies();

  // Manejar filtros
  const {
    tipoEspecieId,
    especieId,
    fechaInicio,
    fechaFin,
    handleTipoEspecieChange,
    handleEspecieChange,
    handleFechaChange,
    resetFiltros,
  } = useFiltrosCultivos();

  // Filtrar resúmenes
  const resumenesFiltrados = useFiltrarResumenes(
    resumenes || [],
    tipoEspecieId,
    especieId,
    fechaInicio,
    fechaFin
  );

  // Manejar selección de cultivo
  const { selectedCultivo, isModalOpen, handleSelectCultivo, closeModal } =
    useCultivoSelection();

  const [showHistorialGlobal, setShowHistorialGlobal] = useState(false);
  const [selectedCultivoHistorial, setSelectedCultivoHistorial] = useState<{
    id?: number;
    nombre?: string;
  } | null>(null);

  // Nuevo handler
  const handleOpenHistorial = (cultivo?: ResumenEconomicoListado) => {
    if (cultivo) {
      setSelectedCultivoHistorial({
        id: cultivo.id,
        nombre: cultivo.nombre,
      });
    } else {
      setSelectedCultivoHistorial({}); // Modal en modo global
    }
    setShowHistorialGlobal(true);
  };

  return (
    <div className="pt-0 p-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resumen Financiero de Cultivos</h1>
        <Button color="primary" onPress={() => handleOpenHistorial()}>
          Ver Historial General
        </Button>
      </div>

      {/* Filtros */}
      <FiltrosCultivos
        tiposEspecie={tiposEspecie || []}
        especies={especies || []}
        tipoEspecieId={tipoEspecieId}
        especieId={especieId}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        onTipoEspecieChange={handleTipoEspecieChange}
        onEspecieChange={handleEspecieChange}
        onFechaChange={handleFechaChange}
        onReset={resetFiltros}
      />

      {/* Listado de cultivos */}
      <CultivoResumenList
        resumenes={resumenesFiltrados}
        loading={isLoading}
        onSelectCultivo={handleSelectCultivo}
        onOpenHistorial={handleOpenHistorial}
      />

      {/* Modal de detalle */}
      <DetalleCultivoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        cultivo={selectedCultivo}
      />

      <HistorialBeneficioCostoModal
        isOpen={showHistorialGlobal}
        onClose={() => {
          setShowHistorialGlobal(false);
          setSelectedCultivoHistorial(null);
        }}
        cultivoId={selectedCultivoHistorial?.id}
        cultivoNombre={selectedCultivoHistorial?.nombre}
        key={selectedCultivoHistorial?.id || "global"}
      />
    </div>
  );
};

export default ResumenFinancieroPage;
