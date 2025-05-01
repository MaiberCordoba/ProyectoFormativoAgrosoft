export interface TiposEspecie{
  id: number;
  nombre: string;
  descripcion: string;
  img: string;
}

export interface Especies{
    id: number;
    nombre: string;
    descripcion: string;
    img?: string;
    tiempocrecimiento: number;
    TiposEspecie?: TiposEspecie;
    fk_tipoespecie?: number | null;
    tipo_especie_nombre?: string | null;
}

export interface Semilleros{
  id: number;
  unidades: number;
  fechasiembra: string;
  fechaestimada: string;
  Especies?: Especies;
  fk_especie: number;
}

export interface Cultivos{
  id?: number;
  nombre: string;
  unidades: number;
  activo: boolean;
  fechaSiembra: string;
  Especies?: Especies;
  fk_Especie: number;
}

export interface Lotes{
  id?: number;
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
  estado: boolean;
}

export interface Eras{
  id?: number;
  latI1: number;
  longI1: number;
  latS1: number;
  longS1: number;
  latI2: number;
  longI2: number;
  latS2: number;
  longS2: number;
  tipo: string;
  Lotes?: Lotes;
  fk_lote: number; 
}

export interface Plantaciones{
  id: number;
  Cultivos?: Cultivos;
  fk_Cultivo: number;
  Eras?: Eras;
  fk_Era: number;
}
