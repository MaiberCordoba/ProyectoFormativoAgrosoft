import React from 'react';
import { CultivoAgrupadoDetail, formatCurrency, LoteDetail } from '../../hooks/useCosechasGrouped';
import ModalGlobal from '@/components/ui/modalOpt';

interface CosechaLotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    cultivo: CultivoAgrupadoDetail | null;
    onSelectCosecha?: (lote: LoteDetail) => void; // Callback para seleccionar una cosecha
}

export const CosechaLotesModal: React.FC<CosechaLotesModalProps> = ({ isOpen, onClose, cultivo, onSelectCosecha }) => {
    if (!cultivo) return null;

    return (
        <ModalGlobal
            isOpen={isOpen}
            onClose={onClose}
            title={`Cosechas de: ${cultivo.nombreCultivo}`}
            size="3xl"
        >
            <div className="space-y-4">
                <p className="text-md font-semibold text-green-800 bg-green-100 p-2 rounded-md">
                    Resumen: {cultivo.cantidadDisponibleCultivo} g disponibles ({formatCurrency(cultivo.valorTotalCultivo)})
                </p>
                <h4 className="font-semibold text-base text-green-800">Cosechas Individuales:</h4>
                {cultivo.lotes.length > 0 ? (
                    <div className="space-y-3">
                        {cultivo.lotes.map((lote: LoteDetail) => (
                            <div key={lote.id} className="border border-green-200 p-3 rounded-md bg-gray-50 shadow-sm text-left">
                                <p className="font-medium text-sm text-green-700">**Cosecha ID:** #{lote.id}</p>
                                <p className="text-xs text-gray-600">**Fecha Cosecha:** {lote.fecha ?? "Sin fecha"}</p>
                                <p className="text-xs text-gray-600">**Lote/Era:** {lote.lote ?? "Sin lote"}</p>
                                <p className="text-xs text-gray-600">**Cantidad Cosechada:** {lote.cantidadTotal} g</p>
                                <p className="text-sm text-green-700 font-bold">**Disponible:** {lote.cantidad_disponible} g</p>
                                <p className="text-sm text-blue-700 font-bold">**Valor por Gramo:** ${lote.valorGramo.toFixed(2)}</p>
                                <p className="text-sm text-purple-700 font-bold">**Valor Total:** {formatCurrency(lote.valorTotal)}</p>
                                {onSelectCosecha && (
                                    <button
                                        onClick={() => onSelectCosecha(lote)}
                                        className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                                    >
                                        Seleccionar Cosecha
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No hay cosechas disponibles para este cultivo.</p>
                )}
            </div>
        </ModalGlobal>
    );
};