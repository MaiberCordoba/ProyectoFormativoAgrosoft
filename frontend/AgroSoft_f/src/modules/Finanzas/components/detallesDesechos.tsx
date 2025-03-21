import { useState, useEffect } from "react";
import ModalComponent from "@/components/Modal";
import { Desechos } from "../types";
import { Input, Button } from "@heroui/react";
import { putDesechos } from "../api/desechosApi"; // Asegúrate de importar la función PUT

interface DesechosModalProps {
  isOpen: boolean;
  onClose: () => void;
  desechos: Desechos | null;
  isEditMode?: boolean;
  onSaveSuccess?: () => void; // Nuevo: para actualizar la lista al guardar
}

export default function DetallesDesechos({ isOpen, onClose, desechos, isEditMode = false, onSaveSuccess }: DesechosModalProps) {
  const [formData, setFormData] = useState<Desechos | null>(desechos);
  const [isSaving, setIsSaving] = useState(false); // Estado para deshabilitar botón mientras guarda

  // Sincronizar estado cuando cambia la actividad seleccionada
  useEffect(() => {
    setFormData(desechos);
  }, [desechos]);

  if (!formData) return null;

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Guardar cambios en la API
  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      await putDesechos(formData.id, formData); // Enviar datos al backend
      alert("Desecho actualizado correctamente"); // Mensaje de éxito
      onSaveSuccess?.(); // Actualizar lista en `eputDesechosList.tsx`
      onClose(); // Cerrar modal
    } catch (error) {
      alert("Error al actualizar el desecho");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose} title={isEditMode ? "Editar Desecho" : "Detalles del desecho"}>
      <div>
        {isEditMode ? (
          // Modo edición: Inputs editables
          <>
            <Input label="Fk_Cultivo" name="fk_Cultivo" value={formData.fk_Cultivo} onChange={handleChange} />
            <Input label="FK_TipoDesecho" name="fk_TipoDesecho" value={formData.fk_TipoDesecho} onChange={handleChange} />
            <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
            <Input label="Descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} />
          </>
        ) : (
          // Modo lectura: Solo muestra datos
          <>
            <p><strong>ID:</strong> {formData.id}</p>
            <p><strong>FK_CULTIVO:</strong> {formData.fk_Cultivo}</p>
            <p><strong>FK_TIPODESECHO:</strong> {formData.fk_TipoDesecho}</p>
            <p><strong>NOMBRE:</strong> {formData.nombre}</p>
            <p><strong>DESCRIPCIÓN:</strong> {formData.descripcion}</p>
          </>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-2 mt-4">
          {isEditMode && (
            <Button color="success" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
          )}
        </div>
      </div>
    </ModalComponent>
  );
}
