import { useGetPlantaciones } from "../../hooks/plantaciones/useGetPlantaciones";
import { useEditarPlantaciones } from "../../hooks/plantaciones/useEditarPlantaciones";
import { useCrearPlantaciones } from "../../hooks/plantaciones/useCrearPlantaciones";
import { useEliminarPlantaciones } from "../../hooks/plantaciones/useEliminarPlantaciones";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarPlantacionModal from "./EditarPlantacionesModal";
import { CrearPlantacionModal } from "./CrearPlantacionesModal";
import EliminarPlantacionModal from "./EliminarPlantaciones";
import { Plantaciones } from "../../types";

export function PlantacionesList() {
  const { data, isLoading, error } = useGetPlantaciones();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    PlantacionesEditada,
    handleEditar,
  } = useEditarPlantaciones();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearPlantaciones();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    PlantacionesEliminada,
    handleEliminar,
  } = useEliminarPlantaciones();

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      cultivo: {
        id: 0,
        nombre: "",
        activo: false,
        especies: {
          id: 0,
          nombre: "",
          descripcion: "",
          tiempocrecimiento: "",
          tiposEspecie: { id: 0, nombre: "", descripcion: "", img: "" },
          fk_tipoespecie: 0,
        },
        fk_Especie: 0,
      },
      semillero: null,
      eras: {
        id: 0,
        tipo: "",
        fk_lote: {
          id: 0,
          nombre: "",
          descripcion: "",
          latI1: 0,
          longI1: 0,
          latS1: 0,
          longS1: 0,
          latI2: 0,
          longI2: 0,
          latS2: 0,
          longS2: 0,
          estado: null,
        },
        latI1: 0,
        longI1: 0,
        latS1: 0,
        longS1: 0,
        latI2: 0,
        longI2: 0,
        latS2: 0,
        longS2: 0,
      },
      unidades: 0,
      fechaSiembra: "",
      creado: "",
      fk_semillero: null,
      fk_Cultivo: 0,
      fk_Era: 0,
    });
  };

  const columnas = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Cultivo", uid: "cultivo", sortable: true },
    { name: "Semillero", uid: "semillero", sortable: false },
    { name: "Unidades", uid: "unidades", sortable: true },
    { name: "Fecha Siembra", uid: "fechaSiembra", sortable: true },
    { name: "Era", uid: "eras", sortable: true },
    { name: "Acciones", uid: "acciones", sortable: false },
  ];

  const renderCell = (item: Plantaciones, columnKey: React.Key) => {
    // Depuración: Imprimir la clave de la columna
    console.log("ColumnKey:", columnKey);

    switch (columnKey) {
      case "id":
        return <span>{item.id}</span>;
      case "cultivo":
        return <span>{item.cultivo?.nombre || "Sin nombre"}</span>;
      case "semillero":
        return (
          <span>
            {item.semillero
              ? `Semillero: ${item.semillero.cultivo?.nombre || "Sin nombre"}`
              : "Sin semillero"}
          </span>
        );
      case "unidades":
        return <span>{item.unidades ?? "N/A"}</span>;
      case "fechaSiembra":
        return (
          <span>
            {item.fechaSiembra
              ? new Date(item.fechaSiembra).toLocaleDateString("es-CO")
              : "N/A"}
          </span>
        );
      case "eras":
        return (
          <span>{item.eras?.tipo || `Era ${item.eras?.id || "N/A"}`}</span>
        );
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        console.warn(`Clave de columna no manejada: ${String(columnKey)}`);
        return (
          <span>{String(item[columnKey as keyof Plantaciones] ?? "N/A")}</span>
        );
    }
  };

  // Depuración: Imprimir datos
  console.log("Plantaciones:", data);

  if (isLoading) return <p>Cargando...</p>;
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

      {isCreateModalOpen && <CrearPlantacionModal onClose={closeCreateModal} />}

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
