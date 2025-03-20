import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Select,
    SelectItem,
    useDisclosure,
  } from "@heroui/react";
  import { Icon } from "@iconify/react";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { useQuery, useMutation } from "@tanstack/react-query";
  import { SENSOR_TYPES } from "../types/sensorTypes";
  import { Toast } from "../components/toast";
  
  const fetchLotes = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/lote/");
    if (!res.ok) throw new Error("Error al obtener los lotes");
    const data = await res.json();
    console.log("Lotes desde API:", data);
    return data;
  };
  
  const fetchEras = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/eras/");
    if (!res.ok) throw new Error("Error al obtener las eras");
    const data = await res.json();
    console.log("Eras desde API:", data);
    return data;
  };
  
  export function SensorFormPage() {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [formData, setFormData] = useState({
      tipo: "",
      fk_lote: "",
      fk_era: "",
    });
  
    const { data: lotes = [], error: lotesError } = useQuery({ queryKey: ["lotes"], queryFn: fetchLotes });
    const { data: eras = [], error: erasError } = useQuery({ queryKey: ["eras"], queryFn: fetchEras });
  
    const mutation = useMutation({
      mutationFn: async (newSensor) => {
        const res = await fetch("http://127.0.0.1:8000/api/sensor/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSensor),
        });
        if (!res.ok) throw new Error("Error al registrar el sensor");
        return res.json();
      },
      onSuccess: () => {
        showToast("Sensor registrado correctamente", "success");
        setTimeout(() => navigate("/"), 2000);
      },
      onError: () => showToast("Error al registrar el sensor", "danger"),
    });
  
    const handleChange = (key, value) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    };
  
    const showToast = (message, type) => {
      setToastMessage(message);
      setToastType(type);
      onOpen();
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      mutation.mutate(formData);
    };
  
    if (lotesError || erasError) return <p>Error al cargar los datos</p>;
  
    return (
      <div className="flex min-h-screen items-center justify-center bg-default-100 p-4">
        <Card className="w-full max-w-[600px]" shadow="sm">
          <CardHeader className="flex flex-col gap-1 px-6 pb-4 pt-6">
            <div className="flex items-center gap-2">
              <Icon className="text-primary" icon="lucide:cpu" width={24} />
              <h1 className="text-2xl font-bold">Registro de Sensor</h1>
            </div>
            <p className="text-default-500">Ingrese los datos del sensor</p>
          </CardHeader>
          <CardBody>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Select label="Tipo de Sensor" selectedKey={formData.tipo} onSelectionChange={(key) => handleChange("tipo", key)}>
                {SENSOR_TYPES.map((type) => <SelectItem key={type.key}>{type.label}</SelectItem>)}
              </Select>
              <Select label="Lote" selectedKey={formData.fk_lote} onSelectionChange={(key) => handleChange("fk_lote", key)}>
                {lotes.length > 0 ? lotes.map((lote) => <SelectItem key={lote.id} textValue={lote.nombre}>{lote.nombre}</SelectItem>) : <SelectItem key="none">No hay lotes disponibles</SelectItem>}
              </Select>
              <Select label="Era" selectedKey={formData.fk_era} onSelectionChange={(key) => handleChange("fk_era", key)}>
                {eras.length > 0 ? eras.map((era) => <SelectItem key={era.id} textValue={era.nombre}>{era.nombre}</SelectItem>) : <SelectItem key="none">No hay eras disponibles</SelectItem>}
              </Select>
              <div className="flex justify-end gap-2 pt-4">
                <Button color="danger" variant="light" onPress={() => navigate("/")}>Cancelar</Button>
                <Button color="primary" endContent={<Icon icon="lucide:save" width={20} />} isLoading={mutation.isPending} type="submit">Guardar Sensor</Button>
              </div>
            </form>
          </CardBody>
        </Card>
        <Toast color={toastType} isOpen={isOpen} message={toastMessage} onClose={onClose} />
      </div>
    );
  }
  