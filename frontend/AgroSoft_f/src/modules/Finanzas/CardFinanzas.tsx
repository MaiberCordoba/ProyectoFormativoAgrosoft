import { useState } from "react";
import { useGetPlantaciones } from "../Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { useGetCosechas } from "./hooks/cosechas/useGetCosechas";
import { CrearVentasModal } from "./components/ventas/CrearVentasModal";
import { Cosechas } from "./types";
import { useGetInsumos } from "./hooks/insumos/useGetInsumos";
import { useGetUnidadesMedida } from "./hooks/unidadesMedida/useGetUnidadesMedida";
import { useGetHerramientas } from "./hooks/herramientas/useGetHerramientas";
import CustomCard from "./CustomCard";

export function CosechasResumenCard() {

  const [modalVentas,setModalVentas] = useState(false)
  const [cosechaSeleccionada, setCosechaSeleccionada] = useState<Cosechas | null>(null)

  const { data: cosechas = [], isLoading: loadingCosechas, isError } = useGetCosechas();
  const { data: plantaciones = [], isLoading: loadingPlantaciones } = useGetPlantaciones();


  if (loadingCosechas || loadingPlantaciones ) return <p>Cargando...</p>;
  if (isError) return <p>Hubo un error al cargar la información</p>;

  const handleVentaCosecha = (cosecha: Cosechas) =>{
    setCosechaSeleccionada(cosecha)
    setModalVentas(true)
  }

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {cosechas.map((cosecha) => {
        const plantacion = plantaciones.find(p => p.id === cosecha.fk_Plantacion);
        return (

          <>
            <CustomCard
              title={plantacion?.cultivo?.nombre ?? "Desconocido"}
              image={plantacion?.cultivo.especies.img}
              data={{
                "Especie": plantacion?.cultivo.especies.nombre,
                "Cantidad": cosecha.cantidad,
                "Valor cosecha": `$${cosecha.valorTotal}`,
                "Fecha Cosecha": cosecha.fecha,
              }}
              backgroundColor="white"
              borderColor="green-500"
              textColor="green-800"
              footerButtons={[
                {
                  label: "Vender",
                  color: "primary",
                  size : "sm",
                  onPress: () => handleVentaCosecha(cosecha),
                },
              ]}
            />
          </>
        );
      })}
      {modalVentas && cosechaSeleccionada && (
        <CrearVentasModal
        onClose={() => setModalVentas(false)}
        onCreate={handleVentaCosecha}
        cosecha={cosechaSeleccionada}
      />
      )}
    </div>
  );
}

export function PlantacionesCard() {

  const { data: plantaciones = [], isLoading: loadingPlantaciones, isError} = useGetPlantaciones();

  if(loadingPlantaciones) return <p>Cargando...</p>
  if(isError) return <p>Error al cargar...</p>

  return(
     <div className="flex flex-wrap gap-4 mb-6">
      {plantaciones.map((plantacion) => {

        return (
          
          <div
          key={plantacion.id}
          className="w-30 h-30 bg-white shadow-md rounded-md border p-2 text-sm flex flex-col justify-center"
          >
            <p>
              <strong>Cultivo</strong>: {plantacion?.cultivo?.nombre ?? "Desconocido"}
            </p>
            <p><strong>Estado</strong>: {plantacion?.cultivo.activo ? "Activo" : "Inactivo"}</p>
            <p><strong>Fecha de siembra</strong>: {plantacion.fechaSiembra}</p>
          </div>
        );
      })}
    </div>

  )
}

export function InsumosCard(){
const { data: insumos = [], isLoading: loadingInsumos, isError} = useGetInsumos();
const { data: unidades = []} = useGetUnidadesMedida();

  if(loadingInsumos) return <p>Cargando...</p>
  if(isError) return <p>Error al cargar...</p>

  return(
     <div className="flex flex-wrap gap-4 mb-6">
      {insumos.map((insumo) => {
        const unidad = unidades.find(p => p.id === insumo.fk_UnidadMedida)
        return (
          <>
          <CustomCard
            image={insumo.fichaTecnica}
            title={insumo.nombre}
            data={{
              "Cantidad Disponible": insumo.unidades,
              "Compuesto Activo": insumo.compuestoActivo,
              "Contenido Unidad": insumo.contenido
                ? `${insumo.contenido} ${unidad?.abreviatura}`
                : "No disponible",
            }}
          />
          </>
        );
      })}
    </div>
  )
}

