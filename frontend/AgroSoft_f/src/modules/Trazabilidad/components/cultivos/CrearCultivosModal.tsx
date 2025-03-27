import { useState } from "react";
import { usePostCultivos } from "../../hooks/cultivos/usePostCultivos";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";

interface CrearCultivoModalProps {
  onClose: () => void;
}

export const CrearCultivoModal = ({ onClose }: CrearCultivoModalProps) => {
  const [nombre, setNombre] = useState<string>("");
  const [unidades, setUnidades] = useState<number | "">("");
  const [fechaSiembra, setFechaSiembra] = useState<string>("");
  const [fk_Especie, setFk_Especie] = useState<number | null>(null);
  const [activo, setActivo] = useState<boolean>(true); // Por defecto activo

  const { mutate, isPending } = usePostCultivos();
  const { data: especies, isLoading: isLoadingEspecies } = useGetEspecies();

  const handleSubmit = () => {
    if (!nombre || !unidades || !fechaSiembra || !fk_Especie) {
      console.log("Por favor, completa todos los campos obligatorios.");
      return;
    }
    mutate(
      {
        nombre,
        unidades: Number(unidades),
        fechaSiembra,
        fk_Especie,
        activo,
      },
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setUnidades("");
          setFechaSiembra("");
          setFk_Especie(null);
          setActivo(true);
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Cultivo"
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
        label="Nombre del Cultivo"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <Input
        label="Unidades"
        type="number"
        value={unidades.toString()}
        onChange={(e) => setUnidades(Number(e.target.value))}
        required
      />

      <Input
        label="Fecha de Siembra"
        type="date"
        value={fechaSiembra}
        onChange={(e) => setFechaSiembra(e.target.value)}
        required
      />

      {isLoadingEspecies ? (
        <p>Cargando especies...</p>
      ) : (
        <Select
          label="Especie"
          placeholder="Selecciona una especie"
          selectedKeys={fk_Especie ? [fk_Especie.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Especie(Number(selectedKey));
          }}
        >
          {(especies || []).map((especie) => (
            <SelectItem key={especie.id.toString()}>{especie.nombre}</SelectItem>
          ))}
        </Select>
      )}

        <Input
          type="checkbox"
          checked={activo}
          onChange={(event) => setActivo(event.target.checked)} 
        />

    </ModalComponent>
  );
};
