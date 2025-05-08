import apiClient from "@/api/apiClient";
import { Plantaciones } from "../types";

// Transforma los datos del backend al formato que espera tu app
export const getPlantaciones = async (): Promise<Plantaciones[]> => {
  const response = await apiClient.get("plantaciones/");
  return response.data.map((item: any) => ({
    id: item.id,
    fk_Cultivo: {
      nombre: item.cultivo?.nombre || "Sin nombre",
    },
    fk_semillero: {
      unidades: item.semillero?.unidades || 0,
      fechasiembra: item.semillero?.fechasiembra || "N/A",
    },
    fk_Era: {
      id: item.eras?.id || 0,
    },
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
  const response = await apiClient.patch<Plantaciones>(`plantaciones/${id}/`, data);
  return response.data;
};

export const deletePlantaciones = async (id: number): Promise<Plantaciones> => {
  const response = await apiClient.delete<Plantaciones>(`plantaciones/${id}/`);
  return response.data;
};
