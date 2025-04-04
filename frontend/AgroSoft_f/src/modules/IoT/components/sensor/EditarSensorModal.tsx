import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchSensor } from "../../hooks/sensor/usePachtSensor";
import { SensorData, SENSOR_TYPES } from "../../types/sensorTypes";
import { Input, Select, SelectItem } from "@heroui/react";

interface EditarSensorModalProps {
  sensor: SensorData;
  onClose: () => void;
}

const EditarSensorModal: React.FC<EditarSensorModalProps> = ({ sensor, onClose }) => {
  const [valor, setValor] = useState<number>(sensor.valor);
  const [fk_lote, setFkLote] = useState<number | null>(sensor.fk_lote);
  const [fk_eras, setFkEras] = useState<number | null>(sensor.fk_eras);
  const [tipo, setTipo] = useState<SensorData["tipo"]>(sensor.tipo);
  const [fecha, setFecha] = useState<string>(sensor.fecha);

  const { mutate, isPending } = usePatchSensor();

  const handleSubmit = () => {
    console.log("Editando sensor con ID:", sensor.id, {
      valor,
      fk_lote,
      fk_eras,
      tipo,
      fecha,
    });

    mutate(
      {
        id: sensor.id,
        data: { valor, fk_lote, fk_eras, tipo, fecha },
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
      <Input label="Valor del Sensor" type="number" value={valor} onChange={(e) => setValor(Number(e.target.value))} />
      <Input label="ID del Lote" type="number" value={fk_lote ?? ""} onChange={(e) => setFkLote(Number(e.target.value))} />
      <Input label="ID de las Eras" type="number" value={fk_eras ?? ""} onChange={(e) => setFkEras(Number(e.target.value))} />
      <Input label="Fecha del Registro" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />

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
    </ModalComponent>
  );
};

export default EditarSensorModal;
