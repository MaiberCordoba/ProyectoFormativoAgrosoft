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



export interface Plantaciones{
  id: number;
  Especies?: Especies;
  fk_Especie: number;
  Cultivos?: Cultivos;
  fk_Cultivo: { // Nombre correcto según endpoint
    unidades: number;
    fk_Semillero: {
      fk_especie: {
        nombre: string;
        id:number;
      };
    };
  };
  Eras?: Eras;
  fk_Era: number;
}


export interface Variedad{
  id: number;
  nombre: string;
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
  plantaciones?: Plantaciones[];
}

