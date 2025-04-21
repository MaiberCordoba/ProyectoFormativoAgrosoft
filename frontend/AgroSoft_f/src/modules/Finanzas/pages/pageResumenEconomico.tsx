import { useGetTiposEspecie } from "@/modules/Trazabilidad/hooks/tiposEspecie/useGetTiposEpecie";
import { CultivoResumenList } from "../components/finanzasCultivos/CultivoResumenList";
import { FiltrosCultivos } from "../components/finanzasCultivos/FiltrosCultivo";
import { useCultivoSelection } from "../hooks/finanzasCultivos/useCultivoSelection";
import { useResumenesEconomicos } from "../hooks/finanzasCultivos/useGetListResumenesEconomicos";
import { useGetEspecies } from "@/modules/Trazabilidad/hooks/especies/useGetEpecies";
import { useFiltrosCultivos } from "../hooks/finanzasCultivos/useFiltrosCultivo";
import { useFiltrarResumenes } from "../hooks/finanzasCultivos/usefitrarResumenes";
import { DetalleCultivoModal } from "../components/finanzasCultivos/DetalleCultivoModal";

const ResumenFinancieroPage = () => {
   // Obtener datos
   const { data: resumenes, isLoading } = useResumenesEconomicos();
   const { data: tiposEspecie } = useGetTiposEspecie();
   const { data: especies } = useGetEspecies();
 
   // Manejar filtros
   const {
     tipoEspecieId,
     especieId,
     handleTipoEspecieChange,
     handleEspecieChange,
     resetFiltros,
   } = useFiltrosCultivos();
 
   // Filtrar resúmenes
   const resumenesFiltrados = useFiltrarResumenes(
     resumenes || [],
     tipoEspecieId,
     especieId
   );
 
   // Manejar selección de cultivo
   const {
    selectedCultivo,
    isModalOpen,
    handleSelectCultivo,
    closeModal,
  } = useCultivoSelection();
 
   return (
     <div className="p-4">
       <h1 className="text-2xl font-bold mb-6 text-center">Resumen Financiero de Cultivos</h1>
       
       {/* Filtros */}
       <FiltrosCultivos
         tiposEspecie={tiposEspecie || []}
         especies={especies || []}
         tipoEspecieId={tipoEspecieId}
         especieId={especieId}
         onTipoEspecieChange={handleTipoEspecieChange}
         onEspecieChange={handleEspecieChange}
         onReset={resetFiltros}
       />
       
       {/* Listado de cultivos */}
       <CultivoResumenList 
         resumenes={resumenesFiltrados} 
         loading={isLoading}
         onSelectCultivo={handleSelectCultivo}
       />
       
       {/* Modal de detalle */}
       <DetalleCultivoModal
         isOpen={isModalOpen}
         onClose={closeModal}
         cultivo={selectedCultivo}
       />
     </div>
  );
};

export default ResumenFinancieroPage;