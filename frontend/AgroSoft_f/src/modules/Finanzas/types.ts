//Creacion de los tipos de datos
import { Controles } from "../Sanidad/types"
import { Cultivos, Lotes } from "../Trazabilidad/types"
import { User } from "../Users/types"

export interface ResumenEconomicoListado {
    cultivo_id: number;
    nombre_especie: string | null;
    unidades: number;
    fecha_siembra: string | null;
    costo_insumos: number;
    total_mano_obra: number;
    total_costos: number;
    total_ventas: number;
    beneficio: number;
    relacion_beneficio_costo: number;
    
  }

  export interface DetalleResumenEconomico {
    cultivo_id: number;
    fecha_siembra: string | null;
    unidades: number;
    nombre: string | null;
    total_insumos: number;
    total_mano_obra: number;
    total_costos: number;
    total_ventas: number;
    beneficio: number;
    relacion_beneficio_costo: number;
    detalle: {
      num_actividades: number;
      num_controles: number;
      num_cosechas: number;
    };
  }

export interface Actividades {
    id : number,
    fk_Cultivo?: number,
    cultivo?: Cultivos,
    fk_Usuario? : number,
    usuario? : User,
    fk_TipoActividad : number,
    tipoActividad : TipoActividad,
    titulo : string,
    descripcion : string,
    fecha : string,
    estado : "AS" | "CO" | "CA"
}

export interface Cosechas {
    id : number,
    fk_Cultivo? : number,
    cultivo? : Cultivos,
    fk_UnidadMedida : number,
    unidadMedida : UnidadesMedida
    cantidad : number,
    cantidadTotal :number,
    cantidadDisponible : number,
    fecha : string,
    precioReferencial : number
}

export interface Desechos {
    id : number,
    fk_Cultivo? : number,
    cultivo? : Cultivos,
    fk_TipoDesecho? : number,
    tipoDesecho? : TiposDesechos,
    nombre : string,
    descripcion : string
}

export interface Herramientas {
    id : number,
    fk_Lote?: number,
    lote? : Lotes ,
    nombre : string,
    descripcion : string,
    unidades : number
}

export interface Insumos {
    id : number,
    nombre : string,
    descripcion : string,
    precio : number,
    compuestoActivo : string, 
    contenido : number,
    fichaTecnica : string,
    unidades : number,
    fk_UnidadMedida : number,
    unidadMedida : UnidadesMedida,
    valorTotalInsumos : number,
    cantidadTotal : number,
    cantidadDisponible : number
}

export interface MovimientoInventario {
    id : number,
    tipo : "entrada" | "salida" ,
    cantidad : number,
    descripcion : string,
    fk_Insumo : number,
    insumo : Insumos,
    fk_Herramienta : number,
    herramienta : Herramientas,
    fk_Cosecha : number,
    cosecha : Cosechas,
    fk_Usuario : number,
    usuario : User,
}

export interface Salarios{
    id : number,
    nombre : string,
    monto : number, 
    horas : number,
    monto_minutos : number,
    estado : "activo" | "inactivo"
}

export interface TiempoActividadControl {
    id : number,
    tiempo : number,
    valorTotal : number,
    fk_unidadTiempo : number,
    unidadTiempo : UnidadesTiempo,
    fk_actividad : number,
    actividad : Actividades,
    fk_control : number,
    control : Controles,
    fk_salario : number,
    salario : Salarios
}

export interface TipoActividad {
    id : number,
    nombre : string
}

export interface TiposDesechos {
    id : number,
    nombre : string,
    descripcion : string
}

export interface UnidadesMedida {
    id: number;
    nombre: string;
    abreviatura: string;
    tipo:  keyof typeof TipoUnidadMedida; // Se usará "MASA" o "VOLUMEN"
    equivalenciabase: number;
}

export interface UnidadesTiempo {
    id: number;
    nombre: string;
    equivalenciabase: number;
}

export interface UsosInsumos {
    id : number,
    fk_Insumo? : number,
    insumo? : Insumos ,
    fk_Actividad? : number,
    actividad? : Actividades,
    fk_Control : number,
    control : Controles,
    cantidadProducto : number,
    fk_UnidadMedida : number,
    unidadMedida : UnidadesMedida,
    costoUsoInsumo : number,
}

export interface UsosHerramientas {
    id : number,
    fk_Herramientas? : number,
    herramienta?: Herramientas,
    fk_Actividad? : number,
    actividad? : Actividades
}

export interface Ventas {
    id : number,
    fk_Cosecha? : number,
    cosecha? : Cosechas,
    precioUnitario : number,
    fecha : string,
    fk_UnidadMedida : number,
    cantidad : number,
    valorTotal : number
}

export enum TipoUnidadMedida {
    MASA = "Masa",
    VOLUMEN = "VOLUMEN"
}
  


