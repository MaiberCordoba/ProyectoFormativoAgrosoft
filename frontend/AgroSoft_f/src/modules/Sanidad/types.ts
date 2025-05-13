
  export interface TiposAfecciones {
    id: number;
    nombre: string;
    descripcion: string;
    img: string;
  }
  
  export interface Afecciones {
    id: number;
    nombre: string;
    descripcion: string;
    img: string;
    tipoPlaga?: TiposAfecciones;
    fk_Tipo?: number;
  }
  
  export interface TipoControl {
    id: number;
    nombre: string;
    descripcion: string;
  }
  
  export interface Controles {
    id: number;
    fk_Afeccion?: number;
    fk_TipoControl?: number;
    fechaControl: string;
    descripcion: string;
    fk_Usuario?: number;
  usuario?: {
    id: number;
    nombre: string;
  };
}
  

  export interface ControlDetails {
    id: number;
    descripcion: string;
    fechaControl: string;
    tipoControl: TipoControl;
    afeccionCultivo: AfeccionesCultivo & {
      plaga: Afecciones;
    };
  }
  
  export enum EstadoAfeccion {
    ST = "Detectado",
    EC = "EnTratamiento",
    EL = "Erradicado"
  }
  
  export interface AfeccionesCultivo {
    id: number;
    fk_Plantacion: number;
    fk_Plaga: number;
    fechaEncuentro: string;
    estado: keyof typeof EstadoAfeccion;
  }