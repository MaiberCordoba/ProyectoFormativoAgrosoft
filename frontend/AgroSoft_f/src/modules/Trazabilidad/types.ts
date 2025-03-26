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
    TiposEspecie?: TiposEspecie;
    fk_TipoEspecie?: number;
}

export interface Semilleros{
  id: number;
  unidades: number;
  fechaSiembra: string;
  fechaEstimada: string;
  Especies?: Especies;
  fk_Especie: number;
}

export interface Cultivos{
  id: number;
  nombre: string;
  unidades: number;
  activo: boolean;
  fechaSiembra: string;
  Especies?: Especies;
  fk_Especie: number;
}

export interface Lotes{
  id: number;
  nombre: string;
  descripcion: string;
  tamX: number;
  tamY: number;
  estado: boolean;
  posX: number;
  posY: number;
}

export interface Eras{
  id: number;
  tamX: number;
  tamY: number;
  posX: number;
  posY: number;
  estado: boolean;
  Lotes?: Lotes;
  fk_Lote?: number; 
}

export interface Plantaciones{
  id: number;
  Cultivos: Cultivos;
  fk_Cultivo: number;
  Eras: Eras;
  fk_Era: number;
}
