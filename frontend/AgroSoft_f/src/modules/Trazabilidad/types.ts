export interface Semillero {
  id: number;
  fk_Especie: number;
  unidades: string;
  fechaSiembra: string;
  fechaEstimada: string; // Puedes usar Date si lo parseas antes de usarlo
}

export interface Cultivos {
  id: number;
  nombre: string;
  fk_especie: number;
  unidades: string;
  fechaSiembra: string;
  activo: boolean; // Para indicar si el cultivo está activo o no
}


