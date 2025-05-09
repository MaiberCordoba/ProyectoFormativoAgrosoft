import { useGetCultivos } from "../../hooks/cultivos/useGetCultivos";
import { useEditarCultivos } from "../../hooks/cultivos/useEditarCultivos";
import { useCrearCultivos } from "../../hooks/cultivos/useCrearCultivos";
import { useEliminarCultivos } from "../../hooks/cultivos/useEliminarCultivos";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarCultivoModal from "./EditarCultivosModal";
import { CrearCultivoModal } from "./CrearCultivosModal";
import EliminarCultivoModal from "./EliminarCultivo";
import { Cultivo } from "../../types";

export function CultivosList() {
  const { data: cultivos, isLoading, error } = useGetCultivos();

  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    CultivosEditada, 
    handleEditar 
  } = useEditarCultivos();

  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearCultivos();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    CultivosEliminada,
    handleEliminar
  } = useEliminarCultivos();

  const handleCrearNuevo = () => {
    handleCrear({
      nombre: "",
      activo: true,
      fk_Especie: { nombre: "" },
    });
  };

  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Especie", uid: "especies", sortable: false }, // corregido
    { name: "Activo", uid: "activo", sortable: true },
    { name: "Acciones", uid: "acciones" },
  ];
  
  const renderCell = (item: Cultivo, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "especies":
        return <span>{item.especies?.nombre || "Sin especie"}</span>;
      case "activo":
        return <span>{item.activo ? "Activo" : "Inactivo"}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Cultivo])}</span>;
    }
  };
  

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los cultivos</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={cultivos || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por Nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && CultivosEditada && (
        <EditarCultivoModal
          cultivo={CultivosEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearCultivoModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && CultivosEliminada && (
        <EliminarCultivoModal
          cultivo={CultivosEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
