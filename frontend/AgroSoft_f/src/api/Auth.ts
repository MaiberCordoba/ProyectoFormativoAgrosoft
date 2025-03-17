import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Asegúrate de que en .env no tiene "/" al final

export const login = async ({ email, password }: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}token/`, {
      correoElectronico: email, // Cambia 'username' por 'correoElectronico' si el backend lo espera
      password
    }, {
      headers: { "Content-Type": "application/json" }
    });

    return response.data; // Devuelve los tokens JWT

  } catch (error: any) {
    console.error("Error de autenticación:", error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || "Error en el login");
  }
};

export const getUser = async (token: string) => {
  const response = await axios.get(`${API_URL}usuarios/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};