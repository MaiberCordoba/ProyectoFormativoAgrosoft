export interface TiposAfecciones{
    id: number;
    nombre: string;
    descripcion: Text;
}

export interface Afecciones{
    id: number;
    nombre: string;
    descripcion: string;
    img: string;
    tipoPlaga: TiposAfecciones;
}