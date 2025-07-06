import React from 'react';
import { Button } from "@heroui/react";
import CustomCard from '../../CustomCard';
import { CultivoAgrupadoDetail, formatCurrency } from '../../hooks/useCosechasGrouped';

interface CosechaCultivoCardProps {
    cultivo: CultivoAgrupadoDetail;
    onOpenDetails: (cultivo: CultivoAgrupadoDetail) => void;
}

export const CosechaCultivoCard: React.FC<CosechaCultivoCardProps> = ({ cultivo, onOpenDetails }) => {
    return (
        <CustomCard
            key={cultivo.nombreCultivo}
            title={cultivo.nombreCultivo}
            image={cultivo.imagenEspecie}
            backgroundColor="white"
            borderColor="green-500"
            textColor="green-800"
            hoverEffect={true}
        >
            <div className="space-y-1 p-2 text-left">
                <p className="text-xs text-gray-700">
                    <span className="font-semibold">Especie:</span> {cultivo.nombreEspecie}
                </p>
                <p className="text-xs text-gray-700">
                    <span className="font-semibold">Disponible:</span> {cultivo.cantidadDisponibleCultivo} g
                </p>
                <p className="text-xs text-gray-700">
                    <span className="font-semibold">Valor por vender:</span> {formatCurrency(cultivo.valorTotalCultivo)}
                </p>
            </div>
            <Button
                onPress={() => onOpenDetails(cultivo)}
                color="success"
                variant="ghost"
                className="w-full text-xs mt-1"
                size="sm"
            >
                Ver Cosechas ({cultivo.lotes.length})
            </Button>
        </CustomCard>
    );
};