import { useGetVentas } from "../../hooks/ventas/useGetVentas";
import { useEditarVenta } from "../../hooks/ventas/useEditarVentas";
import { useCrearVenta } from "../../hooks/ventas/useCrearVentas";
import { useEliminarVenta } from "../../hooks/ventas/useEliminarVentas";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarVentasModal from "./EditarVentasModal";
import { CrearVentasModal } from "./CrearVentasModal";
import EliminarVentaModal from "./EliminarVentas";
import { Ventas } from "../../types";
import { useGetCosechas } from "../../hooks/cosechas/useGetCosechas";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";

export function VentasList() {
  const { data, isLoading, error } = useGetVentas();
  const { data : cosechas, isLoading : loadingCosechas } = useGetCosechas();
  const { data : plantaciones} = useGetPlantaciones();
  const { data : unidadesMedida, isLoading : loadingUnidadesMedida } = useGetUnidadesMedida();
  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    ventaEditada, 
    handleEditar 
  } = useEditarVenta();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearVenta();
  
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    ventaEliminada,
    handleEliminar
  } = useEliminarVenta();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fk_Cosecha: 0, fecha: "", fk_UnidadMedida: 0,cantidad:0,valorTotal:0});
  };

  const columnas = [
    { name: "Fecha Venta", uid: "fecha" },
    { name: "Producto", uid: "cosecha" },
    { name: "Unidad de medida", uid: "unidadMedida" },
    { name: "Cantidad", uid: "cantidad" },
    { name: "Valor Total de venta", uid: "valorTotal" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Ventas, columnKey: React.Key) => {
    switch (columnKey) {
      case "cosecha":
        const cosecha = cosechas?.find((c) => c.id === item.fk_Cosecha);
        const plantacion = plantaciones?.find((p) => p.id === cosecha?.fk_Plantacion);
        const producto = plantacion?.cultivo?.nombre || "Producto no definido";
        return <span>{producto}</span>;
      case "precioUnitario":
        return <span>{item.precioUnitario}</span>;
      case "fecha":
        return <span>{item.fecha}</span>;
      case "unidadMedida":
        const unidadMedida = unidadesMedida?.find((c) => c.id === item.fk_UnidadMedida);
        return <span>{unidadMedida ? unidadMedida.nombre : "No definido"}</span>;
      case "cantidad":
          return <span>{item.cantidad}</span>;
      case "valorTotal":
          return <span>{item.valorTotal}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Ventas])}</span>;
    }
  };

  if (isLoading || loadingCosechas || loadingUnidadesMedida) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las Ventas</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="fecha"
        placeholderBusqueda="Buscar por fecha de venta"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && ventaEditada && (
        <EditarVentasModal
          venta={ventaEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearVentasModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && ventaEliminada && (
        <EliminarVentaModal
          venta={ventaEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
