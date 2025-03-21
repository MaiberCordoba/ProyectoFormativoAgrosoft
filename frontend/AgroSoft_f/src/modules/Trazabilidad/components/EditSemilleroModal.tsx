import { useState } from "react";
import { Modal } from "@heroui/react";
import { useUpdateSemillero } from "../hooks/useUpdateSemillero";
import FormComponent from "@/components/Form";
import { EditSemilleroModalProps } from "../types";
import { Semillero } from "../types";

const EditSemilleroModal: React.FC<EditSemilleroModalProps> = ({ semillero, onClose }) => {
  const mutation = useUpdateSemillero();

  const [formData, setFormData] = useState<Semillero>({
    id: semillero?.id ?? 0,  // Asegúrate de agregar el ID
    fk_especie: semillero?.fk_especie ?? 0,
    unidades: semillero?.unidades ?? 0,  // Convertir a número
    fechasiembra: semillero?.fechasiembra ?? "",
    fechaestimada: semillero?.fechaestimada ?? "",
  });

  const handleChange = (key: keyof Semillero, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (data: Partial<Semillero>) => {
    try {
      await mutation.mutateAsync({ id: semillero.id, ...data });
      alert("Semillero actualizado con éxito");
      onClose(); // Cierra el modal después de guardar
    } catch (error) {
      console.error("Error al actualizar semillero:", error);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Editar Semillero">
        <FormComponent
        fields={[
            { name: "fk_especie", label: "Especie", required: true, defaultValue: formData.fk_especie, onChange: (value) => setFormData({ ...formData, fk_especie: Number(value) }) },
            { name: "unidades", label: "Unidades", type: "number", required: true, defaultValue: formData.unidades, onChange: (value) => setFormData({ ...formData, unidades: String(value) }) },
            { name: "fechasiembra", label: "Fecha de Siembra", type: "date", required: true, defaultValue: formData.fechasiembra, onChange: (value) => setFormData({ ...formData, fechasiembra: String(value) }) },
            { name: "fechaestimada", label: "Fecha Estimada", type: "date", required: true, defaultValue: formData.fechaestimada, onChange: (value) => setFormData({ ...formData, fechaestimada: String(value) }) },
        ]}
        onSubmit={handleSubmit}
        submitLabel="Actualizar Semillero"
        />

    </Modal>
  );
};

export default EditSemilleroModal;