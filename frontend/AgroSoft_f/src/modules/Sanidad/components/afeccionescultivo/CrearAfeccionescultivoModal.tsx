import { useState } from "react";
import { Input, Select, SelectItem } from "@heroui/react";
import ModalComponent from "@/components/Modal";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { useGetAfecciones } from "../../hooks/afecciones/useGetAfecciones";
import { EstadoAfeccion, AfeccionesCultivo } from "../../types"; 
import { usePostAfeccionCultivo } from "../../hooks/afeccionescultivo/usePostAfeccionescultivo";

interface CrearAfeccionCultivoModalProps {
  onClose: () => void;
}

export const CrearAfeccionCultivoModal = ({ onClose }: CrearAfeccionCultivoModalProps) => {
  const [fk_Plantacion, setFk_Plantacion] = useState<number | null>(null);
  const [fk_Plaga, setFk_Plaga] = useState<number | null>(null);
  const [fechaEncuentro, setFechaEncuentro] = useState<string>("");
  const [estado, setEstado] = useState<keyof typeof EstadoAfeccion>("ST"); // Valores compatibles con backend

  const { data: plantaciones, isLoading: isLoadingPlantaciones } = useGetPlantaciones();
  const { data: tiposPlaga, isLoading: isLoadingTiposPlaga } = useGetAfecciones();
  const { mutate, isPending } = usePostAfeccionCultivo();

  const handleSubmit = () => {
    if (!fk_Plantacion || !fk_Plaga || !estado || !fechaEncuentro) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    const data: AfeccionesCultivo = {
      fk_Plantacion: Number(fk_Plantacion),
      fk_Plaga: Number(fk_Plaga),
      estado, // Se envía como "ST", "EC" o "EL"
      fechaEncuentro,
      id: 0, // Se generará en el backend
    };

    mutate(data, {
      onSuccess: () => {
        onClose();
        setFk_Plantacion(null);
        setFk_Plaga(null);
        setEstado("ST"); // Resetear al valor por defecto
        setFechaEncuentro("");
      },
    });
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Afección Cultivo"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      {/* Selector de Plantación */}
      {isLoadingPlantaciones ? (
        <p>Cargando plantaciones...</p>
      ) : (
        <Select
          label="Plantación"
          placeholder="Selecciona una plantación"
          selectedKeys={fk_Plantacion ? [fk_Plantacion.toString()] : []}
          onSelectionChange={(keys) => setFk_Plantacion(Number(Array.from(keys)[0]))}
        >
          {(plantaciones || []).map((plantacion) => (
            <SelectItem key={plantacion.id.toString()}>{plantacion.id}</SelectItem>
          ))}
        </Select>
      )}

      {/* Selector de Plaga */}
      {isLoadingTiposPlaga ? (
        <p>Cargando tipos de plaga...</p>
      ) : (
        <Select
          label="Tipo de Plaga"
          placeholder="Selecciona un tipo de plaga"
          selectedKeys={fk_Plaga ? [fk_Plaga.toString()] : []}
          onSelectionChange={(keys) => setFk_Plaga(Number(Array.from(keys)[0]))}
        >
          {(tiposPlaga || []).map((tipo) => (
            <SelectItem key={tipo.id.toString()}>{tipo.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {/* Selector de estado de la afección */}
      <Select
        label="Estado de la Afección"
        placeholder="Selecciona el estado"
        selectedKeys={estado ? [estado] : []}
        onSelectionChange={(keys) => setEstado(Array.from(keys)[0] as keyof typeof EstadoAfeccion)}
      >
        {Object.entries(EstadoAfeccion).map(([key, label]) => (
          <SelectItem key={key}>{label}</SelectItem>
        ))}
      </Select>

      {/* Campo de fecha de encuentro */}
      <Input
        label="Fecha del Encuentro"
        type="date"
        value={fechaEncuentro}
        onChange={(e) => setFechaEncuentro(e.target.value)}
        required
      />
    </ModalComponent>
  );
};
