import { useState } from "react";
import { usePostVentas } from "../../hooks/ventas/usePostVentas";
import ModalComponent from "@/components/Modal";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useGetCosechas } from "../../hooks/cosechas/useGetCosechas";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { CrearCosechasModal } from "../cosechas/CrearCosechasModal";
import { Cosechas, UnidadesMedida, Ventas } from "../../types";
import { CrearUnidadesMedidaModal } from "../unidadesMedida/CrearUnidadesMedidaModal";
import { Plus } from "lucide-react";

interface CrearVentasModalProps {
  onClose: () => void;
  onCreate: (nuevaVenta : Ventas) => void
}

export const CrearVentasModal = ({ onClose }: CrearVentasModalProps) => {
  const [fk_Cosecha, setFk_Cosecha] = useState<number | null>(null);
  const [precioUnitario, setPrecioUnitario] = useState<number | null>(null);
  const [fecha, setFecha] = useState("");
  const [fk_UnidadMedida, setFk_UnidadMedida] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState<number>(0);

  const [CosechaModal, setCosechaModal] = useState(false);
  const [unidadMedidaModal, setUnidadMedidaModal] = useState(false);

  const { data: cosechas, isLoading: isLoadingCosechas, refetch: refetchCosecha} = useGetCosechas();
  const { data: unidadesMedida, isLoading: isLoadingUnidadesMedida, refetch: refetchUnidadMedida } = useGetUnidadesMedida();
  const { mutate, isPending } = usePostVentas();

  const handleSubmit = () => {
    if (!fk_Cosecha || !precioUnitario || !fecha || !fk_UnidadMedida || !cantidad) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { fk_Cosecha, precioUnitario, fecha, fk_UnidadMedida, cantidad },
      {
        onSuccess: () => {
          onClose();
          setFk_Cosecha(null);
          setPrecioUnitario(0);
          setFecha("");
          setFk_UnidadMedida(null);
          setCantidad(0);
        },
      }
    );
  };
  const handleCosechaCreada = (nuevaCosecha : Cosechas) =>{
    refetchCosecha()
    setFk_Cosecha(nuevaCosecha.id)
    setCosechaModal(false)
  }
  const handleUnidadMedidaCreada = (nuevaUnidadMedida : UnidadesMedida) =>{
    refetchUnidadMedida()
    setFk_Cosecha(nuevaUnidadMedida.id)
    setUnidadMedidaModal(false)
  }
  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Ventas"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            variant: "light",
            onClick: handleSubmit,
          },
        ]}
      >
        <Input
          label="Precio Unitario"
          type="number"
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(Number(e.target.value))}
          required
        />
        <Input
          label="Cantidad de producto"
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          required
        />

        <Input
          label="Fecha de venta"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />

        {isLoadingCosechas ? (
          <p>Cargando cosechas...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
              label="Cosecha"
              placeholder="Selecciona la cantidad y fecha"
              selectedKeys={fk_Cosecha ? [fk_Cosecha.toString()] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                setFk_Cosecha(selectedKey ? Number(selectedKey) : null);
              }}
              >
                {(cosechas || []).map((cosecha) => (
                  <SelectItem
                    key={cosecha.id.toString()}
                    textValue={`Cantidad:${cosecha.cantidad} Fecha: ${cosecha.fecha}`}
                  >
                  <span>Cantidad: {cosecha.cantidad} Fecha: {cosecha.fecha} </span>
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button
              onPress={()=>setCosechaModal(true)}
              title="Crear cosecha"
              color="success"
              size="sm"
            >
              <Plus className="w-5 h-5 text-white"/>
            </Button>
          </div>
        )}

        {isLoadingUnidadesMedida ? (
          <p>Cargando unidades de medida...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
            <Select
              label="Unidades de medida"
              placeholder="Selecciona la unidad de medida"
              selectedKeys={fk_UnidadMedida ? [fk_UnidadMedida.toString()] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                setFk_UnidadMedida(selectedKey ? Number(selectedKey) : null);
              }}
            >
              {(unidadesMedida || []).map((unidadMedida) => (
                <SelectItem key={unidadMedida.id.toString()} textValue={unidadMedida.nombre}>
                  {unidadMedida.nombre}
                </SelectItem>
              ))}
            </Select>
            </div>
            <Button
              onPress={()=>setUnidadMedidaModal(true)}
              title="Crear unidad de medida"
              color="success"
              size="sm"
            >
              <Plus className="w-5 h-5 text-white"/>
            </Button>
          </div>
        )}
      </ModalComponent>

      {CosechaModal && (
        <CrearCosechasModal 
        onClose={()=>setCosechaModal(false)} 
        onCreate={handleCosechaCreada}
        />
      )}
      {unidadMedidaModal && (
        <CrearUnidadesMedidaModal
        onClose={()=>setUnidadMedidaModal(false)} 
        onCreate={handleUnidadMedidaCreada}
        />
      )}
    </>
  );
};


