import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchAfeccionesCultivo } from "../../hooks/afeccionescultivo/usePatchAfeccionescultivo";
import { AfeccionesCultivo, EstadoAfeccion } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetAfecciones } from "../../hooks/afecciones/useGetAfecciones";

interface EditarAfeccionCultivoModalProps {
  afeccionCultivo: AfeccionesCultivo;
  onClose: () => void;
}

const EditarAfeccionCultivoModal: React.FC<EditarAfeccionCultivoModalProps> = ({ afeccionCultivo, onClose }) => {
  //const [fk_Plantacion, setFk_Plantacion] = useState<number>(afeccionCultivo.fk_Plantacion);
  const [fk_Plaga, setFk_Plaga] = useState<number>(afeccionCultivo.fk_Plaga);
  const [estado, setEstado] = useState<EstadoAfeccion>(afeccionCultivo.estado as EstadoAfeccion);
  const [fechaEncuentro, setFechaEncuentro] = useState<string>(afeccionCultivo.fechaEncuentro);

  const { data: tiposPlaga, isLoading: isLoadingTiposPlaga } = useGetAfecciones();
  const { mutate, isPending } = usePatchAfeccionesCultivo();

  const handleSubmit = () => {
    mutate(
      {
        id: afeccionCultivo.id,
        data: {
          //fk_Plantacion,
          fk_Plaga,
          estado,
          fechaEncuentro,
        },
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
      title="Editar Afección Cultivo"
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
        value={fechaEncuentro}
        label="Fecha del Encuentro"
        type="date"
        onChange={(e) => setFechaEncuentro(e.target.value)}
      />

      {isLoadingTiposPlaga ? (
        <p>Cargando tipos de plaga...</p>
      ) : (
        <Select
          label="Tipo de Plaga"
          placeholder="Selecciona un tipo de plaga"
          selectedKeys={[fk_Plaga.toString()]}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Plaga(Number(selectedKey));
          }}
        >
          {(tiposPlaga || []).map((tipo) => (
            <SelectItem key={tipo.id.toString()}>{tipo.nombre}</SelectItem>
          ))}
        </Select>
      )}

      <Select
        label="Estado de la Afección"
        placeholder="Selecciona el estado"
        selectedKeys={[estado]}
        onSelectionChange={(keys) => {
          const selectedState = Array.from(keys)[0] as EstadoAfeccion;
          setEstado(selectedState);
        }}
      >
        {Object.values(EstadoAfeccion).map((estado) => (
          <SelectItem key={estado}>{estado}</SelectItem>
        ))}
      </Select>
    </ModalComponent>
  );
};

export default EditarAfeccionCultivoModal;
