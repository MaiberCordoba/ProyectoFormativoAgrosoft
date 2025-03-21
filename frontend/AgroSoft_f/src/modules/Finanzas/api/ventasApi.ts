import apiClient from "@/api/apiClient";
import { Ventas } from "../types";

export const getVentas = async (): Promise<Ventas[]> => {
  const response = await apiClient.get("Ventas/")
  return response.data
}

export const postVentas = async (VentasData: Partial<Ventas>): Promise<Ventas> => {
  const response = await apiClient.post("Ventas/", VentasData);
  return response.data;
};

export const putVentas = async (id: number, data: Ventas): Promise<Ventas> => {
  const response = await apiClient.put(`Ventas/${id}/`, data);
  return response.data;
}

export const deleteVentas = async (id: number): Promise<void> => {
  await apiClient.delete(`Ventas/${id}/`)
}