import { useState } from "react";
import { usePostVentas } from "../../hooks/ventas/usePostVentas";
import { useGetCosechas } from "../../hooks/cosechas/useGetCosechas";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { CrearCosechasModal } from "../cosechas/CrearCosechasModal";
import { CrearUnidadesMedidaModal } from "../unidadesMedida/CrearUnidadesMedidaModal";
import { ResumenPago } from "./ResumenPago";
import ModalGlobal from "@/components/ui/modalOpt";
import { Plus } from "lucide-react";
import { addToast } from "@heroui/toast";
import { Cosechas, UnidadesMedida } from "../../types";
import { useVentaCosechas } from "../../hooks/ventas/useVentaCosechas";
import { CosechaForm } from "./CosechaForm";
import { RoundIconButton } from "@/components/ui/buttonRound";

interface CrearVentasModalProps {
  onClose: () => void;
  onCreate: () => void;
}

export const CrearVentasModal = ({ onClose, onCreate }: CrearVentasModalProps) => {
  const [cosechaModal, setCosechaModal] = useState(false);
  const [unidadMedidaModal, setUnidadMedidaModal] = useState(false);

  const { data: cosechas, isLoading: isLoadingCosechas, refetch: refetchCosecha } = useGetCosechas();
  const { data: plantaciones } = useGetPlantaciones();
  const { data: unidadesMedida, isLoading: isLoadingUnidadesMedida, refetch: refetchUnidadMedida } = useGetUnidadesMedida();
  const { mutate, isPending } = usePostVentas();

  const { ventaCosechas, error, addCosecha, updateCosecha, removeCosecha, validateCosechas, getTotalVenta } =
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
          addToast({
            title: "Éxito",
            description: "Venta creada con éxito.",
            color: "success",
          });
        },
        onError: (error) => {
          addToast({
            title: "Error",
            description: `Error al crear la venta: ${error.message}`,
            color: "danger",
          });
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
        {isLoadingCosechas || isLoadingUnidadesMedida ? (
          <p className="text-center">Cargando...</p>
        ) : (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Seleccionar Productos</h3>
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

              
              <div className="mt-3 mb-4" >
                <div className="flex items-center gap-2"> {/* Contenedor flex para alinear */}
                  <RoundIconButton
                    onPress={addCosecha}
                    color="success"
                    icon={<Plus className="w-5 h-5" />}
                  />
                  <p className="text-gray-700 text-sm"> 
                    Agregar Productos
                  </p>
                </div>
              </div>
              
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
    </>
  );
};