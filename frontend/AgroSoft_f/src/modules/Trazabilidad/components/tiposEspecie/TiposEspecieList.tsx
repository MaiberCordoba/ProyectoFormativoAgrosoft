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
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/toast";

export function TiposEspecieList() {
  const { data, isLoading, error } = useGetTiposEspecie();
  const { user } = useAuth();
  const userRole = user?.rol || null;

  const showAccessDenied = () => {
    addToast({
      title: 'Acción no permitida',
      description: 'No tienes permiso para realizar esta acción',
      color: 'danger'
    });
  };

  const handleActionWithPermission = (
    action: () => void, 
    requiredRoles: string[]
  ) => {
    if (requiredRoles.includes(userRole || "")) {
      action();
    } else {
      showAccessDenied();
    }
  };

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
  } = useEliminarTiposEspecie();

  const handleCrearNuevo = () => {
    const permitido = ["admin", "instructor", "pasante"].includes(userRole || "");
    
    if (permitido) {
      handleCrear({ id: 0, nombre: "", descripcion: "" });
    } else {
      showAccessDenied();
    }
  };

  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: TiposEspecie, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => 
              handleActionWithPermission(
                () => handleEditar(item), 
                ["admin", "instructor", "pasante"]
              )
            }
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