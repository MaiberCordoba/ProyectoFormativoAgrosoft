import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchUsoProductosControl } from "../../hooks/useProductosControl/usePatchUseProductosControl";
import { useGetProductosControl } from "../../hooks/productosControl/useGetProductosControl";
import { useGetControles } from "../../hooks/controles/useGetControless";
import { UsoProductosControl } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";

interface EditarUsoProductosControlModalProps {
  usoProductoControl: UsoProductosControl;
  onClose: () => void;
}

const EditarUsoProductosControlModal: React.FC<EditarUsoProductosControlModalProps> = ({
  usoProductoControl,
  onClose,
}) => {
  const [fk_ProductoControl, setFk_ProductoControl] = useState<number | null>(usoProductoControl.fk_ProductoControl || null);
  const [fk_Control, setFk_Control] = useState<number | null>(usoProductoControl.fk_Control || null);
  const [cantidadProducto, setCantidadProducto] = useState<number>(usoProductoControl.cantidadProducto);

  const { data: productosControl, isLoading: isLoadingProductos } = useGetProductosControl();
  const { data: controles, isLoading: isLoadingControles } = useGetControles();

  const { mutate, isPending } = usePatchUsoProductosControl();

  const handleSubmit = () => {
    if (!fk_ProductoControl || !fk_Control || cantidadProducto <= 0) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      {
        id: usoProductoControl.id,
        data: { fk_ProductoControl, fk_Control, cantidadProducto },
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
      title="Editar Uso de Producto de Control"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      {/* Selector de Producto de Control */}
      {isLoadingProductos ? (
        <p>Cargando productos de control...</p>
      ) : (
        <Select
          label="Producto de Control"
          placeholder="Selecciona un producto"
          selectedKeys={fk_ProductoControl ? [fk_ProductoControl.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_ProductoControl(Number(selectedKey));
          }}
        >
          {(productosControl || []).map((producto) => (
            <SelectItem key={producto.id.toString()}>{producto.nombre}</SelectItem>
          ))}
        </Select>
      )}

       Selector de Control 
      {isLoadingControles ? (
        <p>Cargando controles...</p>
      ) : (
        <Select
          label="Control"
          placeholder="Selecciona un control"
          selectedKeys={fk_Control ? [fk_Control.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Control(Number(selectedKey));
          }}
        >
          {(controles || []).map((control) => (
            <SelectItem key={control.id.toString()}>{control.descripcion}</SelectItem>
          ))}
        </Select>
      )}
        

      <Input
        label="Cantidad de Producto"
        type="number"
        value={cantidadProducto.toString()}
        onChange={(e) => setCantidadProducto(Number(e.target.value))}
        required
      />
    </ModalComponent>
  );
};

export default EditarUsoProductosControlModal;
