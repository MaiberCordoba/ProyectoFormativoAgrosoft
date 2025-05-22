import { useGetControles } from "../../hooks/controles/useGetControless";
import { useEditarControl } from "../../hooks/controles/useEditarControles";
import { useCrearControl } from "../../hooks/controles/useCrearControles";
import { useEliminarControl } from "../../hooks/controles/useEliminarControles";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarControlModal from "./EditarControlesModal";
import { CrearControlModal } from "./CrearControlesModal";
import EliminarControlModal from "./EliminaControles";
import { Controles } from "../../types";

export function ControlesList() {
  const { data, isLoading, error } = useGetControles();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    controlEditado,
    handleEditar,
  } = useEditarControl();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearControl();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    controlEliminado,
    handleEliminar,
  } = useEliminarControl();

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      fk_Afeccion: 0,
      fk_TipoControl: 0,
      fechaControl: "",
      descripcion: "",
      fk_Usuario: 0,
    });
  };

  const columnas = [
    { name: "Fecha de Control", uid: "fechacontrol" },
    { name: "Descripción", uid: "descripcion" },
    { name: "Afección", uid: "afeccion" },
    { name: "Tipo de Control", uid: "tipocontrol" },
    { name: "Usuario", uid: "usuario" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Controles, columnKey: React.Key) => {
    switch (columnKey) {
      case "fechacontrol":
        return <span>{item.fechaControl}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "afeccion":
        return (
          <span>
            {item.afeccion?.plagas?.tipoPlaga?.nombre || "Sin nombre"}
          </span>
        );
      case "tipocontrol":
        return <span>{item.tipoControl?.nombre || "No definido"}</span>;
      case "usuario":
        return <span>{item.usuario?.nombre || "No definido"}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Controles])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los controles</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="descripcion"
        placeholderBusqueda="Buscar por descripción"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && controlEditado && (
        <EditarControlModal control={controlEditado} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && (
        <CrearControlModal
          onClose={closeCreateModal}
          onCreate={(nuevoControl) => {
            console.log("Control creado desde modal:", nuevoControl);
            closeCreateModal(); // opcional, ya lo haces dentro del modal
          }}
        />
      )}

      {isDeleteModalOpen && controlEliminado && (
        <EliminarControlModal
          control={controlEliminado}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
