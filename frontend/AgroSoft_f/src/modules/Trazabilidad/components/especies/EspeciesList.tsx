import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import { useEditarEspecies } from "../../hooks/especies/useEditarEspecies";
import { useCrearEspecies } from "../../hooks/especies/useCrearEspecies";
import { useEliminarEspecies } from "../../hooks/especies/useEliminarEpecies";
import { useGetTiposEspecie } from "../../hooks/tiposEspecie/useGetTiposEpecie"; // ✅ Corrección
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarEspecieModal from "./EditarEspecieModal";
import { CrearEspecieModal } from "./CrearEspecieModal";
import EliminarEspecieModal from "./EliminarEspecie";
import { Especies } from "../../types";

export function EspecieList() {
  const { data: especies, isLoading, error } = useGetEspecies();
  const { data: tiposEspecies } = useGetTiposEspecie(); // ✅ Corrección

  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    EspeciesEditada, 
    handleEditar 
  } = useEditarEspecies();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearEspecies();
  
  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    EspeciesEliminada,
    handleEliminar
  } = useEliminarEspecies();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, tipo_especie_nombre: null, nombre: "", descripcion: "", img: "", tiempocrecimiento: 0 });
  };

  // Mapeo seguro para obtener el nombre del tipo de especie
  const tipoEspecieMap = tiposEspecies?.reduce((acc, tipo) => {
    acc[tipo.id] = tipo.nombre;
    return acc;
  }, {} as Record<number, string>) || {}; 
  
  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "Tiempo de Crecimiento (días)", uid: "tiempocrecimiento", sortable: true },
    { name: "Tipo de Especie", uid: "fk_tiposespecie" }, // ✅ Corrección
    { name: "Acciones", uid: "acciones" },
  ];
  
  const renderCell = (item: Especies, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "tiempocrecimiento":
        return <span>{item.tiempocrecimiento} días</span>;
      case "fk_tiposespecie": 
        return (
          <span>
            {item.fk_tipoespecie && tipoEspecieMap[item.fk_tipoespecie]
              ? tipoEspecieMap[item.fk_tipoespecie]
              : "Sin Tipo"}
          </span>
        ); // ✅ Maneja `null` y `undefined`
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

      {/* Modales */}
      {isEditModalOpen && EspeciesEditada && (
        <EditarEspecieModal
          especie={EspeciesEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearEspecieModal
          onClose={closeCreateModal}
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
