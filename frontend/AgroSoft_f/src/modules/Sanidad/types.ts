export interface TiposAfecciones{
    id: number;
    nombre: string;
    descripcion: string;
    img: string;
}

export interface Afecciones{
    id: number;
    nombre: string;
    descripcion: string;
    img?: string;
    tipoPlaga?: TiposAfecciones;
    fk_Tipo?: number;
}

export interface TipoControl{
    id: number;
    nombre: string;
    descripcion: string;
    
}


export interface ProductosControl {
    id: number;
    nombre: string;
    precio: number;  
    compuestoActivo: string;  
    fichaTecnica: string;  
    contenido: number;
    tipoContenido: string; 
    unidades: number;
}

export interface UsoProductosControl {
    id: number;
    fk_ProductoControl?: number;
    fk_Control?: number; 
    cantidadProducto: number;
}

export interface Controles{
    id: number;
    fk_Afeccion?: number;
    fk_TipoControl?: number;
    fecha: string;
    descripcion: string;
}

export enum EstadoAfeccion {
    Detectado = "Detectado",
    EnTratamiento = "EnTratamiento",
    Erradicado = "Erradicado"
}


export interface AfeccionesCultivo {
    id: number;
    fk_Plantacion: number;
    fk_Plaga: number;
    fechaEncuentro: string;
    estado: EstadoAfeccion;
}




