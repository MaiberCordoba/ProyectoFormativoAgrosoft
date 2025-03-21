import { useState, useEffect } from "react";
import ModalComponent from "@/components/Modal";
import { Actividades } from "../types";
import { Input, Button } from "@heroui/react";
import { putActividades } from "../api/actividadesApi"; // Asegúrate de importar la función PUT

interface ActividadesModalProps {
  isOpen: boolean;
  onClose: () => void;
  actividades: Actividades | null;
  isEditMode?: boolean;
  onSaveSuccess?: () => void; // Nuevo: para actualizar la lista al guardar
}

export default function DetallesActividades({ isOpen, onClose, actividades, isEditMode = false, onSaveSuccess }: ActividadesModalProps) {
  const [formData, setFormData] = useState<Actividades | null>(actividades);
  const [isSaving, setIsSaving] = useState(false); // Estado para deshabilitar botón mientras guarda

  // Sincronizar estado cuando cambia la actividad seleccionada
  useEffect(() => {
    setFormData(actividades);
  }, [actividades]);

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
      await putActividades(formData.id, formData); // Enviar datos al backend
      alert("Actividad actualizada correctamente"); // Mensaje de éxito
      onSaveSuccess?.(); // Actualizar lista en `ActividadesList.tsx`
      onClose(); // Cerrar modal
    } catch (error) {
      alert("Error al actualizar la actividad");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose} title={isEditMode ? "Editar Actividad" : "Detalles de la Actividad"}>
      <div>
        {isEditMode ? (
          // Modo edición: Inputs editables
          <>
            <Input label="Título" name="titulo" value={formData.titulo} onChange={handleChange} />
            <Input label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleChange} />
            <Input label="Fecha" name="fecha" value={formData.fecha} onChange={handleChange} />
            <Input label="Estado" name="estado" value={formData.estado} onChange={handleChange} />
          </>
        ) : (
          // Modo lectura: Solo muestra datos
          <>
            <p><strong>ID:</strong> {formData.id}</p>
            <p><strong>FK_CULTIVO:</strong> {formData.fk_Cultivo}</p>
            <p><strong>FK_USUARIO:</strong> {formData.fk_Usuario}</p>
            <p><strong>TÍTULO:</strong> {formData.titulo}</p>
            <p><strong>DESCRIPCIÓN:</strong> {formData.descripcion}</p>
            <p><strong>FECHA:</strong> {formData.fecha}</p>
            <p><strong>ESTADO:</strong> {formData.estado}</p>
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
