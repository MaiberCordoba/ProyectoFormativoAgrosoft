import apiClient from "@/api/apiClient";
import { Ventas } from "../types";

interface PostVentasData {
  cosechas: { cosecha: number; cantidad: number; unidad_medida: number; descuento: number }[];
}

interface PatchVentasData {
  cosechas: { cosecha: number; cantidad: number; unidad_medida: number; descuento: number }[];
}

export const getVentas = async (): Promise<Ventas[]> => {
  const response = await apiClient.get("ventas/");
  return response.data;
};

export const postVentas = async (ventasData: PostVentasData): Promise<Ventas> => {
  const response = await apiClient.post("ventas/", ventasData);
  return response.data;
};

export const patchVentas = async (id: number, data: PatchVentasData): Promise<Ventas> => {
  const response = await apiClient.patch<Ventas>(`ventas/${id}/`, data);
  return response.data;
};

export const deleteVentas = async (id: number): Promise<void> => {
  await apiClient.delete(`ventas/${id}/`);
};