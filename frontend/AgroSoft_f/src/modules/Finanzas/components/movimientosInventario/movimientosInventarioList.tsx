import { useGetMovimientoInventario } from "../../hooks/movimientoInventario/useGetMovimientoInventario";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import { MovimientoInventario } from "../../types";
import { useEditarMovimientoInventario } from "../../hooks/movimientoInventario/useEditarMovimientos";
import { useCrearMovimientoInventario } from "../../hooks/movimientoInventario/useCrearMovimientos";
import EditarMovimientoInventarioModal from "./EditarMoimientosInventarioModal";
import { CrearMovimientoInventarioModal } from "./CrearMovimientosInventarioModal";
import { useGetInsumos } from "../../hooks/insumos/useGetInsumos";
import { useGetHerramientas } from "../../hooks/herramientas/useGetHerramientas";
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/toast";
import { Chip } from "@heroui/react";
//import { useGetUsosHerramientas } from "../../hooks/usosHerramientas/useGetUsosHerramientas";

export function MovimientosList() {
  const { data, isLoading, error } = useGetMovimientoInventario();
  const { data: insumos, isLoading: loadingInsumos } = useGetInsumos();
  const { data: herramientas, isLoading: loadingHerramientas } =
    useGetHerramientas();
  const { user } = useAuth();
  const userRole = user?.rol || undefined;

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    movimientoEditado,
    handleEditar,
  } = useEditarMovimientoInventario();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearMovimientoInventario();

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

  // Función para crear nuevo movimiento (no usada, pero mantenida por si se necesita)
  const handleCrearNuevo = () => {
    handleActionWithPermission(
      () =>
        handleCrear({
          id: 0,
          tipo: "entrada",
          unidades: 0,
          fk_Insumo: undefined,
          fk_UsoInsumo: undefined,
          fk_Herramienta: undefined,
          fk_UsoHerramienta: undefined,
        }),
      ["ninguno"]
    );
  };

  const columnas = [
    { name: "Usuario", uid: "usuario", sortable: true  },
    { name: "Fecha", uid: "fecha", sortable: true  },
    { name: "Tipo", uid: "tipo", sortable: true  },
    { name: "Unidades", uid: "unidades", sortable: true  },
    { name: "Insumo", uid: "fk_Insumo", sortable: true  },
    { name: "Herramienta", uid: "fk_Herramienta", sortable: true  },
    { name: "Acciones", uid: "acciones"},
  ];

  const renderCell = (item: MovimientoInventario, columnKey: React.Key) => {
    switch (columnKey) {
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() =>
              handleActionWithPermission(() => handleEditar(item), ["admin"])
            }
          />
        );

      case "unidades":
        return (
          <span>
            {item.unidades} <strong> {item.unidad_medida}</strong>{" "}
          </span>
        );

      case "usuario":
        return (
          <span>
            {item.usuario?.nombre} {item.usuario?.apellidos} (
            <strong>{item.usuario?.rol}</strong>){" "}
          </span>
        );

      case "tipo":
        return (
          <Chip
            size="sm"
            className="capitalize"
            color={item.tipo === "entrada" ? "success" : "danger"}
          >
            {item.tipo}
          </Chip>
        );

      case "fk_Insumo":
        const insumo = insumos?.find((i) => i.id === item.fk_Insumo);
        return <span>{insumo ? insumo.nombre : "No aplica"}</span>;
      case "fk_Herramienta":
        const herramienta = herramientas?.find(
          (h) => h.id === item.fk_Herramienta
        );
        return <span>{herramienta ? herramienta.nombre : "No aplica"}</span>;
      default:
        return (
          <span>{String(item[columnKey as keyof MovimientoInventario])}</span>
        );
    }
  };

  if (isLoading || loadingInsumos || loadingHerramientas)
    return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los movimientos de inventario</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="tipo"
        placeholderBusqueda="Buscar por tipo"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && movimientoEditado && (
        <EditarMovimientoInventarioModal
          movimiento={movimientoEditado}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearMovimientoInventarioModal onClose={closeCreateModal} onCreate={handleCrear}/>
      )}
    </div>
  );
}
