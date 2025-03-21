import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
//tipado
import { Cultivos } from "../types";
import { Semilleros } from "../types";
import { Especies } from "../types";
import { Lotes } from "../types";
//conexion con el nakend
import { getSemilleros, registerSemillero, updateSemillero } from "../api/Apis";
import { getCultivos,registerCultivos, updateCultivos } from "../api/Apis";
import { getEspecies, registerEspecie, updateEspecie } from "../api/Apis";
import { getLotes, registerLotes, updateLotes } from "../api/Apis";


//useCultivo
export const useCultivos = () => {
    return useQuery({
      queryKey: ["cultivos"], 
      queryFn: getCultivos,
    });
  };

//UseRegisterCultivo
export const useRegisterCultivo = () => {
  return useMutation<Cultivos, Error, Partial<Cultivos>>({
    mutationFn: registerCultivos,
  });
};;

//useUpdateCultivo
export const useUpdateCultivo = () => {
    return useMutation({
      mutationFn: async ({ id, ...data }: { id: number } & Partial<Cultivos>) => {
        return updateCultivos({ id, ...data });
      },
    });
  };
  

//useSemillero
export const useSemilleros = () => {
    return useQuery({
      queryKey: ["semilleros"], 
      queryFn: getSemilleros,
    });
  };
  

//UseRegisterSemillero
export const useRegisterSemillero = () => {
    return useMutation<Semilleros, Error, Partial<Semilleros>>({
      mutationFn: registerSemillero,
    });
  };

//UseUpdateSemillero
export const useUpdateSemillero = () => {
    return useMutation({
      mutationFn: async ({ id, ...data }: { id: number } & Partial<Semilleros>) => {
        return updateSemillero({ id, ...data });
      },
    });
  };

//UseEspecies
export const useEspecies = () => {
  return useQuery({
    queryKey: ["especies"], 
    queryFn: getEspecies,
  });
};

//useRegisterEspecie
export const useRegisterEspecie = () => {
  return useMutation<Especies, Error, Partial<Especies>>({
    mutationFn: registerEspecie,
  });
};

//useUpdateEspecie
export const useUpdateEspecie = () => {
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<Especies>) => {
      return updateEspecie({ id, ...data });
    },
  });
};

// Hook para obtener lotes
export const useLotes = () => {
  return useQuery({
    queryKey: ["lotes"],
    queryFn: getLotes,
  });
};

// Hook para registrar un lote
export const useRegisterLotes = () => {
  return useMutation<Lotes, Error, Partial<Lotes>>({
    mutationFn: registerLotes,
  });
};

// Hook para actualizar un lote
export const useUpdateLotes = () => {
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<Lotes>) => {
      return updateLotes({ id, ...data });
    },
  });
};
  