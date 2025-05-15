import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePostSensor } from "../../hooks/sensor/usePostSensor";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { addToast } from "@heroui/toast";
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

const LOTES_ONLY = ["TEM", "LUM", "HUM_A", "VIE"];
const ERAS_ONLY = ["HUM_T", "PH"];

const CrearSensorModal = ({ onClose }: CrearSensorModalProps) => {
  const [tipo, setTipo] = useState<SensorCreateData["tipo"] | "">("");
  const [fk_lote_id, setFkLote] = useState<number | null>(null);
  const [fk_eras_id, setFkEras] = useState<number | null>(null);
  const [valor, setValor] = useState<number | null>(null);
  const [umbral_minimo, setUmbralMinimo] = useState<number | null>(null);
  const [umbral_maximo, setUmbralMaximo] = useState<number | null>(null);
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split("T")[0]);

  const { data: lotes = [] } = useQuery<Lote[]>({ queryKey: ["lotes"], queryFn: fetchLotes });
  const { data: eras = [] } = useQuery<Era[]>({ queryKey: ["eras"], queryFn: fetchEras });

  const { mutate, isPending } = usePostSensor();

  const isLoteRequired = tipo && LOTES_ONLY.includes(tipo);
  const isEraRequired = tipo && ERAS_ONLY.includes(tipo);

  const handleSubmit = () => {
  if (!tipo || valor === null || (!isLoteRequired && !isEraRequired)) {
    addToast({
      title: "Error",
      description: "Todos los campos obligatorios deben estar completos.",
      color: "danger",
    });
    return;
  }

  if (isLoteRequired && fk_lote_id === null) {
    addToast({ title: "Error", description: "Selecciona un lote.", color: "danger" });
    return;
  }

  if (isEraRequired && fk_eras_id === null) {
    addToast({ title: "Error", description: "Selecciona una era.", color: "danger" });
    return;
  }

  if (umbral_minimo !== null && umbral_maximo !== null && umbral_minimo >= umbral_maximo) {
    addToast({
      title: "Error",
      description: "El umbral mínimo debe ser menor que el umbral máximo.",
      color: "danger",
    });
    return;
  }

  const sensorData: Partial<SensorData> = {
    id: 0,
    tipo: tipo as SensorData["tipo"],
    valor,
    fecha,
    umbral_minimo,
    umbral_maximo,
  };

  if (isLoteRequired && fk_lote_id !== null) {
    sensorData.fk_lote_id = fk_lote_id;
  }

  if (isEraRequired && fk_eras_id !== null) {
    sensorData.fk_eras_id = fk_eras_id;
  }

    // 🔍 Aquí ves lo que estás enviando
    console.log("SensorData a enviar:", sensorData);

  mutate(sensorData as SensorData, {
    onSuccess: () => {
      addToast({ title: "Éxito", description: "Sensor creado con éxito.", color: "success" });
      onClose();
      setTipo("");
      setFkLote(null);
      setFkEras(null);
      setValor(null);
      setFecha(new Date().toISOString().split("T")[0]);
      setUmbralMinimo(null);
      setUmbralMaximo(null);
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.message || "Ocurrió un error al crear el sensor.",
        color: "danger",
      });
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
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as SensorData["tipo"];
          setTipo(selected);
          setFkLote(null);
          setFkEras(null);
        }}
      >
        {SENSOR_TYPES.map((sensor) => (
          <SelectItem key={sensor.key} >
            {sensor.label}
          </SelectItem>
        ))}
      </Select>

      {isLoteRequired && (
        <Select
          label="Lote"
          placeholder="Selecciona un lote"
          selectedKeys={fk_lote_id !== null ? [String(fk_lote_id)] : []}
          onSelectionChange={(keys) => {
            const selected = Number(Array.from(keys)[0]);
            setFkLote(selected);
          }}
        >
          {lotes.map((lote) => (
            <SelectItem key={String(lote.id)} >
              {lote.nombre}
            </SelectItem>
          ))}
        </Select>
      )}

      {isEraRequired && (
        <Select
          label="Era"
          placeholder="Selecciona una era"
          selectedKeys={fk_eras_id !== null ? [String(fk_eras_id)] : []}
          onSelectionChange={(keys) => {
            const selected = Number(Array.from(keys)[0]);
            setFkEras(selected);
          }}
        >
          {eras.map((era) => (
            <SelectItem key={String(era.id)} >
              {`Era ${era.id}`}
            </SelectItem>
          ))}
        </Select>
      )}

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

      <Input
        label="Umbral Mínimo"
        type="number"
        value={umbral_minimo !== null ? String(umbral_minimo) : ""}
        onChange={(e) => setUmbralMinimo(e.target.value ? Number(e.target.value) : null)}
        description="Valor mínimo permitido para este sensor"
      />

      <Input
        label="Umbral Máximo"
        type="number"
        value={umbral_maximo !== null ? String(umbral_maximo) : ""}
        onChange={(e) => setUmbralMaximo(e.target.value ? Number(e.target.value) : null)}
        description="Valor máximo permitido para este sensor"
      />
    </ModalComponent>
  );
};

export default CrearSensorModal;
