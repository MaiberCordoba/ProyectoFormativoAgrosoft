import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import { useEditarEspecies } from "../../hooks/especies/useEditarEspecies";
import { useCrearEspecies } from "../../hooks/especies/useCrearEspecies";
import { useEliminarEspecies } from "../../hooks/especies/useEliminarEpecies";
import { useGetTiposEspecie } from "../../hooks/tiposEspecie/useGetTiposEpecie";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarEspecieModal from "./EditarEspecieModal";
import { CrearEspecieModal } from "./CrearEspecieModal";
import EliminarEspecieModal from "./EliminarEspecie";
import { Especies } from "../../types";

export function EspecieList() {
  const { data: especies, isLoading, error } = useGetEspecies();
  const { data: tiposEspecie } = useGetTiposEspecie();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    EspeciesEditada,
    handleEditar,
  } = useEditarEspecies();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearEspecies();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    EspeciesEliminada,
    handleEliminar,
  } = useEliminarEspecies();

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      nombre: "",
      descripcion: "",
      img: "",
      tiempocrecimiento: "",
      fk_tipoespecie: 0,
    });
  };

  const handleCreateSuccess = () => {
    // Aquí podrías agregar lógica como refetch o toast
    closeCreateModal();
  };

  const tipoEspecieMap =
    tiposEspecie?.reduce((acc, tipo) => {
      acc[tipo.id] = tipo.nombre;
      return acc;
    }, {} as Record<number, string>) || {};

  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "Tiempo de Crecimiento", uid: "tiempocrecimiento", sortable: true },
    { name: "Imagen", uid: "img" },
    { name: "Tipo de Especie", uid: "fk_tiposespecie" },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Especies, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "tiempocrecimiento":
        return <span>{item.tiempocrecimiento}</span>;
      case "img":
        return item.img ? (
          <div className="flex justify-center items-center">
            <img
              src={item.img}
              alt={item.nombre}
              className="w-14 h-14 rounded-lg object-cover border border-gray-300"
            />
          </div>
        ) : (
          <span className="text-gray-400 italic">No disponible</span>
        );
      case "fk_tiposespecie":
        return (
          <span>
            {item.fk_tipoespecie && tipoEspecieMap[item.fk_tipoespecie]
              ? tipoEspecieMap[item.fk_tipoespecie]
              : "Sin Tipo"}
          </span>
        );
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Especies])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las especies</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={especies || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && EspeciesEditada && (
        <EditarEspecieModal
          especie={EspeciesEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearEspecieModal
          onClose={closeCreateModal}
          onCreate={handleCreateSuccess}
        />
      )}

      {isDeleteModalOpen && EspeciesEliminada && (
        <EliminarEspecieModal
          especie={EspeciesEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
