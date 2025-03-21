//Creacion de los tipos de datos

export interface Actividades {
    id : number,
    fk_Cultivo : number,
    fk_Usuario : number,
    titulo : string,
    descripcion : string,
    fecha : string,
    estado : "AS" | "CO" | "CA"
}

export interface UsosHerramientas {
    id : number,
    fk_Herramientas : number,
    fk_Actividad : number
}

export interface Herramientas {
    id : number,
    fk_Lote : number,
    nombre : string,
    descripcion : string,
    unidades : number
}

export interface UsosProductos {
    id : number,
    fk_Insumo : number,
    fk_Actividad : number,
    cantidadProducto : number
}

export interface Cosechas {
    id : number,
    fk_Cultivo : number,
    unidades : number,
    fecha : string
}

export interface Ventas {
    id : number,
    fk_Cosecha : number,
    precioUnitario : number,
    fecha : string
}
export interface Desechos {
    id : number,
    fk_Cultivo : number,
    fk_TipoDesecho : number,
    nombre : string,
    descripcion : string
}

export interface TiposDesechos {
    id : number,
    nombre : string,
    descripcion : string
}