import { useState } from "react";
import { usePostInsumo } from "../../hooks/insumos/usePostInsumos";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetUnidadesMedida } from "@/modules/Finanzas/hooks/unidadesMedida/useGetUnidadesMedida";

interface CrearInsumosModalProps {
  onClose: () => void;
}

export const CrearInsumosModal = ({ onClose }: CrearInsumosModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number | null>(null);
  const [compuestoActivo, setCompuestoActivo] = useState("");
  const [contenido, setContenido] = useState<number | null>(null);
  const [fichaTecnica, setFichaTecnica] = useState(""); // Corregido a string
  const [unidades, setUnidades] = useState<number | null>(null);
  const [fk_UnidadMedida, setfk_UnidadMedida] = useState<number | null>(null);

  const { data: unidadesMedida, isLoading: isLoadingUnidad } = useGetUnidadesMedida();
  const { mutate, isPending } = usePostInsumo();

  const handleSubmit = () => {
    if (
      !nombre ||
      !descripcion ||
      precio === null ||
      !compuestoActivo ||
      contenido === null ||
      !fichaTecnica ||
      unidades === null ||
      fk_UnidadMedida === null
    ) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      {
        nombre,
        descripcion,
        precio,
        compuestoActivo,
        contenido,
        fichaTecnica,
        unidades,
        fk_UnidadMedida,
      },
      {
        onSuccess: () => {
          onClose();
          // Limpiar campos
          setNombre("");
          setDescripcion("");
          setPrecio(null);
          setCompuestoActivo("");
          setContenido(null);
          setFichaTecnica("");
          setUnidades(null);
          setfk_UnidadMedida(null);
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Insumos"
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
        label="Nombre Insumo"
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
        required
      />
      <Input
        label="Precio Insumo"
        type="number"
        value={precio ?? ""}
        onChange={(e) => setPrecio(Number(e.target.value))}
        required
      />
      <Input
        label="Compuesto activo"
        type="text"
        value={compuestoActivo}
        onChange={(e) => setCompuestoActivo(e.target.value)}
        required
      />
      <Input
        label="Contenido"
        type="number"
        value={contenido ?? ""}
        onChange={(e) => setContenido(Number(e.target.value))}
        required
      />
      <Input
        label="Ficha Técnica"
        type="text"
        value={fichaTecnica}
        onChange={(e) => setFichaTecnica(e.target.value)}
        required
      />
      <Input
        label="Unidades"
        type="number"
        value={unidades ?? ""}
        onChange={(e) => setUnidades(Number(e.target.value))}
        required
      />
      {isLoadingUnidad ? (
        <p>Cargando unidades de medida...</p>
      ) : (
        <Select
          label="Unidad de Medida"
          placeholder="Selecciona la Unidad de Medida"
          selectedKeys={fk_UnidadMedida ? [fk_UnidadMedida.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setfk_UnidadMedida(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(unidadesMedida || []).map((unidad) => (
            <SelectItem key={unidad.id.toString()}>{unidad.nombre}</SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};
