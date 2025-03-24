import apiClient from "@/api/apiClient";
import { Afecciones } from "../types";

export const getTipoAfecciones = async ():Promise<Afecciones[]> => {
    const response = await apiClient.get("tipoPlaga/");
    return response.data
};