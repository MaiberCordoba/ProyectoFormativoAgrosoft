import apiClient from "@/api/apiClient";
import { Afecciones } from "../types";

export const getAfecciones = async ():Promise<Afecciones[]> => {
    const response = await apiClient.get("plaga/");
    return response.data
};


export const patchAfecciones = async ( id: number, data: Partial<Afecciones>): Promise<Afecciones> => {
    const response = await apiClient.patch<Afecciones>(`plaga/${id}/`, data);
    return response.data;
  };