import { useState, useEffect } from "react";
import ModalComponent from "@/components/Modal";
import { Cosechas } from "../types";
import { Input, Button } from "@heroui/react";
import { putCosechas } from "../api/cosechasApi"; // Asegúrate de importar la función PUT

interface CosechasModalProps {
  isOpen: boolean;
  onClose: () => void;
  cosechas: Cosechas | null;
  isEditMode?: boolean;
  onSaveSuccess?: () => void; // Nuevo: para actualizar la lista al guardar
}

export default function DetallesCosechas({ isOpen, onClose, cosechas, isEditMode = false, onSaveSuccess }: CosechasModalProps) {
  const [formData, setFormData] = useState<Cosechas | null>(cosechas);
  const [isSaving, setIsSaving] = useState(false); // Estado para deshabilitar botón mientras guarda

  // Sincronizar estado cuando cambia la actividad seleccionada
  useEffect(() => {
    setFormData(cosechas);
  }, [cosechas]);

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
      await putCosechas(formData.id, formData); // Enviar datos al backend
      alert("Cosecha actualizada correctamente"); // Mensaje de éxito
      onSaveSuccess?.(); // Actualizar lista en `ActividadesList.tsx`
      onClose(); // Cerrar modal
    } catch (error) {
      alert("Error al actualizar la Cosecha");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose} title={isEditMode ? "Editar Cosecha" : "Detalles de la Cosecha"}>
      <div>
        {isEditMode ? (
          // Modo edición: Inputs editables
          <>
            <Input label="fk_Cultivo" name="Cultivo" value={formData.fk_Cultivo} onChange={handleChange} />
            <Input label="Unidades" name="Unidades" value={formData.unidades} onChange={handleChange} />
            <Input label="Fecha" name="fecha" value={formData.fecha} onChange={handleChange} />
          </>
        ) : (
          // Modo lectura: Solo muestra datos
          <>
            <p><strong>ID:</strong> {formData.id}</p>
            <p><strong>FK_CULTIVO:</strong> {formData.fk_Cultivo}</p>
            <p><strong>UNIDADES:</strong> {formData.unidades}</p>
            <p><strong>FECHA:</strong> {formData.fecha}</p>
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
