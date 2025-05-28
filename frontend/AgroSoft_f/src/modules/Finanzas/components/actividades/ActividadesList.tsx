import { useGetActividades } from "../../hooks/actividades/useGetActividades";
import { useEditarActividad } from "../../hooks/actividades/useEditarActividades";
import { useCrearActividad } from "../../hooks/actividades/useCrearActividades";
import { useEliminarActividad } from "../../hooks/actividades/useEliminarActividades";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarActividadesModal from "./EditarActividadesModal";
import { CrearActividadesModal } from "./CrearActividadModal";
import EliminarActividadesModal from "./EliminarActividades";
import { Actividades } from "../../types";
import { useGetUsers } from "@/modules/Users/hooks/useGetUsers";
import { useGetCultivos } from "@/modules/Trazabilidad/hooks/cultivos/useGetCultivos";
import { useGetTipoActividad } from "../../hooks/tipoActividad/useGetTiposActividad";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";

export function ActividadesList() {
  const { data, isLoading, error } = useGetActividades();
  const { data: users, isLoading: loadingUser } = useGetUsers(); 
  const { data : cultivo, isLoading: loadingCultivo } = useGetCultivos()
  const { data : tiposActividad, isLoading: isLoadingTiposActividad } = useGetTipoActividad()
  const { data : plantacion, isLoading: isLoadingPlantacion } = useGetPlantaciones()

  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    actividadEditada, 
    handleEditar 
  } = useEditarActividad();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearActividad();
  
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    actividadEliminada,
    handleEliminar
  } = useEliminarActividad();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fk_Cultivo: 0,fk_Plantacion:0 ,fk_Usuario: 0, fk_TipoActividad: 0, titulo: "", descripcion: "", fecha: "", estado: "AS" });
  };

  // Definición de columnas
  const columnas = [
    { name: "Cultivo", uid: "cultivo" },
    { name: "Plantacion", uid: "plantacion" },
    { name: "Usuario", uid: "usuario" },
    { name: "TipoActividad", uid: "tipoActividad"},
    { name: "Titulo", uid: "titulo" },
    { name: "Descripcion", uid: "descripcion" },
    { name: "Fecha", uid: "fecha" },
    { name: "Estado", uid: "estado" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Renderizado de celdas
  const renderCell = (item: Actividades, columnKey: React.Key) => {
    switch (columnKey) {
      case "cultivo":
        const cultivos = cultivo?.find((c) => c.id === item.fk_Cultivo);
        return <span>{cultivos ? cultivos.nombre : "No aplica"}</span>;
      case "plantacion":
        const plantaciones = plantacion?.find((c) => c.id === item.fk_Plantacion);
        return <span>{plantaciones ? plantaciones.cultivo?.nombre : "No aplica"}</span>;
      case "usuario":
        const usuario = users?.find((c) => c.id === item.fk_Usuario);
        return <span>{usuario ? usuario.nombre : "No definido"}</span>;
      case "tipoActividad":
        const tipoActividad = tiposActividad?.find((c) => c.id === item.fk_TipoActividad);
        return <span>{tipoActividad ? tipoActividad.nombre : "No definido"}</span>;
      case "titulo":
        return <span>{item.titulo}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "fecha":
        return <span>{item.fecha}</span>;
      case "estado":
        return <span>{item.estado}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Actividades])}</span>;
    }
  };

  if (isLoading || loadingUser || loadingCultivo || isLoadingTiposActividad || isLoadingPlantacion) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las actividades</p>;

  return (
    <div className="p-4">
      {/* Tabla reutilizable */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="titulo"
        placeholderBusqueda="Buscar por Título"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && actividadEditada && (
        <EditarActividadesModal actividad={actividadEditada} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && <CrearActividadesModal onClose={closeCreateModal} />}

      {isDeleteModalOpen && actividadEliminada && (
        <EliminarActividadesModal actividad={actividadEliminada} isOpen={isDeleteModalOpen} onClose={closeDeleteModal} />
      )}
    </div>
  );
}
