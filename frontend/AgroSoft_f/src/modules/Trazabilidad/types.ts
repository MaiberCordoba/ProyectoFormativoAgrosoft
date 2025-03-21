export interface Semilleros {
  id: number;
  fk_Especie: number;
  unidades: string;
  fechaSiembra: string;
  fechaEstimada: string; // Puedes usar Date si lo parseas antes de usarlo
}

export interface Cultivos {
  id: number;
  nombre: string;
  fk_Especie: number | null;
  unidades: number | string;  
  fechaSiembra: string | null;  
  activo: boolean;
}

export interface Especies {
  id: number;
  fk_TiposEspecie: number;
  nombre: string;
  descripcion: string;
  img: string;
  tiempoCrecimiento: number;
}

export interface Lotes {
  id: number;
  nombre: string;
  descripcion?: string;
  tamX: number;
  tamY: number;
  estado: boolean;
  posX: number;
  posY: number;
}



