import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchVentas } from "../../hooks/ventas/usePatchVentas";
import { useGetCosechas } from "../../hooks/cosechas/useGetCosechas";
import { Ventas } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";

interface EditarVentaModalProps {
  venta: Ventas;
  onClose: () => void;
}

const EditarVentaModal: React.FC<EditarVentaModalProps> = ({ venta, onClose }) => {
  const [fk_Cosecha, setFk_Cosecha] = useState<number | null>(venta.fk_Cosecha || null);
  const [precioUnitario, setPrecioUnitario] = useState<number>(venta.precioUnitario);
  const [fecha, setFecha] = useState<string>(venta.fecha);
  const [fk_UnidadMedida, setFk_UnidadMedida] = useState<number | null>(venta.fk_UnidadMedida || null);
  const [cantidad, setCantidad] = useState<number>(venta.cantidad);

  const { mutate, isPending } = usePatchVentas();
  const { data: cosechas, isLoading: isLoadingCosechas } = useGetCosechas();
  const { data: unidadesMedida, isLoading: isLoadingUnidadesMedida } = useGetUnidadesMedida();

  const handleSubmit = () => {
    if (!precioUnitario || !fecha || !fk_Cosecha || !fk_UnidadMedida || !cantidad) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    mutate(
      {
        id: venta.id,
        data: { precioUnitario, fecha, fk_Cosecha,fk_UnidadMedida,cantidad },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Venta"
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
        label="Cantidad de venta"
        type="number"
        value={cantidad}
        onChange={(e) => setCantidad(Number(e.target.value))}
        required
      />
      
      <Input
        label="Fecha"
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        required
      />

      {/* Selector de Cosechas */}
      {isLoadingCosechas ? (
        <p>Cargando cosechas...</p>
      ) : (
        <Select
          label="Cosecha"
          placeholder="Selecciona la fecha de la cosecha"
          selectedKeys={fk_Cosecha ? [fk_Cosecha.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Cosecha(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(cosechas || []).map((cosecha) => (
            <SelectItem
              key={cosecha.id.toString()}
              textValue={`${cosecha.id} - ${cosecha.fecha}`}
            >
              {cosecha.id} - {cosecha.fecha}
            </SelectItem>
          ))}
        </Select>
      )}
      {isLoadingUnidadesMedida ? (
              <p>Cargando unidades de medida...</p>
            ) : (
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
                  <SelectItem key={unidadMedida.id.toString()}>{unidadMedida.nombre}</SelectItem>
                ))}
              </Select>
            )}
    </ModalComponent>
  );
};

export default EditarVentaModal;
