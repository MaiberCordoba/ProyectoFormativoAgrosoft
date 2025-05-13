import { useGetMovimientoInventario} from "../../hooks/movimientoInventario/useGetMovimientoInventario";
import { useEliminarMovimientoInventario } from "../../hooks/movimientoInventario/useEliminarMovimientosInventario";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EliminarMovimientoInventarioModal from "./EliminarMovimientoInventario";
import { MovimientoInventario } from "../../types";
//import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";

export function MovimientosList() {
  const { data, isLoading, error } = useGetMovimientoInventario();
  //const { data: unidades, isLoading: loadingUnidades } = useGetUnidadesMedida();

/*   const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    insumoEditado,
    handleEditar
  } = useEditarInsumos(); */

/*   const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear
  } = useCrearInsumos(); */

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    movimientoEliminado,
    handleEliminar
  } = useEliminarMovimientoInventario();

/*    const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      fk_Insumo: null,
      fk_UsoInsumo: null,
      unidades: 0,
      tipo: "entrada",
      fk_Herramienta: null,
      fk_UsoHerramienta: null,
    });
  }; */ 

  const columnas = [
    { name: "Insumo", uid: "fk_Insumo" },
    { name: "Herramienta", uid: "fk_Herramienta" },
    { name: "Tipo", uid: "tipo" },
    { name: "UsoInsumo", uid: "usoInsummo" },
    { name: "Unidades", uid: "unidades" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: MovimientoInventario, columnKey: React.Key) => {
    switch (columnKey) {
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => (item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof MovimientoInventario])}</span>;
    }
  };

  if (isLoading ) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los insumos</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="tipo"
        placeholderBusqueda="Buscar por tipo"
        renderCell={renderCell}
      />

{/*       {isEditModalOpen && insumoEditado && (
        <EditarInsumoModal insumo={insumoEditado} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && <CrearInsumosModal onClose={closeCreateModal} />} */}

      {isDeleteModalOpen && movimientoEliminado && (
        <EliminarMovimientoInventarioModal movimiento={movimientoEliminado} isOpen={isDeleteModalOpen} onClose={closeDeleteModal} />
      )}
    </div>
  );
}
