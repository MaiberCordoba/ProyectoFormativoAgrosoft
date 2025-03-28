import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePostSensor } from "../../hooks/sensor/usePostSensor";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { addToast } from "@heroui/toast"; // Importamos las alertas
import { SENSOR_TYPES, SensorData } from "../../types/sensorTypes";

interface Lote {
  id: number;
  nombre: string;
}

interface Era {
  id: number;
}

type SensorCreateData = Omit<SensorData, "id">;

interface CrearSensorModalProps {
  onClose: () => void;
}

const fetchLotes = async (): Promise<Lote[]> => {
  const res = await fetch("http://127.0.0.1:8000/api/lote/");
  if (!res.ok) throw new Error("Error al obtener los lotes");
  return res.json();
};

const fetchEras = async (): Promise<Era[]> => {
  const res = await fetch("http://127.0.0.1:8000/api/eras/");
  if (!res.ok) throw new Error("Error al obtener las eras");
  return res.json();
};

const CrearSensorModal = ({ onClose }: CrearSensorModalProps) => {
  const [tipo, setTipo] = useState<SensorCreateData["tipo"] | null>(null);
  const [fk_lote, setFkLote] = useState<number | null>(null);
  const [fk_eras, setFkEras] = useState<number | null>(null);
  const [valor, setValor] = useState<number | null>(null);
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split("T")[0]);

  const { data: lotes = [] } = useQuery<Lote[]>({ queryKey: ["lotes"], queryFn: fetchLotes });
  const { data: eras = [] } = useQuery<Era[]>({ queryKey: ["eras"], queryFn: fetchEras });

  const { mutate, isPending } = usePostSensor();

  const handleSubmit = () => {
    if (!tipo || valor === null || fk_lote === null || fk_eras === null) {
      addToast({
        title: "Error",
        description: "Todos los campos son obligatorios.",
        color: "danger",
      });
      return;
    }

    const sensorData: SensorData = {
      id: 0,
      tipo,
      fk_lote,
      fk_eras,
      valor,
      fecha,
    };

    mutate(sensorData, {
      onSuccess: () => {
        addToast({
          title: "Éxito",
          description: "Sensor creado con éxito.",
          color: "success",
        });
        onClose();
        setTipo(null);
        setFkLote(null);
        setFkEras(null);
        setValor(null);
        setFecha(new Date().toISOString().split("T")[0]);
      },
    });
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Sensores"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      <Select
        label="Tipo de Sensor"
        placeholder="Selecciona un tipo de sensor"
        selectedKeys={tipo ? [tipo] : []}
        onSelectionChange={(keys) => setTipo(Array.from(keys)[0] as SensorCreateData["tipo"])}
      >
        {SENSOR_TYPES.map((sensor) => (
          <SelectItem key={sensor.key}>{sensor.label}</SelectItem>
        ))}
      </Select>

      <Select
        label="Lote"
        placeholder="Selecciona un lote"
        selectedKeys={fk_lote !== null ? [String(fk_lote)] : []}
        onSelectionChange={(keys) => setFkLote(Number(Array.from(keys)[0]))}
      >
        {lotes.map((lote) => (
          <SelectItem key={String(lote.id)}>{lote.nombre}</SelectItem>
        ))}
      </Select>

      <Select
        label="Era"
        placeholder="Selecciona una era"
        selectedKeys={fk_eras !== null ? [String(fk_eras)] : []}
        onSelectionChange={(keys) => setFkEras(Number(Array.from(keys)[0]))}
      >
        {eras.map((era) => (
          <SelectItem key={String(era.id)}>{`Era ${era.id}`}</SelectItem>
        ))}
      </Select>

      <Input
        label="Valor del Sensor"
        type="number"
        value={valor !== null ? String(valor) : ""}
        onChange={(e) => setValor(e.target.value ? Number(e.target.value) : null)}
        required
      />

      <Input
        label="Fecha del Registro"
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        required
      />
    </ModalComponent>
  );
};

export default CrearSensorModal;
