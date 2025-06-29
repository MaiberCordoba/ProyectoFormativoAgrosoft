import { useGetPlantaciones } from "../Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { useGetCosechas } from "./hooks/cosechas/useGetCosechas";
import { Cosechas } from "./types";
import { useGetInsumos } from "./hooks/insumos/useGetInsumos";
import { useGetUnidadesMedida } from "./hooks/unidadesMedida/useGetUnidadesMedida";
import { useGetHerramientas } from "./hooks/herramientas/useGetHerramientas";
import CustomCard from "./CustomCard";
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/toast";

export function CosechasResumenCard() {
  const {
    data: cosechas = [],
    isLoading: loadingCosechas,
    isError,
  } = useGetCosechas();
  const { data: plantaciones = [], isLoading: loadingPlantaciones } = useGetPlantaciones();

  // Función para manejar acciones con verificación de permisos
  if (loadingCosechas || loadingPlantaciones) return <p>Cargando...</p>;
  if (isError) return <p>Hubo un error al cargar la información</p>;

  // Agrupar cosechas por cultivo
  const cosechasPorCultivo = cosechas.reduce((acc, cosecha) => {
    const plantacion = plantaciones.find((p) => p.id === cosecha.fk_Plantacion);
    const cultivoId = plantacion?.cultivo?.id;
    if (!cultivoId || !cosecha.cantidadTotal || cosecha.cantidadTotal <= 0) return acc;

    if (!acc[cultivoId]) {
      acc[cultivoId] = {
        nombreCultivo: plantacion?.cultivo?.nombre ?? "Desconocido",
        imagenEspecie: plantacion?.cultivo?.especies?.img,
        nombreEspecie: plantacion?.cultivo?.especies?.nombre ?? "Desconocido",
        cantidadTotal: 0,
        valorTotal: 0,
        valorGramo: cosecha.valorGramo, // Asumimos que el valor por gramo es el mismo para todas las cosechas del cultivo
        fechaMasReciente: cosecha.fecha,
        cosechas: [],
      };
    }

    acc[cultivoId].cosechas.push(cosecha);
    acc[cultivoId].cantidadTotal += cosecha.cantidadTotal;
    acc[cultivoId].valorTotal += cosecha.valorTotal ?? 0;
    // Actualizar la fecha más reciente
    if (new Date(cosecha.fecha ?? "sin Fecha") > new Date(acc[cultivoId].fechaMasReciente ?? "sin fecha")) {
      acc[cultivoId].fechaMasReciente = cosecha.fecha;
    }

    return acc;
  }, {} as Record<string, {
    nombreCultivo: string | undefined;
    imagenEspecie: string | undefined;
    nombreEspecie: string;
    cantidadTotal: number;
    valorTotal: number;
    valorGramo: number | undefined;
    fechaMasReciente: string | undefined;
    cosechas: Cosechas[];
  }>);
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {Object.values(cosechasPorCultivo).map((cultivo) => (
        <CustomCard
          key={cultivo.nombreCultivo}
          title={cultivo.nombreCultivo}
          image={cultivo.imagenEspecie}
          data={{
            Especie: cultivo.nombreEspecie,
            Cantidad: `${cultivo.cantidadTotal} (g)`,
            "Valor *(g)": cultivo.valorGramo ?? 0,
            "Valor cosecha": `$${cultivo.valorTotal}`,
            "Fecha Cosecha": cultivo.fechaMasReciente ?? "Sin fecha",
          }}
          backgroundColor="white"
          borderColor="green-500"
          textColor="green-800"
        />
      ))}
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