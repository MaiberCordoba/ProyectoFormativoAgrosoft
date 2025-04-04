import { useGetUsosHerramientas } from "../../hooks/usosHerramientas/useGetUsosHerramientas";
import { useEditarUsoHerramienta } from "../../hooks/usosHerramientas/useEditarUsosHerramientas";
import { useCrearUsosHerramienta } from "../../hooks/usosHerramientas/useCrearUsosHerramientas";
import { useEliminarUsoHerramienta } from "../../hooks/usosHerramientas/useEliminarUsosHerramientas";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarUsosHerramientasModal from "./EditarUsosHerramientasModal";
import { CrearUsoHerramientaModal } from "./CrearUsosHerramientasModal";
import EliminarUsosHerramientasModal from "./EliminarUsosHerramientas";
import { UsosHerramientas } from "../../types";
import { useGetHerramientas } from "../../hooks/herramientas/useGetHerramientas";
import { useGetActividades } from "../../hooks/actividades/useGetActividades";

export function UsosHerramientasList() {
  const { data, isLoading, error } = useGetUsosHerramientas();
  const { data : herramientas, isLoading : loadingHerramientas } = useGetHerramientas();
  const { data : actividades, isLoading : loadingActividades } = useGetActividades();
  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    usoHerramientaEdidata, 
    handleEditar 
  } = useEditarUsoHerramienta();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearUsosHerramienta();
  
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    usoHerramientaEliminada,
    handleEliminar
  } = useEliminarUsoHerramienta();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fk_Herramientas: 0, fk_Actividad: 0 });
  };

  // Definición de columnas
  const columnas = [
    { name: "Herramienta", uid: "herramienta" },
    { name: "Actividad", uid: "actividad" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función de renderizado
  const renderCell = (item: UsosHerramientas, columnKey: React.Key) => {
    switch (columnKey) {
      case "herramienta":
        const herramienta = herramientas?.find((c) => c.id === item.fk_Herramientas);
        return <span>{herramienta ? herramienta.nombre : "No definido"}</span>;
      case "actividad":
        const actividad = actividades?.find((c) => c.id === item.fk_Actividad);
        return <span>{actividad ? actividad.titulo : "No definido"}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof UsosHerramientas])}</span>;
    }
  };

  if (isLoading || loadingHerramientas || loadingActividades) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los Usos de Herramientas</p>;

  return (
    <div className="p-4">
      {/* Tabla reutilizable */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="herramienta"
        placeholderBusqueda="Buscar por herramienta"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && usoHerramientaEdidata && (
        <EditarUsosHerramientasModal
          usoHerramienta={usoHerramientaEdidata}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearUsoHerramientaModal onClose={closeCreateModal} />
      )}

      {isDeleteModalOpen && usoHerramientaEliminada && (
        <EliminarUsosHerramientasModal
          usoHerramienta={usoHerramientaEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
