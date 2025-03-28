import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import { useEditarEspecies } from "../../hooks/especies/useEditarEspecies";
import { useCrearEspecies } from "../../hooks/especies/useCrearEspecies";
import { useEliminarEspecies } from "../../hooks/especies/useEliminarEpecies";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarEspecieModal from "./EditarEspecieModal";
import { CrearEspecieModal } from "./CrearEspecieModal";
import EliminarEspecieModal from "./EliminarEspecie";
import { Especies } from "../../types";

export function EspecieList() {
  const { data, isLoading, error } = useGetEspecies();
  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    EspeciesEditada, 
    handleEditar 
  } = useEditarEspecies();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearEspecies();
  
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    EspeciesEliminada,
    handleEliminar
  } = useEliminarEspecies();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fk_TiposEspecie: 0, nombre: "", descripcion: "", img: "", tiempocrecimiento: 0 });
  };

  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "Tiempo de Crecimiento (días)", uid: "tiempoCrecimiento", sortable: true },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Especies, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "tiempoCrecimiento":
        return <span>{item.tiempocrecimiento} días</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Especies])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las especies</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && EspeciesEditada && (
        <EditarEspecieModal
          especie={EspeciesEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearEspecieModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && EspeciesEliminada && (
        <EliminarEspecieModal
          especie={EspeciesEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
