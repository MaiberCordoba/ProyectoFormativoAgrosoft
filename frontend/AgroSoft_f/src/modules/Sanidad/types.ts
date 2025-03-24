export interface TiposAfecciones{
    id: number;
    nombre: string;
    descripcion: string;
}

export interface Afecciones{
    id: number;
    nombre: string;
    descripcion: string;
    img?: string;
    tipoPlaga?: TiposAfecciones;
    fk_Tipo?: number;
}