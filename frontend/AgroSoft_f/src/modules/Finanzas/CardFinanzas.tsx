import { useGetPlantaciones } from "../Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { useGetCosechas } from "./hooks/cosechas/useGetCosechas";

export function CosechasResumenCard() {
  const { data: cosechas = [], isLoading: loadingCosechas, isError } = useGetCosechas();
  const { data: plantaciones = [], isLoading: loadingPlantaciones } = useGetPlantaciones();

  const total = cosechas.reduce((acc, c) => acc + c.cantidad, 0);

  if (loadingCosechas || loadingPlantaciones ) return <p>Cargando...</p>;
  if (isError) return <p>Hubo un error al cargar la información</p>;

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {cosechas.map((cosecha) => {
        const plantacion = plantaciones.find(p => p.id === cosecha.fk_Plantacion);

        return (
          <div
          key={cosecha.id}
          className="w-30 h-30 bg-white shadow-md rounded-md border p-2 text-sm flex flex-col justify-center"
          >
          <img
          src={plantacion?.cultivo.especies.img}
          alt={plantacion?.cultivo.especies.nombre}
          className="w-16 h-16 object-cover rounded mx-auto my-2"
          />
            <p>
              <strong>Producto</strong>: {plantacion?.cultivo?.nombre ?? "Desconocido"}
            </p>
            <p><strong>Especie</strong>: {plantacion?.cultivo.especies.nombre}</p>
            <p><strong>Cantidad</strong>: {cosecha.cantidad}</p>
            <p><strong>Valor cosecha</strong>: {cosecha.valorTotal}</p>
            <p><strong>Fecha Cosecha</strong>: {cosecha.fecha}</p>
          </div>
        );
      })}

      <div className="w-30 h-30 bg-white border border-green-400 rounded-md p-2 text-center flex flex-col justify-center">
        <p className="text-sm font-semibold text-green-800">Cantidad Cosechas</p>
        <p className="text-xl font-bold text-green-900">{total}</p>
      </div>
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
