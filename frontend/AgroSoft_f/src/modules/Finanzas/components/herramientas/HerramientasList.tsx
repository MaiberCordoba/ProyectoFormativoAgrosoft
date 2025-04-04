import { useGetHerramientas } from "../../hooks/herramientas/useGetHerramientas";
import { useEditarHerramienta } from "../../hooks/herramientas/useEditarHerramientas";
import { useCrearHerramienta } from "../../hooks/herramientas/useCrearHerramientas";
import { useEliminarHerramienta } from "../../hooks/herramientas/useEliminarHerramientas";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarHerramientasModal from "./EditarHerramientasModal";
import { CrearHerramientasModal } from "./CrearHerramientasModal";
import EliminarHerramientaModal from "./EliminarHerramientas";
import { Herramientas } from "../../types";
import { useGetLotes } from "@/modules/Trazabilidad/hooks/lotes/useGetLotes";

export function HerramientasList() {
  const { data, isLoading, error } = useGetHerramientas();
  const { data : lotes, isLoading : loadingLotes } = useGetLotes();

  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    herramientaEditada, 
    handleEditar 
  } = useEditarHerramienta();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearHerramienta();
  
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    herramientaEliminada,
    handleEliminar
  } = useEliminarHerramienta();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fk_Lote: 0, nombre: "", descripcion: "", unidades: 0 });
  };

  // Definición de columnas movida aquí
  const columnas = [
    { name: "Lote", uid: "lote"  },
    { name: "Nombre", uid: "nombre" },
    { name: "Descripcion", uid: "descripcion" },
    { name: "Unidades", uid: "unidades" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función de renderizado movida aquí
  const renderCell = (item: Herramientas, columnKey: React.Key) => {
    switch (columnKey) {
      case "lote":
        const lote = lotes?.find((c) => c.id === item.fk_Lote);
        return <span>{lote ? lote.nombre : "No definido"}</span>;
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "unidades":
        return <span>{item.unidades}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Herramientas])}</span>;
    }
  };

  if (isLoading || loadingLotes) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las herramientas</p>;

  return (
    <div className="p-4">
      {/* Tabla reutilizable directa */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && herramientaEditada && (
        <EditarHerramientasModal
          herramienta={herramientaEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearHerramientasModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && herramientaEliminada && (
        <EliminarHerramientaModal
          herramienta={herramientaEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
