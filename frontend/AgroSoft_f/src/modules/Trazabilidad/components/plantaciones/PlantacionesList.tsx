import { useGetPlantaciones } from "../../hooks/plantaciones/useGetPlantaciones";
import { useEditarPlantaciones } from "../../hooks/plantaciones/useEditarPlantaciones";
import { useCrearPlantaciones } from "../../hooks/plantaciones/useCrearPlantaciones";
import { useEliminarPlantaciones } from "../../hooks/plantaciones/useEliminarPlantaciones";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarPlantacionModal from "./EditarPlantacionesModal";
import { CrearPlantacionModal } from "./CrearPlantacionesModal";
import EliminarPlantacionModal from "./EliminarPlantaciones";
import { Plantaciones } from "../../types";

export function PlantacionesList() {
  const { data, isLoading, error } = useGetPlantaciones();
  const { data: especies, isLoading: loadingEspecies } = useGetEspecies();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    PlantacionesEditada,
    handleEditar
  } = useEditarPlantaciones();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear
  } = useCrearPlantaciones();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    PlantacionesEliminada,
    handleEliminar
  } = useEliminarPlantaciones();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fk_Especie: 0, fk_Era: 0 });
  };

  const especiesMap =
    especies?.reduce((map, especie) => {
      map[especie.id] = especie.nombre;
      return map;
    }, {} as Record<number, string>) || {};

  const columnas = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Especie", uid: "fk_especie", sortable: true }, // 👈 nombre correcto
    { name: "Era", uid: "fk_Era", sortable: true },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Plantaciones, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return <span>{item.id}</span>;
      case "fk_especie":
        return <span>{especiesMap[item.fk_Especie] || "Desconocido"}</span>; // 👈 uso correcto del nombre
      case "fk_Era":
        return <span>{item.fk_Era}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Plantaciones])}</span>;
    }
  };

  if (isLoading || loadingEspecies) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las plantaciones</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="id"
        placeholderBusqueda="Buscar por ID"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {isEditModalOpen && PlantacionesEditada && (
        <EditarPlantacionModal
          plantacion={PlantacionesEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearPlantacionModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && PlantacionesEliminada && (
        <EliminarPlantacionModal
          plantacion={PlantacionesEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
