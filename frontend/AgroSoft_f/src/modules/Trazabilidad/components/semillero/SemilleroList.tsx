import { useGetSemilleros } from "../../hooks/semilleros/useGetSemilleros";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies"; // Importar el hook de especies
import { useEditarSemilleros } from "../../hooks/semilleros/useEditarSemilleros";
import { useCrearSemilleros } from "../../hooks/semilleros/useCrearSemilleros";
import { useEliminarSemilleros } from "../../hooks/semilleros/useEliminarSemilleros";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarSemilleroModal from "./EditarSemilleroModal";
import { CrearSemilleroModal } from "./CrearSemilleroModal";
import EliminarSemilleroModal from "./EliminarSemillero";
import { Semilleros } from "../../types";

export function SemilleroList() {
  const { data: semilleros, isLoading, error } = useGetSemilleros();
  const { data: especies } = useGetEspecies(); // Obtener la lista de especies

  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    SemillerosEditada, 
    handleEditar 
  } = useEditarSemilleros();

  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearSemilleros();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    SemillerosEliminada,
    handleEliminar
  } = useEliminarSemilleros();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fk_especie: 0, unidades: 0, fechasiembra: "", fechaestimada: "" });
  };

  // Crear un mapa de especies para obtener el nombre por ID
  const especiesMap = especies?.reduce((map, especie) => {
    map[especie.id] = especie.nombre;
    return map;
  }, {} as Record<number, string>) || {};

  const columnas = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Especie", uid: "fk_Especie", sortable: true },
    { name: "Unidades", uid: "unidades" },
    { name: "Fecha de Siembra", uid: "fechaSiembra", sortable: true },
    { name: "Fecha Estimada", uid: "fechaEstimada", sortable: true },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Semilleros, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return <span>{item.id}</span>;
      case "fk_Especie":
        return <span>{especiesMap[item.fk_especie] || "Desconocido"}</span>; // Mostrar nombre de la especie
      case "unidades":
        return <span>{item.unidades}</span>;
      case "fechaSiembra":
        return <span>{item.fechasiembra}</span>;
      case "fechaEstimada":
        return <span>{item.fechaestimada}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Semilleros])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los semilleros</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={semilleros || []}
        columnas={columnas}
        claveBusqueda="id"
        placeholderBusqueda="Buscar por ID"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && SemillerosEditada && (
        <EditarSemilleroModal
          semillero={SemillerosEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearSemilleroModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && SemillerosEliminada && (
        <EliminarSemilleroModal
          semillero={SemillerosEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
