import { useGetInsumos } from "../../hooks/insumos/useGetInsumos";
import { useCrearInsumos } from "../../hooks/insumos/useCrearInsumos";
import { useEditarInsumos } from "../../hooks/insumos/useEditarInsumos";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import { CrearInsumosModal } from "./CrearInsumosModal";
import EditarInsumosModal from "./EditarInsumosModal";
import { Insumos } from "../../types";
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/toast";

export function InsumosList() {
  const { data, isLoading, error } = useGetInsumos();
  const { user } = useAuth();
  const userRole = user?.rol || null;

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearInsumos();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    insumoEditado,
    handleEditar,
  } = useEditarInsumos();

  // Función para mostrar alerta de acceso denegado
  const showAccessDenied = () => {
    addToast({
      title: "Acción no permitida",
      description: "No tienes permiso para realizar esta acción",
      color: "danger",
    });
  };

  // Función para manejar acciones con verificación de permisos
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

  // Función para crear nuevo insumo con verificación de permisos
  const handleCrearNuevo = () => {
    handleActionWithPermission(
      () =>
        handleCrear({
          id: 0,
          nombre: "",
          fk_UnidadMedida: 0,
          descripcion: "",
          compuestoActivo:"",
          precio:0,
          contenido:0,
          unidades:0,
          cantidadGramos:0
        }),
      ["admin", "instructor", "pasante"]
    );
  };

  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true  },
    { name: "Descripción", uid: "descripcion", sortable: true  },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Insumos, columnKey: React.Key) => {
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
                ["admin", "instructor"]
              )
            }
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Insumos])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los insumos</p>;

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

      {isCreateModalOpen && <CrearInsumosModal onClose={closeCreateModal} onCreate={handleCrear}/>}

      {isEditModalOpen && insumoEditado && (
        <EditarInsumosModal insumo={insumoEditado} onClose={closeEditModal} />
      )}
    </div>
  );
}
