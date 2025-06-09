import { useGetInsumos } from "../../hooks/insumos/useGetInsumos";
import { useEditarInsumos } from "../../hooks/insumos/useEditarInsumos";
import { useCrearInsumos } from "../../hooks/insumos/useCrearInsumos";
import { useEliminarInsumos } from "../../hooks/insumos/useEliminarInsumos";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarInsumoModal from "./EditarInsumosModal";
import { CrearInsumosModal } from "./CrearInsumosModal";
import EliminarInsumoModal from "./EliminarInsumos";
import { Insumos } from "../../types";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { Image } from "@heroui/react";

export function InsumosList() {
  const { data, isLoading, error } = useGetInsumos();
  const { data: unidades, isLoading: loadingUnidades } = useGetUnidadesMedida();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    insumoEditado,
    handleEditar
  } = useEditarInsumos();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear
  } = useCrearInsumos();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    insumoEliminado,
    handleEliminar
  } = useEliminarInsumos();

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      nombre: "",
      descripcion: "",
      precio: 0,
      compuestoActivo: "",
      contenido: 0,
      fichaTecnica: "",
      unidades: 0,
      fk_UnidadMedida: null,
      valorTotalInsumos: 0,
      cantidadTotal: 0,
      cantidadDisponible: 0,
    });
  };

  const columnas = [
    { name: "Nombre", uid: "nombre" },
    { name: "Descripción", uid: "descripcion" },
    { name: "Precio Unidad", uid: "precio" },
    { name: "Compuesto Activo", uid: "compuestoActivo" },
    { name: "Contenido", uid: "contenido" },
    { name: "Ficha Técnica", uid: "fichaTecnica" },
    { name: "Unidades", uid: "unidades" },
    { name: "Unidad Medida", uid: "unidadMedida" },
    { name: "Valor Total Insumos", uid: "valorTotalInsumos" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Insumos, columnKey: React.Key) => {
    switch (columnKey) {
      case "unidadMedida":
        const unidad = unidades?.find((u) => u.id === item.fk_UnidadMedida);
        return <span>{unidad ? unidad.nombre : "No definido"}</span>;
      case "valorTotalInsumos":
        return <span>{item.valorTotalInsumos.toLocaleString("es-CO", { style: "currency", currency: "COP" })}</span>
      case "fichaTecnica":
        return <Image
        src={item.fichaTecnica}
        alt={item.nombre}
        className="w-14 h-14 object-contain rounded-lg"
        />
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Insumos])}</span>;
    }
  };

  if (isLoading || loadingUnidades) return <p>Cargando...</p>;
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

      {isEditModalOpen && insumoEditado && (
        <EditarInsumoModal insumo={insumoEditado} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && <CrearInsumosModal onClose={closeCreateModal} />}

      {isDeleteModalOpen && insumoEliminado && (
        <EliminarInsumoModal insumo={insumoEliminado} isOpen={isDeleteModalOpen} onClose={closeDeleteModal} />
      )}
    </div>
  );
}
