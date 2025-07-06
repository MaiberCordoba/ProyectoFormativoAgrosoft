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
import { useCosechasGrouped, LoteDetail, CultivoAgrupadoDetail } from "../../hooks/useCosechasGrouped";
import ModalGlobal from "@/components/ui/modalOpt";
import { Plus, Download } from "lucide-react";
import { addToast } from "@heroui/toast";
import { Cosechas, UnidadesMedida } from "../../types";
import { FiltrosTabla } from "@/components/ui/table/FiltrosTabla";
import { CosechaCultivoCard } from "../cosechas/CosechaCultivoCard";
import { CosechaLotesModal } from "../cosechas/CosechaLotesModal";
import { RoundIconButton } from "@/components/ui/buttonRound";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useGetUsers } from "@/modules/Users/hooks/useGetUsers";
import { FacturaPDF } from "./VentaPdf";

interface CrearVentasModalProps {
  onClose: () => void;
  onCreate: () => void;
}

export const CrearVentasModal = ({ onClose, onCreate }: CrearVentasModalProps) => {
  const [cosechaModal, setCosechaModal] = useState(false);
  const [unidadMedidaModal, setUnidadMedidaModal] = useState(false);
  const [lotesModal, setLotesModal] = useState(false);
  const [selectedCultivo, setSelectedCultivo] = useState<CultivoAgrupadoDetail | null>(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [ventaCreada, setVentaCreada] = useState<any | null>(null);

  const { data: cosechas, isLoading: isLoadingCosechas, refetch: refetchCosecha } = useGetCosechas();
  const { data: plantaciones } = useGetPlantaciones();
  const { data: unidadesMedida, isLoading: isLoadingUnidadesMedida, refetch: refetchUnidadMedida } = useGetUnidadesMedida();
  const { data: usuarios } = useGetUsers();
  const { cosechasAgrupadas, isLoading: isLoadingCosechasAgrupadas } = useCosechasGrouped();
  const { mutate, isPending } = usePostVentas();
  const { ventaCosechas, error, addCosecha, updateCosecha, removeCosecha, validateCosechas, getTotalVenta, handleBackendError } =
    useVentaCosechas({ cosechas, unidadesMedida });

  const handleSubmit = () => {
    if (!validateCosechas()) {
      addToast({
        title: "Error",
        description: error || "Por favor, verifica los datos ingresados.",
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
        onSuccess: (data) => {
          setVentaCreada(data);
          setShowDownloadModal(true);
          refetchCosecha();
          onCreate();
          addToast({
            title: "Éxito",
            description: "Venta creada con éxito.",
            color: "success",
          });
        },
        onError: (error) => {
          handleBackendError(error);
          addToast({
            title: "Error",
            description: error.message || "Error al crear la venta.",
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

  const handleOpenLotesModal = (cultivo: CultivoAgrupadoDetail) => {
    setSelectedCultivo(cultivo);
    setLotesModal(true);
  };

  const handleSelectCosecha = (lote: LoteDetail) => {
    addCosecha();
    updateCosecha(ventaCosechas.length - 1, "cosecha", lote.id);
    setLotesModal(false);
    setSelectedCultivo(null);
  };

  const cultivosFiltrados = cosechasAgrupadas.filter((cultivo) =>
    cultivo.nombreCultivo?.toLowerCase().includes(filtroBusqueda.toLowerCase())
  );

  const ventaPDF = ventaCreada && usuarios && {
    numero_factura: ventaCreada.numero_factura,
    fecha: ventaCreada.fecha,
    usuario: usuarios?.find((us) => us.id === ventaCreada.usuario)?.nombre + ' ' + usuarios?.find((us) => us.id === ventaCreada.usuario)?.apellidos || 'Desconocido',
    cosechas: ventaCreada.cosechas.map((vc: any) => {
      const cosecha = cosechas?.find((c) => c.id === vc.cosecha);
      const plantacion = plantaciones?.find((p) => p.id === cosecha?.fk_Plantacion);
      const unidad = unidadesMedida?.find((u) => u.id === vc.unidad_medida) || {
        id: 0,
        nombre: 'N/A',
        equivalenciabase: 1,
        abreviatura: 'N/A',
        tipo: 'MASA', // Ajustado para cumplir con 'MASA' | 'VOLUMEN'
      } as UnidadesMedida;
      return {
        cosecha: {
          id: vc.cosecha,
          nombreEspecie: cosechasAgrupadas.find((ca) => ca.lotes.some((l) => l.id === vc.cosecha))?.nombreEspecie || plantacion?.cultivo?.nombre || 'Desconocido',
        },
        cantidad: vc.cantidad,
        unidad_medida: unidad,
        precio_unitario: vc.precio_unitario,
        descuento: vc.descuento,
        valor_total: vc.valor_total,
      };
    }),
    valor_total: ventaCreada.valor_total,
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
                Cosechas disponibles
              </h3>
              <FiltrosTabla
                valorFiltro={filtroBusqueda}
                onCambiarBusqueda={setFiltroBusqueda}
                onLimpiarBusqueda={() => setFiltroBusqueda("")}
                placeholderBusqueda="Buscar por cultivo (ej. Lechuga)"
                className="max-w-sm"
              />
              <div className="flex flex-row overflow-x-auto gap-4 mt-4 mb-6 pb-4 scroll-smooth">
                {cultivosFiltrados.length > 0 ? (
                  cultivosFiltrados.map((cultivo, index) => (
                    <CosechaCultivoCard
                      key={`${cultivo.nombreCultivo}-${index}`}
                      cultivo={cultivo}
                      onOpenDetails={handleOpenLotesModal}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No se encontraron cultivos.</p>
                )}
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
                        key={`venta-cosecha-${index}`}
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
              <div className="mt-3 mb-4">
                <div className="flex items-center gap-2">
                  <RoundIconButton
                    onPress={addCosecha}
                    color="success"
                    icon={<Plus className="w-5 h-5" />}
                  />
                  <p className="text-gray-700 text-sm">
                    Añadir productos
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
      {showDownloadModal && ventaPDF && (
        <ModalGlobal
          size="sm"
          isOpen={showDownloadModal}
          onClose={() => {
            setShowDownloadModal(false);
            setVentaCreada(null);
            onClose();
          }}
          title="Descargar Factura"
          footerButtons={[
            {
              label: "Cerrar",
              color: "success",
              onClick: () => {
                setShowDownloadModal(false);
                setVentaCreada(null);
                onClose();
              },
            },
          ]}
        >
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-gray-700">¿Desea descargar la factura de la venta creada?</p>
            <PDFDownloadLink document={<FacturaPDF venta={ventaPDF} />} fileName={`factura-${ventaPDF.numero_factura}.pdf`}>
              {({ loading }) => (
                <RoundIconButton
                  color="primary"
                  icon={<Download className="w-5 h-5" />}
                  disabled={loading}
                  aria-label={loading ? 'Generando PDF...' : 'Descargar Factura'}
                />
              )}
            </PDFDownloadLink>
          </div>
        </ModalGlobal>
      )}
    </>
  );
};