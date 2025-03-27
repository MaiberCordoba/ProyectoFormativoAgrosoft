import { useGetSensor } from "../../hooks/sensor/useGetSensor";
import { useEditarSensor } from "../../hooks/sensor/useEditarSensor";
import { useCrearSensor } from "../../hooks/sensor/useCrearSensor";
import { useEliminarSensor } from "../../hooks/sensor/useEliminarSenosr";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarSensorModal from "./EditarSensorModal";
import CrearSensorModal from "./CrearSensorModal";
import EliminarSensorModal from "./EliminarSensorModal";
import { SensorData, SENSOR_TYPES } from "../../types/sensorTypes"

export function SensorLista() {
  const { data, isLoading, error } = useGetSensor();
  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    sensorEditado, 
    handleEditar 
  } = useEditarSensor();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearSensor();
  
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    sensorEliminado,
    handleEliminar
  } = useEliminarSensor();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fk_lote: null, fk_eras: null, fecha: "", tipo: "TEM", valor: 0 });
  };

  // Mapea los tipos de sensores a nombres legibles
  const getSensorLabel = (tipo: string) => {
    const sensor = SENSOR_TYPES.find(s => s.key === tipo);
    return sensor ? sensor.label : "Desconocido";
  };

  // Definición de columnas
  const columnas = [
    { name: "Fecha", uid: "fecha", sortable: true },
    { name: "Tipo de Sensor", uid: "tipo" },
    { name: "Valor", uid: "valor" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función de renderizado de celdas
  const renderCell = (item: SensorData, columnKey: React.Key) => {
    switch (columnKey) {
      case "fecha":
        return <span>{new Date(item.fecha).toLocaleString()}</span>;
      case "tipo":
        return <span>{getSensorLabel(item.tipo)}</span>;
      case "valor":
        return <span>{item.valor}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof SensorData])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los sensores</p>;

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

      {/* Modales */}
      {isEditModalOpen && sensorEditado && (
        <EditarSensorModal
          sensor={sensorEditado}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearSensorModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && sensorEliminado && (
        <EliminarSensorModal
          sensor={sensorEliminado}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
