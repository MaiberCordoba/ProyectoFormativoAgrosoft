import { useState, useEffect } from "react";
import ModalComponent from "@/components/Modal";
import { Herramientas } from "../types";
import { Input, Button } from "@heroui/react";
import { putHerramientas } from "../api/herramientasApi"; // Asegúrate de importar la función PUT

interface HerramientasModalProps {
  isOpen: boolean;
  onClose: () => void;
  herramientas: Herramientas | null;
  isEditMode?: boolean;
  onSaveSuccess?: () => void; // Nuevo: para actualizar la lista al guardar
}

export default function DetallesHerramientas({ isOpen, onClose, herramientas, isEditMode = false, onSaveSuccess }: HerramientasModalProps) {
  const [formData, setFormData] = useState<Herramientas | null>(herramientas);
  const [isSaving, setIsSaving] = useState(false); // Estado para deshabilitar botón mientras guarda

  // Sincronizar estado cuando cambia la actividad seleccionada
  useEffect(() => {
    setFormData(herramientas);
  }, [herramientas]);

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
      await putHerramientas(formData.id, formData); // Enviar datos al backend
      alert("Herramienta actualizada correctamente"); // Mensaje de éxito
      onSaveSuccess?.(); // Actualizar lista en `eputDesechosList.tsx`
      onClose(); // Cerrar modal
    } catch (error) {
      alert("Error al actualizar la herramienta");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose} title={isEditMode ? "Editar Herramienta" : "Detalles de la Herramienta"}>
      <div>
        {isEditMode ? (
          // Modo edición: Inputs editables
          <>
            <Input label="Fk_Lote" name="fk_Lote" value={formData.fk_Lote} onChange={handleChange} />
            <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
            <Input label="Descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} />
            <Input label="Unidades" name="unidades" value={formData.unidades} onChange={handleChange} />
          </>
        ) : (
          // Modo lectura: Solo muestra datos
          <>
            <p><strong>ID:</strong> {formData.id}</p>
            <p><strong>FK_LOTE:</strong> {formData.fk_Lote}</p>
            <p><strong>NOMBRE:</strong> {formData.nombre}</p>
            <p><strong>DESCRIPCION:</strong> {formData.descripcion}</p>
            <p><strong>UNIDADES:</strong> {formData.unidades}</p>
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
