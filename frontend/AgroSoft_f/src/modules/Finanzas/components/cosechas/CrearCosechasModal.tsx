import { useState } from "react";
import { usePostCosecha } from "../../hooks/cosechas/usePostCosechas";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetCultivos } from "@/modules/Trazabilidad/hooks/cultivos/useGetCultivos";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";

interface CrearCosechasModalProps {
  onClose: () => void;
}

export const CrearCosechasModal = ({ onClose }: CrearCosechasModalProps) => {
  const [fk_Cultivo, setFk_Cultivo] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState<number>(0);  // Inicializado en 0
  const [fk_UnidadMedida, setFk_UnidadMedida] = useState<number | null>(null);
  const [fecha, setFecha] = useState("");
  const [precioReferencial, setPrecioReferencial] = useState<Number>(0)

  const { data: cultivos, isLoading: isLoadingCultivos } = useGetCultivos();
  const { data: UnidadMedida, isLoading: isLoadingUnidadMedida } = useGetUnidadesMedida();
  const { mutate, isPending } = usePostCosecha();

  const handleSubmit = () => {
    if (!fk_Cultivo || cantidad <= 0 || !fk_UnidadMedida || !fecha || !precioReferencial) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { fk_Cultivo, cantidad, fk_UnidadMedida, fecha, precioReferencial },
      {
        onSuccess: () => {
          onClose();
          setFk_Cultivo(null);
          setCantidad(0)
          setFk_UnidadMedida(null) // Restablecer a 0
          setFecha("");
          setPrecioReferencial(0)
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Cosechas"
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
        label="Fecha de Cosecha"
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        required
      />
      <Input
        label="Cantidad cosechada"
        type="number"
        value={cantidad}
        onChange={(e) => setCantidad(Number(e.target.value))}
        required
      />

      {isLoadingCultivos ? (
        <p>Cargando cultivos...</p>
      ) : (
        <Select
          label="Cultivo"
          placeholder="Selecciona un cultivo"
          selectedKeys={fk_Cultivo ? [fk_Cultivo.toString()] : []} 
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0]; 
            setFk_Cultivo(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(cultivos || []).map((cultivo) => (
            <SelectItem key={cultivo.id.toString()}>{cultivo.nombre}</SelectItem>
          ))}
        </Select>
      )}
      {isLoadingUnidadMedida ? (
        <p>Cargando unidades de medida...</p>
      ) : (
        <Select
          label="Unidad de medida"
          placeholder="Selecciona una unidad de medida"
          selectedKeys={fk_UnidadMedida ? [fk_UnidadMedida.toString()] : []} 
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0]; 
            setFk_UnidadMedida(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(UnidadMedida || []).map((unidadesMedida) => (
            <SelectItem key={unidadesMedida.id.toString()}>{unidadesMedida.nombre}</SelectItem>
          ))}
        </Select>
      )}
       <Input
        label="Precio de referencia"
        type="number"
        value={precioReferencial}
        onChange={(e) => setPrecioReferencial(Number(e.target.value))}
        required
      />
    </ModalComponent>
  );
};
