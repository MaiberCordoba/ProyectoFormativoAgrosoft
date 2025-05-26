import apiClient from "@/api/apiClient";
import { Plantaciones } from "../types";

export const getPlantaciones = async (): Promise<Plantaciones[]> => {
  const response = await apiClient.get("plantaciones/");
  return response.data.map((item: any) => ({
    id: item.id,
    semillero: item.semillero
      ? {
          id: item.semillero.id,
          unidades: item.semillero.unidades,
          fechasiembra: item.semillero.fechasiembra,
          fechaestimada: item.semillero.fechaestimada,
          cultivo: {
            id: item.semillero.cultivo.id,
            nombre: item.semillero.cultivo.nombre,
            activo: item.semillero.cultivo.activo,
            especies: {
              id: item.semillero.cultivo.especies.id,
              nombre: item.semillero.cultivo.especies.nombre,
              descripcion: item.semillero.cultivo.especies.descripcion,
              img: item.semillero.cultivo.especies.img,
              tiempocrecimiento:
                item.semillero.cultivo.especies.tiempocrecimiento,
              tiposEspecie: item.semillero.cultivo.especies.tiposEspecie,
              fk_tipoespecie: item.semillero.cultivo.especies.fk_tipoespecie,
            },
            fk_Especie: item.semillero.cultivo.fk_Especie,
          },
          fk_Cultivo: item.semillero.fk_Cultivo,
        }
      : null,
    cultivo: {
      id: item.cultivo.id,
      nombre: item.cultivo.nombre,
      activo: item.cultivo.activo,
      especies: {
        id: item.cultivo.especies.id,
        nombre: item.cultivo.especies.nombre,
        descripcion: item.cultivo.especies.descripcion,
        img: item.cultivo.especies.img,
        tiempocrecimiento: item.cultivo.especies.tiempocrecimiento,
        tiposEspecie: item.cultivo.especies.tiposEspecie,
        fk_tipoespecie: item.cultivo.especies.fk_tipoespecie,
      },
      fk_Especie: item.cultivo.fk_Especie,
    },
    eras: item.eras,
    unidades: item.unidades,
    fechaSiembra: item.fechaSiembra,
    creado: item.creado,
    fk_semillero: item.fk_semillero,
    fk_Cultivo: item.fk_Cultivo,
    fk_Era: item.fk_Era,
  }));
};

export const postPlantaciones = async (data: any): Promise<Plantaciones> => {
  const response = await apiClient.post<Plantaciones>("plantaciones/", data);
  return response.data;
};

export const patchPlantaciones = async (
  id: number,
  data: Partial<Plantaciones>
): Promise<Plantaciones> => {
  const response = await apiClient.patch<Plantaciones>(
    `plantaciones/${id}/`,
    data
  );
  return response.data;
};

export const deletePlantaciones = async (id: number): Promise<Plantaciones> => {
  const response = await apiClient.delete<Plantaciones>(`plantaciones/${id}/`);
  return response.data;
};
