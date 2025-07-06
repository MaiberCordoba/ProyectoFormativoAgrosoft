import { useGetVentas } from "../../hooks/ventas/useGetVentas";
import { useEditarVenta } from "../../hooks/ventas/useEditarVentas";
import { useCrearVenta } from "../../hooks/ventas/useCrearVentas";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import { CrearVentasModal } from "./CrearVentasModal";
import { Ventas } from "../../types";
import { useGetCosechas } from "../../hooks/cosechas/useGetCosechas";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/toast";
import { EditarVentasModal } from "./EditarVentasModal";
import { useGetUsers } from "@/modules/Users/hooks/useGetUsers";

export function VentasList() {
  const { user } = useAuth();
  const userRole = user?.rol || null;
  const { data, isLoading, error, refetch } = useGetVentas();
  const { data: cosechas, isLoading: loadingCosechas } = useGetCosechas();
  const { data: plantaciones } = useGetPlantaciones();
  const { data: unidadesMedida, isLoading: loadingUnidadesMedida } = useGetUnidadesMedida();
  const { data: usuario } = useGetUsers();
  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    ventaEditada,
    handleEditar,
  } = useEditarVenta();
  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearVenta();

  const showAccessDenied = () => {
    addToast({
      title: "Acción no permitida",
      description: "No tienes permiso para realizar esta acción",
      color: "danger",
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

  const handleCrearNuevo = () => {
    handleActionWithPermission(
      () => handleCrear(),
      ["admin", "instructor", "pasante"]
    );
  };

  const columnas = [
    { name: "Fecha Venta", uid: "fecha", sortable: true },
    { name: "Número Factura", uid: "numero_factura", sortable: true },
    { name: "Valor Total", uid: "valor_total", sortable: true },
    { name: "Usuario", uid: "usuario", sortable: true },
    { name: "Cosechas", uid: "cosechas" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Ventas, columnKey: React.Key) => {
    switch (columnKey) {
      case "fecha":
        return <span>{new Date(item.fecha).toLocaleString()}</span>;
      case "numero_factura":
        return <span>{item.numero_factura}</span>;
      case "valor_total":
        return <span>${item.valor_total}</span>;
      case "usuario":
        const user = usuario?.find((us) => us.id === item.usuario);
        return <span>{user?.nombre} {user?.apellidos}</span>;
      case "cosechas":
        return (
          <ul className="list-disc pl-4">
            {item.cosechas.map((vc, index) => {
              const cosecha = cosechas?.find((c) => c.id === vc.cosecha);
              const plantacion = plantaciones?.find((p) => p.id === cosecha?.fk_Plantacion);
              const producto = plantacion?.cultivo?.nombre || "Sin producto";
              const unidad = unidadesMedida?.find((u) => u.id === vc.unidad_medida);

              return (
                <li key={index}>
                  <span>
                    Producto: {producto}, Cantidad: {vc.cantidad} {unidad?.nombre || "N/A"},
                    Precio: ${vc.precio_unitario}, Descuento: {vc.descuento}%, Total: ${vc.valor_total}
                  </span>
                </li>
              );
            })}
          </ul>
        );
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
        return <span>{String(item[columnKey as keyof Ventas])}</span>;
    }
  };

  if (isLoading || loadingCosechas || loadingUnidadesMedida)
    return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las ventas: {error.message}</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="numero_factura"
        placeholderBusqueda="Buscar por número de factura"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && ventaEditada && (
        <EditarVentasModal venta={ventaEditada} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && <CrearVentasModal onClose={closeCreateModal} onCreate={refetch} />}
    </div>
  );
}