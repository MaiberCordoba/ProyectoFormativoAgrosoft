export interface ControlDetails {
    control_id: number;
    descripcion: string;
    fecha_control: string | null;
    tipo_control: string | null;
    plaga: {
      nombre: string | null;
    };
    especie: {
      nombre: string | null;
    };
    lote: {
      nombre: string | null;
    };
  }
  
  export interface ControlListItem {
    control_id: number;
    descripcion: string;
    fecha_control: string | null;
    plaga_nombre: string | null;
    especie_nombre: string | null;
    lote_nombre: string | null;
  }
  
  // Reusing existing types from your provided typado
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