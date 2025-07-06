import { useMemo } from 'react';
import { useGetCosechas } from './cosechas/useGetCosechas';
import { useGetPlantaciones } from '@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones';

// Interfaz para los datos detallados de cada lote de cosecha
export interface LoteDetail {
    id: number;
    cantidadTotal: number;
    cantidad_disponible: number;
    valorTotal: number; // Valor del stock disponible (cantidad_disponible * valorGramo)
    valorGramo: number;
    fecha: string | undefined;
    lote: string | undefined; 
    era: string | undefined; 
}

// Interfaz para los datos de un cultivo AGRUPADO
export interface CultivoAgrupadoDetail {
    nombreCultivo: string | undefined;
    imagenEspecie: string | undefined;
    nombreEspecie: string;
    cantidadTotalCosechadaCultivo: number;
    cantidadDisponibleCultivo: number;
    valorTotalCultivo: number; // Suma de valorTotal de los lotes
    lotes: LoteDetail[];
}

export function useCosechasGrouped() {
    const {
        data: cosechas = [],
        isLoading: loadingCosechas,
        isError: isCosechasError,
    } = useGetCosechas();
    const {
        data: plantaciones = [],
        isLoading: loadingPlantaciones,
        isError: isPlantacionesError,
    } = useGetPlantaciones();

    const isLoading = loadingCosechas || loadingPlantaciones;
    const isError = isCosechasError || isPlantacionesError;

    const cosechasAgrupadas = useMemo(() => {
        if (isLoading || isError) {
            return {};
        }

        return cosechas.reduce((acc, cosecha) => {
            const plantacion = plantaciones.find((p) => p.id === cosecha.fk_Plantacion);
            const cultivoId = plantacion?.cultivo?.id;

            if (!cultivoId || (cosecha.cantidadTotal === null || cosecha.cantidadTotal === undefined) || (cosecha.cantidad_disponible === null || cosecha.cantidad_disponible === undefined) || cosecha.cantidad_disponible <= 0) {
                return acc;
            }

            let valorGramoCosecha: number;
            if (typeof cosecha.valorGramo === 'number') {
                valorGramoCosecha = cosecha.valorGramo;
            } else {
                valorGramoCosecha = parseFloat(cosecha.valorGramo ?? '0');
            }

            // Calcular valorTotal como cantidad_disponible * valorGramo
            const valorTotalCosecha = (cosecha.cantidad_disponible ?? 0) * valorGramoCosecha;

            if (!acc[cultivoId]) {
                acc[cultivoId] = {
                    nombreCultivo: plantacion?.cultivo?.nombre ?? "Desconocido",
                    imagenEspecie: plantacion?.cultivo?.especies?.img,
                    nombreEspecie: plantacion?.cultivo?.especies?.nombre ?? "Desconocido",
                    cantidadTotalCosechadaCultivo: 0,
                    cantidadDisponibleCultivo: 0,
                    valorTotalCultivo: 0,
                    lotes: [],
                };
            }

            acc[cultivoId].cantidadTotalCosechadaCultivo += cosecha.cantidadTotal;
            acc[cultivoId].cantidadDisponibleCultivo += cosecha.cantidad_disponible;
            acc[cultivoId].valorTotalCultivo += valorTotalCosecha;

            acc[cultivoId].lotes.push({
                id: cosecha.id,
                cantidadTotal: cosecha.cantidadTotal,
                cantidad_disponible: cosecha.cantidad_disponible,
                valorTotal: valorTotalCosecha,
                valorGramo: valorGramoCosecha,
                fecha: cosecha.fecha,
                era: plantacion?.eras?.tipo ?? "Sin lote",
                lote: plantacion?.eras?.Lote?.nombre ?? "Sin lote",
            });

            return acc;
        }, {} as Record<string, CultivoAgrupadoDetail>);
    }, [cosechas, plantaciones, isLoading, isError]);

    return {
        cosechasAgrupadas: Object.values(cosechasAgrupadas),
        isLoading,
        isError,
    };
}

export const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return "$0";
    }
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    }).format(amount);
};