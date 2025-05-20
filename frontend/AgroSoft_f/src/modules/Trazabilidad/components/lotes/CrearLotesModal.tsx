import { useState } from "react";
import { usePostLotes } from "../../hooks/lotes/usePostLotes";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { Lotes } from "../../types";

interface CrearLoteModalProps {
  onClose: () => void;
  onCreate: (nuevoLote: Lotes) => void;
}

export const CrearLoteModal = ({ onClose, onCreate }: CrearLoteModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [latI1, setLatI1] = useState<number | null>(null);
  const [longI1, setLongI1] = useState<number | null>(null);
  const [latS1, setLatS1] = useState<number | null>(null);
  const [longS1, setLongS1] = useState<number | null>(null);
  const [latI2, setLatI2] = useState<number | null>(null);
  const [longI2, setLongI2] = useState<number | null>(null);
  const [latS2, setLatS2] = useState<number | null>(null);
  const [longS2, setLongS2] = useState<number | null>(null);
  const [estado, setEstado] = useState<string>("di"); // "di" = disponible

  const { mutate, isPending } = usePostLotes();

  const handleSubmit = () => {
    const campos = [latI1, longI1, latS1, longS1, latI2, longI2, latS2, longS2];
    const camposInvalidos = campos.some((val) => val === null || isNaN(val));

    if (!nombre) {
      console.log("El nombre es obligatorio.");
      return;
    }

    if (camposInvalidos) {
      console.log(
        "Todos los campos de coordenadas deben tener valores válidos."
      );
      return;
    }

    mutate(
      {
        nombre,
        descripcion,
        latI1,
        longI1,
        latS1,
        longS1,
        latI2,
        longI2,
        latS2,
        longS2,
        estado: estado === "di",
      },
      {
        onSuccess: (data) => {
          onCreate(data);
          onClose();
          // reset form
          setNombre("");
          setDescripcion("");
          setLatI1(null);
          setLongI1(null);
          setLatS1(null);
          setLongS1(null);
          setLatI2(null);
          setLongI2(null);
          setLatS2(null);
          setLongS2(null);
          setEstado("di");
        },
      }
    );
  };

  const handleNumberInput = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    const normalized = value.replace(",", "."); // permite usar coma como decimal
    const parsed = Number(normalized);
    setter(normalized === "" || isNaN(parsed) ? null : parsed);
  };

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
      />

      <Input
        label="Descripción"
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-2 mt-2">
        <Input
          label="Lat. Inf. Izquierda"
          type="text"
          inputMode="decimal"
          value={latI1 !== null ? latI1.toString() : ""}
          onChange={(e) => handleNumberInput(e.target.value, setLatI1)}
        />
        <Input
          label="Long. Inf. Izquierda"
          type="text"
          inputMode="decimal"
          value={longI1 !== null ? longI1.toString() : ""}
          onChange={(e) => handleNumberInput(e.target.value, setLongI1)}
        />

        <Input
          label="Lat. Sup. Izquierda"
          type="text"
          inputMode="decimal"
          value={latS1 !== null ? latS1.toString() : ""}
          onChange={(e) => handleNumberInput(e.target.value, setLatS1)}
        />
        <Input
          label="Long. Sup. Izquierda"
          type="text"
          inputMode="decimal"
          value={longS1 !== null ? longS1.toString() : ""}
          onChange={(e) => handleNumberInput(e.target.value, setLongS1)}
        />

        <Input
          label="Lat. Inf. Derecha"
          type="text"
          inputMode="decimal"
          value={latI2 !== null ? latI2.toString() : ""}
          onChange={(e) => handleNumberInput(e.target.value, setLatI2)}
        />
        <Input
          label="Long. Inf. Derecha"
          type="text"
          inputMode="decimal"
          value={longI2 !== null ? longI2.toString() : ""}
          onChange={(e) => handleNumberInput(e.target.value, setLongI2)}
        />

        <Input
          label="Lat. Sup. Derecha"
          type="text"
          inputMode="decimal"
          value={latS2 !== null ? latS2.toString() : ""}
          onChange={(e) => handleNumberInput(e.target.value, setLatS2)}
        />
        <Input
          label="Long. Sup. Derecha"
          type="text"
          inputMode="decimal"
          value={longS2 !== null ? longS2.toString() : ""}
          onChange={(e) => handleNumberInput(e.target.value, setLongS2)}
        />
      </div>

      <Select
        label="Estado"
        placeholder="Selecciona un estado"
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
