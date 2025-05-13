import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ModalComponent from "@/components/Modal";
import { usePatchSensor } from "../../hooks/sensor/usePachtSensor";
import { SensorData, SENSOR_TYPES } from "../../types/sensorTypes";
import { Input, Select, SelectItem } from "@heroui/react";

interface Lote {
  id: number;
  nombre: string;
}

interface Era {
  id: number;
}

interface EditarSensorModalProps {
  sensor: SensorData;
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

const EditarSensorModal: React.FC<EditarSensorModalProps> = ({ sensor, onClose }) => {
  const [valor, setValor] = useState<number>(sensor.valor);
  const [fk_lote_id, setFkLote] = useState<number | null>(sensor.fk_lote_id);
  const [fk_eras_id, setFkEras] = useState<number | null>(sensor.fk_eras_id);
  const [tipo, setTipo] = useState<SensorData["tipo"]>(sensor.tipo);
  const [fecha, setFecha] = useState<string>(sensor.fecha);

  const { data: lotes = [] } = useQuery<Lote[]>({ queryKey: ["lotes"], queryFn: fetchLotes });
  const { data: eras = [] } = useQuery<Era[]>({ queryKey: ["eras"], queryFn: fetchEras });

  const { mutate, isPending } = usePatchSensor();

  const handleSubmit = () => {
    if (!tipo || valor === null || fk_lote_id === null || fk_eras_id === null) {
      return;
    }

    mutate(
      {
        id: sensor.id,
        data: { 
          valor, 
          fk_lote_id, 
          fk_eras_id, 
          tipo, 
          fecha 
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
      title="Editar Sensor"
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
        selectedKeys={[tipo]}
        onSelectionChange={(keys) => setTipo(Array.from(keys)[0] as SensorData["tipo"])}
      >
        {SENSOR_TYPES.map((sensor) => (
          <SelectItem key={sensor.key} textValue={sensor.label}>
            {sensor.label}
          </SelectItem>
        ))}
      </Select>

      <Select
        label="Lote"
        placeholder="Selecciona un lote"
        selectedKeys={fk_lote_id !== null ? [String(fk_lote_id)] : []}
        onSelectionChange={(keys) => setFkLote(Number(Array.from(keys)[0]))}
      >
        {lotes.map((lote) => (
          <SelectItem key={String(lote.id)} textValue={lote.nombre}>
            {lote.nombre}
          </SelectItem>
        ))}
      </Select>

      <Select
        label="Era"
        placeholder="Selecciona una era"
        selectedKeys={fk_eras_id !== null ? [String(fk_eras_id)] : []}
        onSelectionChange={(keys) => setFkEras(Number(Array.from(keys)[0]))}
      >
        {eras.map((era) => (
          <SelectItem key={String(era.id)} textValue={`Era ${era.id}`}>
            Era {era.id}
          </SelectItem>
        ))}
      </Select>

      <Input 
        label="Valor del Sensor" 
        type="number" 
        value={valor} 
        onChange={(e) => setValor(Number(e.target.value))} 
      />

      <Input 
        label="Fecha del Registro" 
        type="date" 
        value={fecha} 
        onChange={(e) => setFecha(e.target.value)} 
      />
    </ModalComponent>
  );
};

export default EditarSensorModal;