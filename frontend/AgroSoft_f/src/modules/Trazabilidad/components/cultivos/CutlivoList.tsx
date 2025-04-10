import { useGetCultivos } from "../../hooks/cultivos/useGetCultivos";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies"; // Nuevo hook para obtener especies
import { useEditarCultivos } from "../../hooks/cultivos/useEditarCultivos";
import { useCrearCultivos } from "../../hooks/cultivos/useCrearCultivos";
import { useEliminarCultivos } from "../../hooks/cultivos/useEliminarCultivos";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarCultivoModal from "./EditarCultivosModal";
import { CrearCultivoModal } from "./CrearCultivosModal";
import EliminarCultivoModal from "./EliminarCultivo";
import { Cultivos } from "../../types";

export function CultivosList() {
  const { data: cultivos, isLoading, error } = useGetCultivos();
  const { data: especies } = useGetEspecies(); // Obtener las especies

  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    CultivosEditada, 
    handleEditar 
  } = useEditarCultivos();

  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearCultivos();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    CultivosEliminada,
    handleEliminar
  } = useEliminarCultivos();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, nombre: "", fk_Especie: 0, unidades: 0, fechaSiembra: "", activo: true });
  };

  // Crear un mapa de especies para obtener el nombre por ID
  const especiesMap = especies?.reduce((map, especie) => {
    map[especie.id] = especie.nombre;
    return map;
  }, {} as Record<number, string>) || {};

  const columnas = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Especie", uid: "fk_especie", sortable: true },
    { name: "Unidades", uid: "unidades" },
    { name: "Fecha de Siembra", uid: "fechasiembra", sortable: true },
    { name: "Activo", uid: "activo", sortable: true },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Cultivos, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return <span>{item.id}</span>;
      case "nombre":
        return <span>{item.nombre}</span>;
      case "fk_especie":
        return <span>{especiesMap[item.fk_Especie] || "Desconocido"}</span>; // Muestra el nombre en lugar del ID
      case "unidades":
        return <span>{item.unidades}</span>;
      case "fechasiembra":
        return <span>{item.fechaSiembra}</span>;
      case "activo":
        return <span>{item.activo ? "Sí" : "No"}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Cultivos])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los cultivos</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={cultivos || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por Nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && CultivosEditada && (
        <EditarCultivoModal
          cultivo={CultivosEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearCultivoModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && CultivosEliminada && (
        <EliminarCultivoModal
          cultivo={CultivosEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
