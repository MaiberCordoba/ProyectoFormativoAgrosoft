import apiClient from "@/api/apiClient";
import { SensorData } from "../types/sensorTypes";

export const get = async ():Promise<SensorData[]> => {
    const response = await apiClient.get("sensor/");
    return response.data
};

export const post = async (data?:any):Promise<SensorData> => {
    const response = await apiClient.post<SensorData>('sensor/',data);
    return response.data
}

export const patch = async ( id: number, data: Partial<SensorData>): Promise<SensorData> => {
    const response = await apiClient.patch<SensorData>(`sensor/${id}/`, data);
    return response.data;
  };


export const deleteSensor= async (id: number): Promise<SensorData> => {
    const response = await apiClient.delete<SensorData>(`sensor/${id}/`);
    return response.data
}