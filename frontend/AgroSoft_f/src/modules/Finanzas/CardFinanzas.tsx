import { useGetPlantaciones } from "../Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { useGetInsumos } from "./hooks/insumos/useGetInsumos";
import { useGetUnidadesMedida } from "./hooks/unidadesMedida/useGetUnidadesMedida";
import { useGetHerramientas } from "./hooks/herramientas/useGetHerramientas";
import CustomCard from "./CustomCard";
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/toast";



export function CosechasResumenCard() {
    const { cosechasAgrupadas, isLoading, isError } = useCosechasGrouped();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCultivo, setSelectedCultivo] = useState<CultivoAgrupadoDetail | null>(null);
    const [filtroBusqueda, setFiltroBusqueda] = useState("");

    useEffect(() => {
        console.log('CosechasResumenCard renderizado', { filtroBusqueda, cultivosFiltradosLength: cultivosFiltrados.length });
    });

    if (isLoading) return <p className="text-center text-gray-600">Cargando información de cosechas...</p>;
    if (isError) return <p className="text-center text-red-500">Hubo un error al cargar la información de cosechas.</p>;

    const handleOpenModal = (cultivo: CultivoAgrupadoDetail) => {
        setSelectedCultivo(cultivo);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCultivo(null);
    };

    const cultivosFiltrados = cosechasAgrupadas.filter((cultivo) =>
        cultivo.nombreCultivo?.toLowerCase().includes(filtroBusqueda.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-4 mb-6">
            <FiltrosTabla
                valorFiltro={filtroBusqueda}
                onCambiarBusqueda={setFiltroBusqueda}
                onLimpiarBusqueda={() => setFiltroBusqueda("")}
                placeholderBusqueda="Buscar por cultivo (ej. Lechuga)"
                className="max-w-sm" // Añadido para input más corto
            />
            <div className="flex flex-row overflow-x-auto gap-4 pb-4 scroll-smooth">
                {cultivosFiltrados.length > 0 ? (
                    cultivosFiltrados.map((cultivo, index) => (
                        <CosechaCultivoCard
                            key={`${cultivo.nombreCultivo}-${index}`}
                            cultivo={cultivo}
                            onOpenDetails={handleOpenModal}
                        />
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No se encontraron cultivos.</p>
                )}
            </div>
            <CosechaLotesModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                cultivo={selectedCultivo}
            />
        </div>
    );
}

export function PlantacionesCard() {
  const {
    data: plantaciones = [],
    isLoading: loadingPlantaciones,
    isError,
  } = useGetPlantaciones();

  if (loadingPlantaciones) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar...</p>;

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {plantaciones.map((plantacion) => {
        // Manejo seguro de propiedades anidadas
        const nombreCultivo = plantacion?.cultivo?.nombre ?? "Desconocido";
        const estado =
          plantacion?.cultivo?.activo !== undefined
            ? plantacion.cultivo.activo
              ? "Activo"
              : "Inactivo"
            : "Estado desconocido";
        const fechaSiembra = plantacion.fechaSiembra || "Fecha no disponible";

        if (estado == "Inactivo") return null;


        return (
          <div
            key={plantacion.id}
            className="w-30 h-30 bg-white shadow-md rounded-md border p-2 text-sm flex flex-col justify-center"
          >
            <p>
              <strong>Cultivo</strong>: {nombreCultivo}
            </p>
            <p>
              <strong>Estado</strong>: {estado}
            </p>
            <p>
              <strong>Fecha de siembra</strong>: {fechaSiembra}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function InsumosCard() {
  const {
    data: insumos = [],
    isLoading: loadingInsumos,
    isError,
  } = useGetInsumos();
  const { data: unidades = [] } = useGetUnidadesMedida();
  const { user } = useAuth();
  const userRole = user?.rol || null;

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearUsosInsumo();

  // Función para mostrar alerta de acceso denegado
  const showAccessDenied = () => {
    addToast({
      title: "Acción no permitida",
      description: "No tienes permiso para realizar esta acción",
      color: "danger",
    });
  };

  // Función para manejar acciones con verificación de permisos
  const handleActionWithPermission = (
    action: () => void,
    requiredRoles: string[]
  ) => {
    if (requiredRoles.includes(userRole || "")) {
      action();
    } else {
      showAccessDenied();
    }
  };

  const handleUsarInsumo = (idInsumo: number) => {
    handleActionWithPermission(() => {
      handleCrear({
        id: 0,
        fk_Insumo: idInsumo,
        fk_Actividad: 0,
        fk_Control: 0,
        fk_UnidadMedida: 0,
        cantidadProducto: 0,
        costoUsoInsumo: 0,
      });
    }, ["admin", "instructor", "pasante"]);
  };

  if (loadingInsumos) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar los insumos.</p>;

  return (
    <>
      <div className="flex flex-wrap gap-4 mb-6">
        {insumos.map((insumo) => {
          const unidad = unidades.find((p) => p.id === insumo.fk_UnidadMedida);

          return (
            <CustomCard
              key={insumo.id}
              image={insumo.fichaTecnica}
              title={insumo.nombre}
              data={{
                "Cantidad Disponible": insumo.cantidadGramos,
                "Compuesto Activo": insumo.compuestoActivo,
                "Contenido Unidad": insumo.contenido
                  ? `${insumo.contenido} ${unidad?.abreviatura || ""}`
                  : "No disponible",
              }}
              footerButtons={[
                {
                  label: "Usar",
                  color: "primary",
                  size: "sm",
                  onPress: () => handleUsarInsumo(insumo.id),
                },
              ]}
            />
          );
        })}
      </div>

      {isCreateModalOpen && (
        <CrearUsoInsumoModal
          onClose={closeCreateModal}
          onCreate={() => closeCreateModal()}
        />
      )}
    </>
  );
}

import { Wrench } from "lucide-react";
import { useCrearUsosHerramienta } from "./hooks/usosHerramientas/useCrearUsosHerramientas";
import { CrearUsoHerramientaModal } from "./components/usosHerramientas/CrearUsosHerramientasModal";
import { useCrearUsosInsumo } from "./hooks/usoInsumos/useCrearUsoInsumos";
import { CrearUsoInsumoModal } from "./components/usoInsumos/CrearUsosInsumosModal";
import { useEffect, useState } from "react";
import { CultivoAgrupadoDetail, useCosechasGrouped } from "./hooks/useCosechasGrouped";
import { CosechaCultivoCard } from "./components/cosechas/CosechaCultivoCard";
import { CosechaLotesModal } from "./components/cosechas/CosechaLotesModal";
import { FiltrosTabla } from "@/components/ui/table/FiltrosTabla";

export function HerramientasCard() {
  const {
    data: Herramientas,
    isLoading: loadingHerramientas,
    isError,
  } = useGetHerramientas();
  const { user } = useAuth();
  const userRole = user?.rol || null;

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearUsosHerramienta();

  // Función para mostrar alerta de acceso denegado
  const showAccessDenied = () => {
    addToast({
      title: "Acción no permitida",
      description: "No tienes permiso para realizar esta acción",
      color: "danger",
    });
  };

  // Función para manejar acciones con verificación de permisos
  const handleActionWithPermission = (
    action: () => void,
    requiredRoles: string[]
  ) => {
    if (requiredRoles.includes(userRole || "")) {
      action();
    } else {
      showAccessDenied();
    }
  };

  const handleUsarHerramienta = (idHerramienta: number) => {
    handleActionWithPermission(() => {
      handleCrear({
        id: 0,
        fk_Herramienta: idHerramienta,
        fk_Actividad: 0,
        unidades: 0,
      });
    }, ["admin", "instructor", "pasante"]);
  };

  if (loadingHerramientas) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar herramientas...</p>;

  return (
    <>
      <div className="flex flex-wrap gap-4 mb-6">
        {Herramientas?.map((herramienta) => (
          <CustomCard
            key={herramienta.id}
            title={herramienta.nombre}
            icon={<Wrench size={40} className="text-gray-700" />}
            data={{ Unidades: herramienta.unidades }}
            footerButtons={[
              {
                label: "Usar",
                color: "primary",
                size: "sm",
                onPress: () => handleUsarHerramienta(herramienta.id),
              },
            ]}
          />
        ))}
      </div>

      {isCreateModalOpen && (
        <CrearUsoHerramientaModal
          onClose={closeCreateModal}
          onCreate={() => {
            closeCreateModal();
          }}
        />
      )}
    </>
  );
}