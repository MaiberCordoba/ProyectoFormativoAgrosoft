export interface Semillero {
  id: number;
  fk_Especie: number;
  unidades: string;
  fechaSiembra: string;
  fechaEstimada: string; // Puedes usar Date si lo parseas antes de usarlo
}
