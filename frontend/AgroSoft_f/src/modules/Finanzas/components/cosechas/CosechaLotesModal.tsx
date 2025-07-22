import React from 'react';
import { CultivoAgrupadoDetail, formatCurrency, LoteDetail } from '../../hooks/useCosechasGrouped';
import ModalGlobal from '@/components/ui/modalOpt';
import { CheckCircle } from 'lucide-react';

interface CosechaLotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    cultivo: CultivoAgrupadoDetail | null;
    onSelectCosecha?: (lote: LoteDetail) => void;
}

export const CosechaLotesModal: React.FC<CosechaLotesModalProps> = ({ isOpen, onClose, cultivo, onSelectCosecha, }) => {
    if (!cultivo) return null;

    return (
        <ModalGlobal
            isOpen={isOpen}
            onClose={onClose}
            title={`Cosechas de: ${cultivo.nombreCultivo}`}
            size="lg" // Reducido de 3xl a lg
        >
            <div className="space-y-4">
                <p className="text-sm font-semibold text-green-800 bg-green-100 p-2 rounded-md">
                    Resumen: {cultivo.cantidadDisponibleCultivo} g disponibles ({formatCurrency(cultivo.valorTotalCultivo)})
                </p>
                <h4 className="font-semibold text-sm text-green-800">Cosechas Individuales:</h4>
                {cultivo.lotes.length > 0 ? (
                    <div className="space-y-2">
                        {cultivo.lotes.map((lote: LoteDetail) => {
                            const valorGramo = typeof lote.valorGramo === 'string' ? parseFloat(lote.valorGramo) : lote.valorGramo;
                            return (
                                <div
                                    key={lote.id}
                                    className="flex flex-row items-center gap-4 border border-green-200 p-2 rounded-md bg-gray-50 shadow-sm hover:bg-green-100 cursor-pointer transition-colors"
                                    onClick={() => onSelectCosecha && onSelectCosecha(lote)}
                                    role="button"
                                    aria-label={`Seleccionar cosecha ${lote.lote ?? 'Sin lote'}`}
                                >
                                    {/* Imagen y fecha */}
                                    <div className="flex flex-col items-center gap-1 w-20">
                                        <p className="text-xs text-gray-700 font-semibold text-center">
                                            {lote.fecha ?? "Sin fecha"}
                                        </p>
                                        <img
                                            src={cultivo.imagenEspecie || 'https://via.placeholder.com/64?text=Cultivo'}
                                            alt={`Imagen de ${cultivo.nombreCultivo}`}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                    </div>
                                    {/* Información del lote */}
                                    <div className="flex-1 space-y-1 text-xs">
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Lote/Era:</span> {lote.lote ?? "Sin lote"}
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Cantidad Cosechada:</span> {lote.cantidadTotal} g
                                        </p>
                                        <p className="text-green-700 font-bold">
                                            <span className="font-semibold">Disponible:</span> {lote.cantidad_disponible} g
                                        </p>
                                        <p className="text-blue-700 font-bold">
                                            <span className="font-semibold">Valor por Gramo:</span> {valorGramo == null || isNaN(valorGramo) ? "No definido" : `$${valorGramo.toFixed(2)}`}
                                        </p>
                                        
                                    </div>
                                    {/* Indicador de clickeabilidad */}
                                    {onSelectCosecha && (
                                        <div className="ml-auto flex items-center gap-1 text-xs text-green-600">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Click para seleccionar</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No hay cosechas disponibles para este cultivo.</p>
                )}
            </div>
        </ModalGlobal>
    );
};