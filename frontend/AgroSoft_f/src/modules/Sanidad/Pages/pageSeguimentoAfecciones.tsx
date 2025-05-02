import { useGetTiposEspecie } from "@/modules/Trazabilidad/hooks/tiposEspecie/useGetTiposEpecie";
import { useGetEspecies } from "@/modules/Trazabilidad/hooks/especies/useGetEpecies";
import { useControles } from "../hooks/seguimientoafecciones/useGetControles";
import { useFiltrosControles } from "../hooks/seguimientoAfecciones/useFiltrosControles";
import { useControlSelection } from "../hooks/seguimientoAfecciones/useControlSelection";
import { useFiltrarControles } from "../hooks/seguimientoAfecciones/useFiltrarControles";
import { FiltrosControles } from "../components/seguimientoAfecciones/FiltrosControles";
import { ControlResumenList } from "../components/seguimientoAfecciones/ControlResumenList";
import { DetalleControlModal } from "../components/seguimientoAfecciones/DetalleControlModal";

const SeguimientoAfeccionesPage = () => {
  // Obtener datos
  const { data: controles, isLoading } = useControles();
  const { data: tiposEspecie } = useGetTiposEspecie();
  const { data: especies } = useGetEspecies();

  // Manejar filtros
  const {
    tipoEspecieId,
    especieId,
    fechaInicio,
    fechaFin,
    plagaNombre,
    handleTipoEspecieChange,
    handleEspecieChange,
    handleFechaChange,
    handlePlagaNombreChange,
    resetFiltros,
  } = useFiltrosControles();

  // Filtrar controles
  const controlesFiltrados = useFiltrarControles(
    controles || [],
    tipoEspecieId,
    especieId,
    fechaInicio,
    fechaFin,
    plagaNombre
  );

  // Manejar selección de control
  const {
    selectedControl,
    isModalOpen,
    handleSelectControl,
    closeModal,
  } = useControlSelection();

  return (
    <div className="pt-0 p-2">
      <h1 className="text-2xl font-bold mb-6 text-center">Seguimiento de Afecciones</h1>

      {/* Filtros */}
      <FiltrosControles
        tiposEspecie={tiposEspecie || []}
        especies={especies || []}
        tipoEspecieId={tipoEspecieId}
        especieId={especieId}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        plagaNombre={plagaNombre}
        onTipoEspecieChange={handleTipoEspecieChange}
        onEspecieChange={handleEspecieChange}
        onFechaChange={handleFechaChange}
        onPlagaNombreChange={handlePlagaNombreChange}
        onReset={resetFiltros}
      />

      {/* Listado de controles */}
      <ControlResumenList
        controles={controlesFiltrados}
        loading={isLoading}
        onSelectControl={handleSelectControl}
      />

      {/* Modal de detalle */}
      <DetalleControlModal
        isOpen={isModalOpen}
        onClose={closeModal}
        control={selectedControl}
      />
    </div>
  );
};

export default SeguimientoAfeccionesPage;