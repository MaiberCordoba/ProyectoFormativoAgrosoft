// types.ts
export interface TiposEspecie {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Especies {
  id: number;
  nombre: string;
  descripcion: string;
  img?: string;
  tiempocrecimiento: string;
  tiposEspecie?: TiposEspecie;
  fk_tipoespecie: number;
}

export interface Cultivo {
  id: number;
  nombre: string;
  activo: boolean;
  especies?: Especies;
  fk_Especie?:number;
  img?: string;
}

export interface Semillero {
  id: number;
  unidades: number;
  fechasiembra: string;
  fechaestimada: string;
  cultivo?: Cultivo;
  fk_Cultivo: number;
}

export interface Lotes {
  id: number;
  nombre: string;
  descripcion: string;
  latI1: number;
  longI1: number;
  latS1: number;
  longS1: number;
  latI2: number;
  longI2: number;
  latS2: number;
  longS2: number;
  estado: boolean | null;
}

export interface Eras {
  id?: number;
  tipo: string;
  fk_lote: number;
  Lote?:Lotes;
  latI1: number;
  longI1: number;
  latS1: number;
  longS1: number;
  latI2: number;
  longI2: number;
  latS2: number;
  longS2: number;
}

export interface Plantaciones {
  id: number;
  semillero: Semillero | null;
  cultivo: Cultivo | null;
  eras: Eras;
  unidades: number;
  fechaSiembra: string;
  creado: string;
  fk_semillero: number | null;
  fk_Cultivo: number | null;
  fk_Era: number;
}

export interface PlantacionCreate {
  fk_Cultivo?: number | null;
  fk_Era: number;
  fk_semillero: number | null;
  unidades: number;
  fechaSiembra: string;
}

export interface MapComponentProps {
  filtroEspecie?: string;
}
