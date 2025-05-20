import { useGetPlantaciones } from "../../hooks/plantaciones/useGetPlantaciones";
import { useEditarPlantaciones } from "../../hooks/plantaciones/useEditarPlantaciones";
import { useCrearPlantaciones } from "../../hooks/plantaciones/useCrearPlantaciones";
import { useEliminarPlantaciones } from "../../hooks/plantaciones/useEliminarPlantaciones";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarPlantacionModal from "./EditarPlantacionesModal";
import { CrearPlantacionModal } from "./CrearPlantacionesModal";
import EliminarPlantacionModal from "./EliminarPlantaciones";
import { Plantaciones } from "../../types";

// 🔽 Importaciones para el reporte PDF
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReportePdfPlantaciones } from "./ReportePdfPlantaciones";
import { Download } from "lucide-react";

export function PlantacionesList() {
  const { data, isLoading, error } = useGetPlantaciones();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    PlantacionesEditada,
    handleEditar,
  } = useEditarPlantaciones();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearPlantaciones();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    PlantacionesEliminada,
    handleEliminar,
  } = useEliminarPlantaciones();

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      fk_Cultivo: { nombre: "" },
      fk_semillero: { unidades: 0, fechasiembra: "" },
      fk_Era: { id: 0 },
    });
  };

  const columnas = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Cultivo", uid: "fk_Cultivo", sortable: true },
    { name: "Semillero", uid: "fk_semillero", sortable: false },
    { name: "Unidades", uid: "unidades", sortable: true },
    { name: "Fecha Siembra", uid: "fechasiembra", sortable: true },
    { name: "Era", uid: "fk_Era", sortable: true },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Plantaciones, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return <span>{item.id}</span>;
      case "fk_Cultivo":
        return <span>{item.fk_Cultivo?.nombre || "Sin nombre"}</span>;
      case "fk_semillero":
        return (
          <span>
            {item.fk_semillero
              ? `Semillero del cultivo: ${item.fk_Cultivo?.nombre}`
              : "No asignado"}
          </span>
        );
      case "unidades":
        return <span>{item.fk_semillero?.unidades ?? "N/A"}</span>;
      case "fechasiembra":
        return <span>{item.fk_semillero?.fechasiembra ?? "N/A"}</span>;
      case "fk_Era":
        return <span>{item.fk_Era?.id ?? "N/A"}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Plantaciones])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las plantaciones</p>;

  return (
    <div className="p-4 space-y-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="id"
        placeholderBusqueda="Buscar por ID"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
        // 🔽 Botón de reporte PDF
renderReporteAction={(data) => (
  <PDFDownloadLink
    document={<ReportePdfPlantaciones plantaciones={data} />}
    fileName="reporte_plantaciones.pdf"
  >
    {({ loading }) => (
      <button
        className="p-2 rounded-full hover:bg-red-100 transition-colors"
        title="Descargar reporte"
      >
        {loading ? (
          <Download className="h-4 w-4 animate-spin text-blue-500" />
        ) : (
          <Download className="h-5 w-5 text-red-600" />
        )}
      </button>
    )}
  </PDFDownloadLink>
)}

      />

      {isEditModalOpen && PlantacionesEditada && (
        <EditarPlantacionModal
          plantacion={PlantacionesEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearPlantacionModal onClose={closeCreateModal} />
      )}

      {isDeleteModalOpen && PlantacionesEliminada && (
        <EliminarPlantacionModal
          plantacion={PlantacionesEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
