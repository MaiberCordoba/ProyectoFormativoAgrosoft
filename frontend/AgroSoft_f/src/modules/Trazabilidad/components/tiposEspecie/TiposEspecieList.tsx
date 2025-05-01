import { useGetTiposEspecie } from "../../hooks/tiposEspecie/useGetTiposEpecie";
import { useEditarTiposEspecie } from "../../hooks/tiposEspecie/useEditarTiposEspecie";
import { useCrearTiposEspecie } from "../../hooks/tiposEspecie/useCrearTiposEspecie";
import { useEliminarTiposEspecie } from "../../hooks/tiposEspecie/useEliminarTiposEpecie";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarTiposEspecieModal from "./EditarTiposEspecieModal";
import { CrearTiposEspecieModal } from "./CrearTiposEspecieModal";
import EliminarTiposEspecieModal from "./EliminarTiposEspecie";
import { TiposEspecie } from "../../types";
import { Image } from "@heroui/react"; // ← Asegúrate de tener este importado

export function TiposEspecieList() {
  const { data, isLoading, error } = useGetTiposEspecie();

  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    TiposEspecieEditada, 
    handleEditar 
  } = useEditarTiposEspecie();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearTiposEspecie();
  
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    TiposEspecieEliminada,
    handleEliminar
  } = useEliminarTiposEspecie();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, nombre: "", descripcion: "", img: "" });
  };

  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "Imagen", uid: "img" }, // ← Añadida columna imagen
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: TiposEspecie, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "img":
        return (
          <Image
            isZoomed
            src={item.img}
            alt={item.nombre}
            className="w-14 h-14 object-cover rounded-lg border"
          />
        );
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof TiposEspecie])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los tipos de especie</p>;

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

      {isEditModalOpen && TiposEspecieEditada && (
        <EditarTiposEspecieModal
          especie={TiposEspecieEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearTiposEspecieModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && TiposEspecieEliminada && (
        <EliminarTiposEspecieModal
          especie={TiposEspecieEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
