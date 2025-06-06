import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchLotes } from "../../hooks/lotes/usePatchLotes";
import { Lotes } from "../../types";
import { Input, Switch } from "@heroui/react";
import { addToast } from "@heroui/toast"; // Importa toast

interface EditarLoteModalProps {
  lote: Lotes;
  onClose: () => void;
}

const EditarLoteModal: React.FC<EditarLoteModalProps> = ({ lote, onClose }) => {
  const [nombre, setNombre] = useState<string>(lote.nombre ?? "");
  const [descripcion, setDescripcion] = useState<string>(lote.descripcion ?? "");
  const [latI1, setLatI1] = useState<number | null>(lote.latI1);
  const [longI1, setLongI1] = useState<number | null>(lote.longI1);
  const [latS1, setLatS1] = useState<number | null>(lote.latS1);
  const [longS1, setLongS1] = useState<number | null>(lote.longS1);
  const [latI2, setLatI2] = useState<number | null>(lote.latI2);
  const [longI2, setLongI2] = useState<number | null>(lote.longI2);
  const [latS2, setLatS2] = useState<number | null>(lote.latS2);
  const [longS2, setLongS2] = useState<number | null>(lote.longS2);
  const [estado, setEstado] = useState<string>(lote.estado ? "disponible" : "ocupado");

  const { mutate, isPending } = usePatchLotes();

  const handleEstadoSwitchChange = (isSelected: boolean) => {
    setEstado(isSelected ? "disponible" : "ocupado");
  };

  const handleSubmit = () => {
    // Validar nombre obligatorio
    if (!nombre.trim()) {
      addToast({
        title: "Campo obligatorio",
        description: "Por favor completa el campo Nombre antes de guardar.",
        color: "danger",
      });
      return;
    }

    mutate(
      {
        id: lote.id ?? 0,
        data: {
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
          estado: estado === "disponible",
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          addToast({
            title: "Error",
            description: "No fue posible actualizar el lote.",
            color: "danger",
          });
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Lote"
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
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        size="sm"
      />
      <Input
        label="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        size="sm"
      />

      <div className="grid grid-cols-2 gap-2 mt-2">
        <Input
          label="Lat. Inf. Izquierda"
          type="number"
          value={(latI1 ?? "").toString()}
          onChange={(e) => setLatI1(Number(e.target.value))}
          size="sm"
        />
        <Input
          label="Lon. Inf. Izquierda"
          type="number"
          value={(longI1 ?? "").toString()}
          onChange={(e) => setLongI1(Number(e.target.value))}
          size="sm"
        />
        <Input
          label="Lat. Sup. Izquierda"
          type="number"
          value={(latS1 ?? "").toString()}
          onChange={(e) => setLatS1(Number(e.target.value))}
          size="sm"
        />
        <Input
          label="Lon. Sup. Izquierda"
          type="number"
          value={(longS1 ?? "").toString()}
          onChange={(e) => setLongS1(Number(e.target.value))}
          size="sm"
        />
        <Input
          label="Lat. Inf. Derecha"
          type="number"
          value={(latI2 ?? "").toString()}
          onChange={(e) => setLatI2(Number(e.target.value))}
          size="sm"
        />
        <Input
          label="Lon. Inf. Derecha"
          type="number"
          value={(longI2 ?? "").toString()}
          onChange={(e) => setLongI2(Number(e.target.value))}
          size="sm"
        />
        <Input
          label="Lat. Sup. Derecha"
          type="number"
          value={(latS2 ?? "").toString()}
          onChange={(e) => setLatS2(Number(e.target.value))}
          size="sm"
        />
        <Input
          label="Lon. Sup. Derecha"
          type="number"
          value={(longS2 ?? "").toString()}
          onChange={(e) => setLongS2(Number(e.target.value))}
          size="sm"
        />
      </div>

      <div className="mt-4">
        <Switch
          size="sm"
          isSelected={estado === "disponible"}
          onValueChange={handleEstadoSwitchChange}
          color="success"
        >
          Lote Disponible
        </Switch>
      </div>
    </ModalComponent>
  );
};

export default EditarLoteModal;
