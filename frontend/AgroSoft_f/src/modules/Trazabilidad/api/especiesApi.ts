import apiClient from "@/api/apiClient";
import { Especies } from "../types";


export const getEspecies = async (): Promise<Especies[]> => {
  const response = await apiClient.get("especies/");
  return response.data;
};


export const postEspecies = async (data: FormData): Promise<Especies> => {
  const response = await apiClient.post<Especies>("especies/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


export const patchEspecies = async (
  id: number,
  data: FormData | Partial<Especies>
): Promise<Especies> => {
  const response = await apiClient.patch<Especies>(`especies/${id}/`, data, {
    headers:
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
  });
  return response.data;
};

<<<<<<< HEAD
// Eliminar especie

export const deleteEspecies = async (id: number): Promise<Especies> => {
    const response = await apiClient.delete<Especies>(`especies/${id}/`);
    return response.data
}
=======

export const deleteEspecies = async (id: number): Promise<void> => {
  await apiClient.delete(`especies/${id}/`);
};
>>>>>>> 1b9a9e6858cb65236c7f46060617be0007ff3aa6
