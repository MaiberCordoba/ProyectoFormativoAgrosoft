export interface TiposEspecie {
  id: number;
  nombre: string;
  descripcion: string;
  img: string;
}

export interface Especies {
  id: number;
  nombre: string;
  descripcion: string;
  img?: string;
  tiempocrecimiento: string;
  tiposEspecie: TiposEspecie;
  fk_tipoespecie: number;
}

export interface Cultivo {
  id: number;
  nombre: string;
  activo: boolean;
  especies: Especies;
  fk_Especie: number;
}

export interface Semillero {
  id: number;
  unidades: number;
  fechasiembra: string;
  fechaestimada: string;
  cultivo: Cultivo;
  fk_Cultivo: number;
}

export interface Lotes {
  id: number;
  nombre: string;
  descripcion: string;
  latI1: number | null;
  longI1: number | null;
  latS1: number | null;
  longS1: number | null;
  latI2: number | null;
  longI2: number | null;
  latS2: number | null;
  longS2: number | null;
  estado: boolean | null;
}

export interface Eras {
  id: number;
  tipo: string;
  fk_lote: Lotes ;
  latI1: number | null;
  longI1: number | null;
  latS1: number | null;
  longS1: number | null;
  latI2: number | null;
  longI2: number | null;
  latS2: number | null;
  longS2: number | null;
}

export interface Plantaciones {
  id: number;
  fk_Cultivo: { nombre: string };
  fk_semillero: { unidades: number; fechasiembra: string };
  fk_Era: { id: number };
}


export interface PlantacionCreate {
  fk_Cultivo: number;
  fk_Era: number;
  fk_semillero: number;
  unidades: number;
  fechaSiembra: string;
}



