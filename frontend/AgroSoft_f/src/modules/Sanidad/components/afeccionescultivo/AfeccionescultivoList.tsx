import { useGetAfeccionesCultivo } from "../../hooks/afeccionescultivo/useGetAfeccionescultivo";
import { useEditarAfeccionCultivo } from "../../hooks/afeccionescultivo/useEditarAfeccionescultivo";
import { useCrearAfeccionCultivo } from "../../hooks/afeccionescultivo/useCrearAfeccionescultivo";
import { useEliminarAfeccionCultivo } from "../../hooks/afeccionescultivo/useEliminarAfeccionescultivo";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarAfeccionCultivoModal from "./EditarAfeccionescultivoModal";
import { CrearAfeccionCultivoModal } from "./CrearAfeccionescultivoModal";
import EliminarAfeccionCultivoModal from "./EliminarAfeccionescultivo";
import { AfeccionesCultivo } from "../../types";

export function AfeccionesCultivoList() {
  const { data, isLoading, error } = useGetAfeccionesCultivo();
  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    afeccionCultivoEditada, 
    handleEditar 
  } = useEditarAfeccionCultivo();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearAfeccionCultivo();
  
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    afeccionCultivoEliminada,
    handleEliminar
  } = useEliminarAfeccionCultivo();

  const handleCrearNuevo = () => {
    handleCrear({ fk_Plantacion: 0, fk_Plaga: 0, fechaEncuentro: "", estado: "" });
  };

  const columnas = [
    { name: "Plantación", uid: "fk_Plantacion", sortable: true },
    { name: "Plaga", uid: "fk_Plaga" },
    { name: "Fecha Encuentro", uid: "fechaEncuentro" },
    { name: "Estado", uid: "estado" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: AfeccionesCultivo, columnKey: React.Key) => {
    switch (columnKey) {
      case "fk_Plantacion":
        return <span>{item.fk_Plantacion || "No definido"}</span>;
      case "fk_Plaga":
        return <span>{item.fk_Plaga || "No definido"}</span>;
      case "fechaEncuentro":
        return <span>{item.fechaEncuentro}</span>;
      case "estado":
        return <span>{item.estado}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof AfeccionesCultivo])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las afecciones cultivo</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="fk_Plaga"
        placeholderBusqueda="Buscar por plaga"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && afeccionCultivoEditada && (
        <EditarAfeccionCultivoModal
        afeccionCultivo={afeccionCultivoEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearAfeccionCultivoModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && afeccionCultivoEliminada && (
        <EliminarAfeccionCultivoModal
        afeccioncultivo={afeccionCultivoEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}