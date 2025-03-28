import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
  useDisclosure,
  Input,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SENSOR_TYPES } from "../types/sensorTypes";
import { Toast } from "../components/toast";

// Definir tipos
interface Lote {
  id: number;
  nombre: string;
}

interface Era {
  id: number;
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

export function SensorFormPage() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "default" | undefined>();

  const [formData, setFormData] = useState({ tipo: "", fk_lote_id: "", fk_eras_id: "", valor: "" });
  const [errors, setErrors] = useState({ tipo: "", fk_lote_id: "", fk_eras_id: "", valor: "" });

  const { data: lotes = [] } = useQuery<Lote[]>({ queryKey: ["lotes"], queryFn: fetchLotes });
  const { data: eras = [] } = useQuery<Era[]>({ queryKey: ["eras"], queryFn: fetchEras });

  const mutation = useMutation({
    mutationFn: async (newSensor: typeof formData) => {
      const res = await fetch("http://127.0.0.1:8000/api/sensor/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSensor),
      });
      if (!res.ok) throw new Error("Error al registrar el sensor");
      return res.json();
    },
    onSuccess: (data) => {
      showToast("Sensor registrado correctamente", "success");
      setTimeout(() => navigate(`/sensores/${data.id}`), 2000);
    },
    onError: (error) => showToast(error.message, "default"),
  });

  const validateField = (name: string, value: string) => {
    if (!value) return "Este campo es obligatorio";
    if (name === "valor" && (isNaN(Number(value)) || Number(value) < 0)) return "Debe ser un número válido";
    return "";
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
  };

  const showToast = (message: string, type: "success" | "default") => {
    setToastMessage(message);
    setToastType(type);
    onOpen();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = Object.keys(formData).reduce((acc, key) => {
      const error = validateField(key, formData[key]);
      if (error) acc[key] = error;
      return acc;
    }, {} as Record<string, string>);

    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) return;

    mutation.mutate(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-default-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-lg p-6">
        <CardHeader className="flex flex-col items-center space-y-2">
          <Icon className="text-primary" icon="lucide:cpu" width={28} />
          <h1 className="text-xl font-bold">Registrar Sensor</h1>
        </CardHeader>
        <CardBody>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Select
              isRequired
              errorMessage={errors.tipo}
              label="Tipo de Sensor"
              onSelectionChange={(keys) => handleChange("tipo", String(Array.from(keys)[0] || ""))}
            >
              {SENSOR_TYPES.map((type) => (
                <SelectItem key={type.key}>{type.label}</SelectItem>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Select
                isRequired
                errorMessage={errors.fk_lote_id}
                label="Lote"
                onSelectionChange={(keys) => handleChange("fk_lote_id", String(Array.from(keys)[0] || ""))}
              >
                {lotes.map((lote) => (
                  <SelectItem key={String(lote.id)}>{lote.nombre}</SelectItem>
                ))}
              </Select>

              <Select
                isRequired
                errorMessage={errors.fk_eras_id}
                label="Era"
                onSelectionChange={(keys) => handleChange("fk_eras_id", String(Array.from(keys)[0] || ""))}
              >
                {eras.map((era) => (
                  <SelectItem key={String(era.id)}>{`Era ${era.id}`}</SelectItem>
                ))}
              </Select>
            </div>

            <Input
              isRequired
              errorMessage={errors.valor}
              label="Valor"
              type="number"
              onChange={(e) => handleChange("valor", e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button color="default" variant="light" onPress={() => navigate(-1)}>Cancelar</Button>
              <Button color="success" endContent={<Icon icon="lucide:save" width={16} />} isLoading={mutation.isPending} type="submit">Guardar</Button>
            </div>
          </form>
        </CardBody>
      </Card>
      <Toast color={toastType} isOpen={isOpen} message={toastMessage} onClose={onClose} />
    </div>
  );
}
