import { useState } from "react";
import { usePostLotes } from "../../hooks/lotes/usePostLotes";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { Lotes } from "../../types";

interface CrearLoteModalProps {
  onClose: () => void;
  onCreate: (nuevoLote: Lotes) => void;
}

export const CrearLoteModal = ({ onClose, onCreate }: CrearLoteModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [latI1, setLatI1] = useState<string>("");
  const [longI1, setLongI1] = useState<string>("");
  const [latS1, setLatS1] = useState<string>("");
  const [longS1, setLongS1] = useState<string>("");
  const [latI2, setLatI2] = useState<string>("");
  const [longI2, setLongI2] = useState<string>("");
  const [latS2, setLatS2] = useState<string>("");
  const [longS2, setLongS2] = useState<string>("");
  const [estado, setEstado] = useState<string>("di");

  const { mutate, isPending } = usePostLotes();

  const handleSubmit = () => {
    const parsedLatI1 = parseFloat(latI1.replace(",", "."));
    const parsedLongI1 = parseFloat(longI1.replace(",", "."));
    const parsedLatS1 = parseFloat(latS1.replace(",", "."));
    const parsedLongS1 = parseFloat(longS1.replace(",", "."));
    const parsedLatI2 = parseFloat(latI2.replace(",", "."));
    const parsedLongI2 = parseFloat(longI2.replace(",", "."));
    const parsedLatS2 = parseFloat(latS2.replace(",", "."));
    const parsedLongS2 = parseFloat(longS2.replace(",", "."));

    const campos = [
      parsedLatI1,
      parsedLongI1,
      parsedLatS1,
      parsedLongS1,
      parsedLatI2,
      parsedLongI2,
      parsedLatS2,
      parsedLongS2,
    ];

    const camposInvalidos = campos.some((val) => isNaN(val));

    if (!nombre || camposInvalidos) {
      addToast({
        title: "Campos Obligatorios",
        description:
          "Por favor completa el nombre y asegúrate de que todos los campos de coordenadas sean válidos.",
        color: "warning",
      });
      return;
    }

    mutate(
      {
        nombre,
        descripcion,
        latI1: parsedLatI1,
        longI1: parsedLongI1,
        latS1: parsedLatS1,
        longS1: parsedLongS1,
        latI2: parsedLatI2,
        longI2: parsedLongI2,
        latS2: parsedLatS2,
        longS2: parsedLongS2,
        estado: estado === "di",
      },
      {
        onSuccess: (data) => {
          onCreate(data);
          onClose();
          setNombre("");
          setDescripcion("");
          setLatI1("");
          setLongI1("");
          setLatS1("");
          setLongS1("");
          setLatI2("");
          setLongI2("");
          setLatS2("");
          setLongS2("");
          setEstado("di");
        },
        onError: () => {
          addToast({
            title: "Error",
            description: "No fue posible registrar el lote.",
            color: "danger",
          });
        },
      }
    );
  };

  const renderInput = (
    label: string,
    value: string,
    setter: (val: string) => void
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => setter(e.target.value)}
        placeholder={label}
        className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 text-sm"
      />
    </div>
  );

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Lote"
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
        label="Nombre"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        size="sm"
      />

      <Input
        label="Descripción"
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        size="sm"
      />

      <div className="grid grid-cols-2 gap-2 mt-2">
        {renderInput("Lat. Inf. Izquierda", latI1, setLatI1)}
        {renderInput("Lon. Inf. Izquierda", longI1, setLongI1)}
        {renderInput("Lat. Sup. Izquierda", latS1, setLatS1)}
        {renderInput("Lon. Sup. Izquierda", longS1, setLongS1)}
        {renderInput("Lat. Inf. Derecha", latI2, setLatI2)}
        {renderInput("Lon. Inf. Derecha", longI2, setLongI2)}
        {renderInput("Lat. Sup. Derecha", latS2, setLatS2)}
        {renderInput("Lon. Sup. Derecha", longS2, setLongS2)}
      </div>

      <Select
        label="Estado"
        placeholder="Selecciona un estado"
        size="sm"
        selectedKeys={[estado]}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0]?.toString();
          if (selectedKey) {
            setEstado(selectedKey);
          }
        }}
      >
        <SelectItem key="di">Disponible</SelectItem>
        <SelectItem key="oc">Ocupado</SelectItem>
      </Select>
    </ModalComponent>
  );
};
