import { useGetVentas } from "../../hooks/ventas/useGetVentas";
import { useEditarVenta } from "../../hooks/ventas/useEditarVentas";
import { useCrearVenta } from "../../hooks/ventas/useCrearVentas";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import { CrearVentasModal } from "./CrearVentasModal";
import { Ventas, UnidadesMedida } from "../../types";
import { useGetCosechas } from "../../hooks/cosechas/useGetCosechas";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/toast";
import { EditarVentasModal } from "./EditarVentasModal";
import { useGetUsers } from "@/modules/Users/hooks/useGetUsers";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { RoundIconButton } from "@/components/ui/buttonRound";
import { Download } from "lucide-react";
import { formatCurrency, useCosechasGrouped } from "../../hooks/useCosechasGrouped";
import { FacturaPDF } from "./VentaPdf";

export function VentasList() {
  const { user } = useAuth();
  const userRole = user?.rol || null;
  const { data, isLoading, error, refetch } = useGetVentas();
  const { data: cosechas, isLoading: loadingCosechas } = useGetCosechas();
  const { data: plantaciones } = useGetPlantaciones();
  const { data: unidadesMedida, isLoading: loadingUnidadesMedida } = useGetUnidadesMedida();
  const { data: usuarios } = useGetUsers();
  const { cosechasAgrupadas } = useCosechasGrouped();
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
    const ventaPDF = {
      numero_factura: item.numero_factura,
      fecha: item.fecha,
      usuario: usuarios?.find((us) => us.id === item.usuario)?.nombre + ' ' + usuarios?.find((us) => us.id === item.usuario)?.apellidos || 'Desconocido',
      cosechas: item.cosechas.map((vc) => {
        const cosecha = cosechas?.find((c) => c.id === vc.cosecha);
        const plantacion = plantaciones?.find((p) => p.id === cosecha?.fk_Plantacion);
        const unidad = unidadesMedida?.find((u) => u.id === vc.unidad_medida) || {
          id: 0,
          nombre: 'N/A',
          equivalenciabase: 1,
          abreviatura: 'N/A',
          tipo: 'MASA', // Ajustado para cumplir con 'MASA' | 'VOLUMEN'
        } as UnidadesMedida;
        return {
          cosecha: {
            id: vc.cosecha,
            nombreEspecie: cosechasAgrupadas.find((ca) => ca.lotes.some((l) => l.id === vc.cosecha))?.nombreEspecie || plantacion?.cultivo?.nombre || 'Desconocido',
          },
          cantidad: vc.cantidad,
          unidad_medida: unidad,
          precio_unitario: vc.precio_unitario,
          descuento: vc.descuento,
          valor_total: vc.valor_total,
        };
      }),
      valor_total: item.valor_total,
    };

    switch (columnKey) {
      case "fecha":
        return <span>{new Date(item.fecha).toLocaleString()}</span>;
      case "numero_factura":
        return <span>{item.numero_factura}</span>;
      case "valor_total":
        return <span>{formatCurrency(Number(item.valor_total))}</span>;
      case "usuario":
        return <span>{ventaPDF.usuario}</span>;
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
                    Precio: {formatCurrency(Number(vc.precio_unitario))}, Descuento: {vc.descuento}%, Total: {formatCurrency(Number(vc.valor_total))}
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
            renderDescargar={() => (
              <PDFDownloadLink document={<FacturaPDF venta={ventaPDF} />} fileName={`factura-${item.numero_factura}.pdf`}>
                {({ loading }) => (
                  <RoundIconButton
                    icon={<Download className="w-5 h-5" />}
                    disabled={loading}
                    aria-label={loading ? 'Generando PDF...' : 'Descargar Factura'}
                  />
                )}
              </PDFDownloadLink>
            )}
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