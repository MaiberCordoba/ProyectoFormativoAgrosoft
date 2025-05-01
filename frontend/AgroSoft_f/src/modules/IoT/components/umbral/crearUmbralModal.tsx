import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { SensorData, SENSOR_TYPES } from "../../types/sensorTypes";
import { usePostUmbral } from "../../hooks/umbral/usePostUmbral";

interface CrearUmbralModalProps {
  onClose: () => void;
}

const fetchSensores = async (): Promise<SensorData[]> => {
  const res = await fetch("http://127.0.0.1:8000/api/sensor/");
  if (!res.ok) throw new Error("Error al obtener los sensores");
  return res.json();
};

export const CrearUmbralModal = ({ onClose }: CrearUmbralModalProps) => {
  const [sensorId, setSensorId] = useState<number | null>(null);
  const [valorMinimo, setValorMinimo] = useState<number | null>(null);
  const [valorMaximo, setValorMaximo] = useState<number | null>(null);

  const { data: sensores = [] } = useQuery({
    queryKey: ["sensores"],
    queryFn: fetchSensores,
  });

  const mutation = usePostUmbral({
    onSuccess: () => {
      addToast({
        title: "Éxito",
        description: "Umbral registrado correctamente",
        color: "success",
      });
      resetForm();
      onClose();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo registrar el umbral";
      addToast({
        title: "Error",
        description: message,
        color: "danger",
      });
    },
  });

  const handleSubmit = async () => {
    if (sensorId === null || valorMinimo === null || valorMaximo === null) {
      addToast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos",
        color: "warning",
      });
      return;
    }

    if (valorMinimo >= valorMaximo) {
      addToast({
        title: "Error de validación",
        description: "El valor mínimo debe ser menor al máximo",
        color: "danger",
      });
      return;
    }

    mutation.mutate({
      sensor_id: sensorId,
      valor_minimo: valorMinimo,
      valor_maximo: valorMaximo,
    });
  };

  const resetForm = () => {
    setSensorId(null);
    setValorMinimo(null);
    setValorMaximo(null);
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registrar Umbral"
      footerButtons={[
        {
          label: mutation.isPending ? "Guardando..." : "Guardar",
          color: "success",
          onClick: handleSubmit,
        },
      ]}
    >
      {sensores.length === 0 && (
        <p className="text-sm text-gray-500 mb-2">Cargando sensores...</p>
      )}

      <Select
        label="Sensor"
        placeholder="Selecciona un sensor"
        selectedKeys={sensorId !== null ? [String(sensorId)] : []}
        onSelectionChange={(keys) => {
          const keyArray = Array.from(keys || []);
          setSensorId(keyArray.length > 0 ? Number(keyArray[0]) : null);
        }}
      >
        {sensores.map((sensor) => {
          const tipoLabel =
            SENSOR_TYPES.find((s) => s.key === sensor.tipo)?.label ||
            sensor.tipo;
          const labelText = `${tipoLabel} (ID ${sensor.id})`;
          return (
            <SelectItem
              key={String(sensor.id)}
              textValue={labelText}
            >
              {labelText}
            </SelectItem>
          );
        })}
      </Select>

      <Input
        label="Valor Mínimo"
        type="number"
        value={valorMinimo !== null ? String(valorMinimo) : ""}
        onChange={(e) =>
          setValorMinimo(
            e.target.value ? parseFloat(e.target.value) : null
          )
        }
      />

      <Input
        label="Valor Máximo"
        type="number"
        value={valorMaximo !== null ? String(valorMaximo) : ""}
        onChange={(e) =>
          setValorMaximo(
            e.target.value ? parseFloat(e.target.value) : null
          )
        }
      />
    </ModalComponent>
  );
};
