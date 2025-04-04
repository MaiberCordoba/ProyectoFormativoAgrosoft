import { useGetCosechas } from "../../hooks/cosechas/useGetCosechas";
import { useEditarCosecha } from "../../hooks/cosechas/useEditarCosechas";
import { useCrearCosecha } from "../../hooks/cosechas/useCrearCosechas";
import { useEliminarCosecha } from "../../hooks/cosechas/useEliminarCosechas";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarCosechasModal from "./EditarCosechasModal";
import { CrearCosechasModal } from "./CrearCosechasModal";
import EliminarCosechasModal from "./EliminarCosechas";
import { Cosechas } from "../../types";
import { useGetCultivos } from "@/modules/Trazabilidad/hooks/cultivos/useGetCultivos";

export function CosechasList() {
  const { data, isLoading, error } = useGetCosechas();
    const { data : cultivo, isLoading: loadingCultivo } = useGetCultivos()
  
  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    cosechaEditada, 
    handleEditar 
  } = useEditarCosecha();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearCosecha();
  
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    cosechaEliminada,
    handleEliminar
  } = useEliminarCosecha();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fk_Cultivo: 0,unidades: 0, fecha: ""});
  };

  // Definición de columnas movida aquí
  const columnas = [
    { name: "Cultivo", uid: "cultivo"  },
    { name: "Unidades", uid: "unidades" },
    { name: "Fecha", uid: "fecha" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función de renderizado movida aquí
  const renderCell = (item: Cosechas, columnKey: React.Key) => {
    switch (columnKey) {
      case "cultivo":
        const cultivos = cultivo?.find((c) => c.id === item.fk_Cultivo);
        return <span>{cultivos ? cultivos.nombre : "No definido"}</span>;
      case "unidades":
        return <span>{item.unidades}</span>;
      case "fecha":
        return <span>{item.fecha}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Cosechas])}</span>;
    }
  };

  if (isLoading || loadingCultivo) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las Cosechas</p>;

  return (
    <div className="p-4">
      {/* Tabla reutilizable directa */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="fecha"
        placeholderBusqueda="Buscar por fecha"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && cosechaEditada && (
        <EditarCosechasModal
          cosecha={cosechaEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearCosechasModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && cosechaEliminada && (
        <EliminarCosechasModal
          cosecha={cosechaEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}