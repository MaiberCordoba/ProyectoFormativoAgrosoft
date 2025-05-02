export interface TiposEspecie{
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
  TiposEspecie?: TiposEspecie;
  fk_tipoespecie?: number | null;
  tipo_especie_nombre?: string | null;
  Variedad?: Variedad;
  fk_variedad: number;
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
  unidades: number;
  activo: boolean;
  fechaSiembra: string;
  Especies?: Especies;
  fk_Especie: number;
  Semillero?: Semilleros;
  fk_semillero: number;
}

export interface Lotes{
  id?: number;
  nombre: string;
  descripcion: string;
  tamX: number;
  tamY: number;
  estado: boolean;
  posX: number;
  posY: number;
}

export interface Eras{
  id?: number;
  tamX: number;
  tamY: number;
  posX: number;
  posY: number;
  Lotes?: Lotes;
  fk_lote_id: number; 
}

export interface Plantaciones{
  id: number;
  Especies?: Especies;
  fk_Especie: number;
  Eras?: Eras;
  fk_Era: number;
}

export interface Variedad{
  id: number;
  nombre: string;
}
