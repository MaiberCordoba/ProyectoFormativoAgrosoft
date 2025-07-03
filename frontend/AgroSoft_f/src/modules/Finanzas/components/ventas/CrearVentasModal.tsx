import { useState } from "react";
import { usePostVentas } from "../../hooks/ventas/usePostVentas";
import { useGetCosechas } from "../../hooks/cosechas/useGetCosechas";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { CrearCosechasModal } from "../cosechas/CrearCosechasModal";
import { CrearUnidadesMedidaModal } from "../unidadesMedida/CrearUnidadesMedidaModal";
import { CosechaForm } from "./CosechaForm";
import { ResumenPago } from "./ResumenPago";
import { useVentaCosechas } from "../../hooks/ventas/useVentaCosechas";
import { useCosechasGrouped, LoteDetail } from "../../hooks/useCosechasGrouped";
import ModalGlobal from "@/components/ui/modalOpt";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { addToast } from "@heroui/toast";
import { Cosechas, UnidadesMedida } from "../../types";
import { CosechaCultivoCard } from "../cosechas/CosechaCultivoCard";
import { CosechaLotesModal } from "../cosechas/CosechaLotesModal";

interface CrearVentasModalProps {
  onClose: () => void;
  onCreate: () => void;
}

export const CrearVentasModal = ({ onClose, onCreate }: CrearVentasModalProps) => {
  const [cosechaModal, setCosechaModal] = useState(false);
  const [unidadMedidaModal, setUnidadMedidaModal] = useState(false);
  const [lotesModal, setLotesModal] = useState(false);
  const [selectedCultivo, setSelectedCultivo] = useState(null);

  const { data: cosechas, isLoading: isLoadingCosechas, refetch: refetchCosecha } = useGetCosechas();
  const { data: plantaciones } = useGetPlantaciones();
  const { data: unidadesMedida, isLoading: isLoadingUnidadesMedida, refetch: refetchUnidadMedida } = useGetUnidadesMedida();
  const { cosechasAgrupadas, isLoading: isLoadingCosechasAgrupadas } = useCosechasGrouped();
  const { mutate, isPending } = usePostVentas();

  const { ventaCosechas, error, addCosecha, updateCosecha, removeCosecha, validateCosechas, getTotalVenta, handleBackendError } =
    useVentaCosechas({ cosechas, unidadesMedida });

  const handleSubmit = () => {
    if (!validateCosechas()) {
      addToast({
        title: "Error",
        description: error,
        color: "danger",
      });
      return;
    }

    mutate(
      {
        cosechas: ventaCosechas.map((vc) => ({
          cosecha: vc.cosecha,
          cantidad: vc.cantidad,
          unidad_medida: vc.unidad_medida,
          descuento: Number(vc.descuento),
        })),
      },
      {
        onSuccess: () => {
          refetchCosecha();
          onCreate();
          onClose();
        },
        onError: (error) => {
          handleBackendError(error);
        },
      }
    );
  };

  const handleCosechaCreada = (nuevaCosecha: Cosechas) => {
    refetchCosecha();
    updateCosecha(0, "cosecha", nuevaCosecha.id);
    setCosechaModal(false);
  };

  const handleUnidadMedidaCreada = (nuevaUnidadMedida: UnidadesMedida) => {
    refetchUnidadMedida();
    updateCosecha(0, "unidad_medida", nuevaUnidadMedida.id);
    setUnidadMedidaModal(false);
  };

  const handleOpenLotesModal = (cultivo) => {
    setSelectedCultivo(cultivo);
    setLotesModal(true);
  };

  const handleSelectCosecha = (lote: LoteDetail) => {
    addCosecha();
    updateCosecha(ventaCosechas.length - 1, "cosecha", lote.id);
    setLotesModal(false);
    setSelectedCultivo(null);
  };

  return (
    <>
      <ModalGlobal
        size="5xl"
        isOpen={true}
        onClose={onClose}
        title="Registro de Ventas"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            onClick: handleSubmit,
          },
        ]}
      >
        {isLoadingCosechas || isLoadingUnidadesMedida || isLoadingCosechasAgrupadas ? (
          <p className="text-center">Cargando...</p>
        ) : (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-800 bg-green-100 p-2 rounded-md mb-2">
                Seleccionar Cultivos
              </h3>
              <div className="flex flex-wrap gap-4 mb-6">
                {cosechasAgrupadas.map((cultivo) => (
                  <CosechaCultivoCard
                    key={cultivo.nombreCultivo}
                    cultivo={cultivo}
                    onOpenDetails={handleOpenLotesModal}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800 bg-green-100 p-2 rounded-md mb-2">
                Productos Seleccionados
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-green-100 text-green-800">
                      <th className="p-3 text-left">Producto</th>
                      <th className="p-3 text-left">Cantidad</th>
                      <th className="p-3 text-left">Unidad</th>
                      <th className="p-3 text-left">Descuento (%)</th>
                      <th className="p-3 text-left">Precio Unitario</th>
                      <th className="p-3 text-left">Total</th>
                      <th className="p-3 text-left">Restante</th>
                      <th className="p-3 text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventaCosechas.map((vc, index) => (
                      <CosechaForm
                        key={index}
                        index={index}
                        ventaCosecha={vc}
                        cosechas={cosechas}
                        unidadesMedida={unidadesMedida}
                        plantaciones={plantaciones}
                        updateCosecha={updateCosecha}
                        removeCosecha={removeCosecha}
                        canRemove={ventaCosechas.length > 1}
                        onOpenCosechaModal={() => setCosechaModal(true)}
                        onOpenUnidadMedidaModal={() => setUnidadMedidaModal(true)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <Button onPress={addCosecha} color="success" size="sm" className="mt-4">
                <Plus className="w-5 h-5" />
                Añadir Producto
              </Button>
            </div>
            <ResumenPago ventaCosechas={ventaCosechas} totalVenta={getTotalVenta()} />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>
        )}
      </ModalGlobal>

      {cosechaModal && (
        <CrearCosechasModal onClose={() => setCosechaModal(false)} onCreate={handleCosechaCreada} />
      )}
      {unidadMedidaModal && (
        <CrearUnidadesMedidaModal
          onClose={() => setUnidadMedidaModal(false)}
          onCreate={handleUnidadMedidaCreada}
        />
      )}
      {lotesModal && (
        <CosechaLotesModal
          isOpen={lotesModal}
          onClose={() => {
            setLotesModal(false);
            setSelectedCultivo(null);
          }}
          cultivo={selectedCultivo}
          onSelectCosecha={handleSelectCosecha}
        />
      )}
    </>
  );
};