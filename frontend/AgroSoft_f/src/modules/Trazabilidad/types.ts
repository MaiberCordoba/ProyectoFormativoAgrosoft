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
  fk_tipoespecie?: {
    nombre: string;
  };
  tipo_especie_nombre?: string | null;
}

export interface Semilleros{
  id: number;
  unidades: number;
  fechasiembra: string;
  fechaestimada: string;
  Cultivos?: Especies;
  fk_Cultivo: {
    nombre: string;
    Especies?: Especies;
    fk_Especie: {
      nombre: string;
    };
  };
}

export interface Cultivos{
  id?: number;
  nombre : string;
  unidades: number;
  activo: boolean;
  fechaSiembra: string;
  Especies?: Especies;
  fk_Especie: {
    nombre: string;
  };
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
  Cultivos?: Cultivos;
  fk_Cultivo: {
    nombre: string;
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
