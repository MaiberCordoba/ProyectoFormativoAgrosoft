import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';

const fetchUsers = async () => {
  const { data } = await apiClient.get('usuarios/'); // Ruta de prueba
  return data;
};

export function useFetchUsers() {
  return useQuery({ queryKey: ['users'], queryFn: fetchUsers });
}
