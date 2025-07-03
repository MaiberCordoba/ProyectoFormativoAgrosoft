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
            <div className="space-y-2 p-2 text-left">
                <p className="text-sm text-gray-700">**Especie:** {cultivo.nombreEspecie}</p>
                <p className="text-sm text-gray-700">**Total Disponible:** {cultivo.cantidadDisponibleCultivo} g</p>
                <p className="text-sm text-gray-700">**Valor Total en Stock:** {formatCurrency(cultivo.valorTotalCultivo)}</p>
            </div>
            <Button
                onPress={() => onOpenDetails(cultivo)}
                color="success"
                variant="ghost"
                className="w-full text-sm mt-2"
                size="sm"
            >
                Ver Cosechas ({cultivo.lotes.length})
            </Button>
        </CustomCard>
    );
};