import { useGetSemilleros } from "../../hooks/semilleros/useGetSemilleros";
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

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    SemillerosEditada,
    handleEditar,
  } = useEditarSemilleros();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearSemilleros();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    SemillerosEliminada,
    handleEliminar,
  } = useEliminarSemilleros();

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      fk_Cultivo: { nombre: "" },
      unidades: 0,
      fechasiembra: "",
      fechaestimada: "",
    });
  };

  const columnas = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Cultivo", uid: "fk_Cultivo", sortable: false },
    { name: "Unidades", uid: "unidades" },
    { name: "Fecha de Siembra", uid: "fechaSiembra", sortable: true },
    { name: "Fecha Estimada", uid: "fechaEstimada", sortable: true },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Semilleros, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return <span>{item.id}</span>;
        case "fk_Cultivo":
          return (
            <span>
              {item.cultivo?.nombre
                ? `${item.cultivo.nombre} ${item.cultivo.fk_Especie?.nombre ?? ""}`
                : "Desconocido"}
            </span>
          );
        
               
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

      {isEditModalOpen && SemillerosEditada && (
        <EditarSemilleroModal
          semillero={SemillerosEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearSemilleroModal
          onClose={closeCreateModal}
          onCreate={() => {}}
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
