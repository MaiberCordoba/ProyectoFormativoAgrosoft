import { Semilleros } from "../types";
import { Cultivos } from "../types";
import { Especies } from "../types";
import {Lotes} from "../types"
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Asegúrate de que la URL es correcta
  headers: { "Content-Type": "application/json" },
});

// Obtener lista de semilleros
export const getSemilleros = async (): Promise<Semilleros[]> => {
  const response = await apiClient.get("semilleros/"); // Ajustamos la ruta a tu backend
  return response.data;
};


export const registerSemillero = async (semilleroData: Partial<Semilleros>): Promise<Semilleros> => {
  const response = await apiClient.post("semilleros/", semilleroData);
  return response.data;
};


export const updateSemillero = async (semilleroData: Partial<Semilleros> & { id: number }): Promise<Semilleros> => {
  const { id, ...data } = semilleroData;
  const response = await apiClient.put(`semilleros/${id}/`, data);
  return response.data;
};


// Obtener lista de Cultivos
export const getCultivos = async (): Promise<Cultivos[]> => {
  const response = await apiClient.get("cultivos/"); // Ajustamos la ruta a tu backend
  return response.data;
};


export const registerCultivos = async (cultivoData: Partial<Cultivos>): Promise<Cultivos> => {
  const response = await apiClient.post("cultivos/", cultivoData);
  return response.data;
};


export const updateCultivos = async (cultivoData: Partial<Cultivos> & { id: number }): Promise<Cultivos> => {
  const { id, ...data } = cultivoData;
  const response = await apiClient.put(`cultivos/${id}/`, data);
  return response.data;
};


// Obtener lista de Especies
export const getEspecies = async (): Promise<Especies[]> => {
  const response = await apiClient.get("especies/"); // Ajustamos la ruta a tu backend
  return response.data;
};


export const registerEspecie = async (especieData: Partial<Especies>): Promise<Especies> => {
  const response = await apiClient.post("especies/", especieData);
  return response.data;
};


export const updateEspecie = async (especieData: Partial<Especies> & { id: number }): Promise<Especies> => {
  const { id, ...data } = especieData;
  const response = await apiClient.put(`especies/${id}/`, data);
  return response.data;
};


//Obtener lista de Lotes
export const getLotes = async (): Promise<Lotes[]> => {
  const response = await apiClient.get("lote/");
  return response.data;
};

export const registerLotes = async (loteData: Partial<Lotes>): Promise<Lotes> => {
  const response = await apiClient.post("lotes/", loteData);
  return response.data;
};

export const updateLotes = async (loteData: Partial<Lotes> & { id: number }): Promise<Lotes> => {
  const { id, ...data } = loteData;
  const response = await apiClient.put(`lotes/${id}/`, data);
  return response.data;
};

