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
