//Creacion de los tipos de datos
import { Cultivos, Lotes } from "../Trazabilidad/types"
import { User } from "../Users/types"

export interface Actividades {
    id : number,
    fk_Cultivo?: number,
    cultivo?: Cultivos,
    fk_Usuario? : number,
    usuario? : User,
    titulo : string,
    descripcion : string,
    fecha : string,
    estado : "AS" | "CO" | "CA"
}

export interface UsosHerramientas {
    id : number,
    fk_Herramientas? : number,
    herramienta?: Herramientas,
    fk_Actividad? : number,
    actividad? : Actividades
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
    unidades : number
}
export interface UsosProductos {
    id : number,
    fk_Insumo? : number,
    insumo? : Insumos ,
    fk_Actividad? : number,
    actividad? : Actividades,
    cantidadProducto : number
}

export interface Cosechas {
    id : number,
    fk_Cultivo? : number,
    cultivo? : Cultivos,
    unidades : number,
    fecha : string
}

export interface Ventas {
    id : number,
    fk_Cosecha? : number,
    cosecha? : Cosechas,
    precioUnitario : number,
    fecha : string
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

export interface TiposDesechos {
    id : number,
    nombre : string,
    descripcion : string
}
