export interface Semillero {
  id: number;
  fk_especie: number;
  unidades: string;
  fechasiembra: string;
  fechaestimada: string; // Puedes usar Date si lo parseas antes de usarlo

}
