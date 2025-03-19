import apiClient from "@/api/apiClient";
import { Afecciones } from "../types";

export const getAfecciones = async ():Promise<Afecciones[]> => {
    const response = await apiClient.get("plaga/");
    return response.data
};