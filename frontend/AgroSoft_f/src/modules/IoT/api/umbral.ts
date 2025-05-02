import apiClient from "@/api/apiClient";
import axios from "axios";
import { Umbral } from "../types/sensorTypes";

export const getUmbrales = async (): Promise<Umbral[]> => {
  const response = await apiClient.get("umbral");
  return response.data;
};

export const postUmbral = async (data: Omit<Umbral, "id">): Promise<Umbral> => {
  const response = await apiClient.post("umbral", data);
  return response.data;
};

export const putUmbral = async (id: number, data: Partial<Umbral>): Promise<Umbral> => {
  const response = await axios.patch(`http://localhost:8000/api/umbral/${id}/`, data);
  return response.data;
};

export const deleteUmbral = async (id: number): Promise<Umbral> => {
  const response = await apiClient.delete(`/umbral/${id}/`);
  return response.data;
};
