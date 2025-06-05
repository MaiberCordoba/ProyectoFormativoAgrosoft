import { useGetMovimientoInventario } from "../../hooks/movimientoInventario/useGetMovimientoInventario";
import { useEliminarMovimientoInventario } from "../../hooks/movimientoInventario/useEliminarMovimientosInventario";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EliminarMovimientoInventarioModal from "./EliminarMovimientoInventario";
import { MovimientoInventario } from "../../types";
import { useEditarMovimientoInventario } from "../../hooks/movimientoInventario/useEditarMovimientos";
import { useCrearMovimientoInventario } from "../../hooks/movimientoInventario/useCrearMovimientos";
import EditarMovimientoInventarioModal from "./EditarMoimientosInventarioModal";
import { CrearMovimientoInventarioModal } from "./CrearMovimientosInventarioModal";
import { useGetInsumos } from "../../hooks/insumos/useGetInsumos";
//import { useGetUsosInsumos } from "../../hooks/usoInsumos/useGetUsoInsumos";
import { useGetHerramientas } from "../../hooks/herramientas/useGetHerramientas";
import { Button } from "@heroui/react";
//import { useGetUsosHerramientas } from "../../hooks/usosHerramientas/useGetUsosHerramientas";

export function MovimientosList() {
  const { data, isLoading, error } = useGetMovimientoInventario();
  const { data:insumos, isLoading:loadingInsumos} = useGetInsumos();
  //const { data:usoInsumos, isLoading:loadingusoInsumos} = useGetUsosInsumos();
  const { data:herramientas, isLoading:loadingHerramientas} = useGetHerramientas();
  //const { data:usoHerramientas, isLoading:loadingUsoHerramientas} = useGetUsosHerramientas();


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

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    movimientoEliminado,
    handleEliminar,
  } = useEliminarMovimientoInventario();

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      tipo: "entrada",
      unidades: 0,
      fk_Insumo: null,
      fk_UsoInsumo: null,
      fk_Herramienta: null,
      fk_UsoHerramienta: null,
    });
  };

  const columnas = [
    { name: "Tipo", uid: "tipo" },
    { name: "Unidades", uid: "unidades" },
    { name: "Insumo", uid: "fk_Insumo" },
    { name: "Herramienta", uid: "fk_Herramienta" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: MovimientoInventario, columnKey: React.Key) => {
    switch (columnKey) {
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      case "fk_Insumo":
        const insumo = insumos?.find((i) => i.id === item.fk_Insumo);
        return <span>{insumo ? insumo.nombre : "No aplica"}</span>;
      case "fk_Herramienta":
        const herramienta = herramientas?.find((h) => h.id === item.fk_Herramienta);
        return <span>{herramienta ? herramienta.nombre : "No aplica"}</span>;
      default:
        return <span>{String(item[columnKey as keyof MovimientoInventario])}</span>;
    }
  };

  if (isLoading || loadingInsumos || loadingHerramientas) return <p>Cargando...</p>;
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
        <EditarMovimientoInventarioModal movimiento={movimientoEditado} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && (
        <CrearMovimientoInventarioModal onClose={closeCreateModal} />
      )}

      {isDeleteModalOpen && movimientoEliminado && (
        <EliminarMovimientoInventarioModal
          movimiento={movimientoEliminado}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