import { Wrench } from "lucide-react";
import { useGetTiempoActividadControl } from "./hooks/tiempoActividadControl/useGetTiempoActividadDesecho";
import { useGetUnidadesTiempo } from "./hooks/unidadesTiempo/useGetUnidadesTiempo";
import { useGetActividades } from "./hooks/actividades/useGetActividades";
import { useGetUsers } from "../Users/hooks/useGetUsers";
import { useGetControles } from "../Sanidad/hooks/controles/useGetControless";
import EliminarTiempoActividadControlModal from "./components/tiempoActividadControl/EliminarTiempoActividadControl";
import EditarTiempoActividadControlModal from "./components/tiempoActividadControl/EditarTiempoActividadControlModal";
import { useEliminarTiempoActividadControl } from "./hooks/tiempoActividadControl/useEliminarTiempoActividadDesecho";
import { useEditarTiempoActividadControl } from "./hooks/tiempoActividadControl/useEditarTiempoActividadDesecho";
import { useGetSalarios } from "./hooks/salarios/useGetSalarios";

export function HerramientasCard() {
  const {
    data: Herramientas,
    isLoading: loadingHerramientas,
    isError,
  } = useGetHerramientas();

  if (loadingHerramientas) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar...</p>;

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {Herramientas?.map((herramienta) => {
        return (
          <CustomCard
            title={herramienta.nombre}
            icon={
              <Wrench size={40} className="text-gray-700" />
            }
            data={{
              Unidades: herramienta.unidades,
            }}
          />
        );
      })}
    </div>
  );
}

export function TiempoActividadCard() {
  const { data: tiempoActividad, isLoading, isError } = useGetTiempoActividadControl();
  const { data: unidades = [] } = useGetUnidadesTiempo();
  const { data: Actividades = [] } = useGetActividades();
  const { data: usuarios = [] } = useGetUsers();
  const { data: controles = [] } = useGetControles();
  const { data: salarios = [] } = useGetSalarios();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    tiempoActividadControlEditada,
    handleEditar,
  } = useEditarTiempoActividadControl();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    tiempoActividadControlEliminada,
    handleEliminar,
  } = useEliminarTiempoActividadControl();

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar...</p>;

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {tiempoActividad?.map((tiempoAC) => {
        const unidad = unidades.find((p) => p.id === tiempoAC.fk_unidadTiempo);
        const actividad = Actividades.find((p) => p.id === tiempoAC.fk_actividad);
        const usuario = usuarios.find((p) => p.id === actividad?.fk_Usuario);
        const control = controles.find((p) => p.id === tiempoAC?.fk_control);
        const salario = salarios.find((p) => p.id === tiempoAC?.fk_salario);

        return (
          <CustomCard
            key={tiempoAC.id}
            title={actividad?.titulo || control?.descripcion || "Sin nombre"}
            description={tiempoAC.salario?.nombre}
            data={{
              Termino: tiempoAC.fecha,
              Duración: `${tiempoAC.tiempo} ${unidad?.nombre}`,
              "Costo de la actividad": `$${tiempoAC.valorTotal}`,
              Realizo: usuario?.nombre || control?.usuario?.nombre || "No definido",
              Salario : salario?.nombre
            }}
            footerButtons={[
              {
                label: "Editar",
                color: "primary",
                size: "sm",
                onPress: () => handleEditar(tiempoAC),
              },
              {
                label: "Eliminar",
                color: "danger",
                size: "sm",
                onPress: () => handleEliminar(tiempoAC),
              },
            ]}
          />
        );
      })}

      {isEditModalOpen && tiempoActividadControlEditada && (
        <EditarTiempoActividadControlModal
          tiempoActividadControl={tiempoActividadControlEditada}
          onClose={closeEditModal}
        />
      )}

      {isDeleteModalOpen && tiempoActividadControlEliminada && (
        <EliminarTiempoActividadControlModal
          tiempoActividadControl={tiempoActividadControlEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}


