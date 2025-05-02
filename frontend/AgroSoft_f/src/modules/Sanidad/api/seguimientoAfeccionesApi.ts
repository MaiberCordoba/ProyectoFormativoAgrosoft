import apiClient from "@/api/apiClient";
import { ControlDetails,ControlListItem  } from "../types";

export const getSeguimientoAfecciones = async (): Promise<ControlListItem[]> => {
  const response = await apiClient.get("/sanidad/segAfecciones");
  return response.data;
};

export const getSeguimientoAfeccionesById = async (id: string): Promise<ControlDetails> => {
  const response = await apiClient.get(`/sanidad/segAfecciones/${id}`);
  return response.data;
}