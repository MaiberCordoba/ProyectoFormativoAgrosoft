import { useState, useEffect } from "react";
import ModalComponent from "@/components/Modal";
import { Ventas } from "../types";
import { Input, Button } from "@heroui/react";
import { putVentas } from "../api/ventasApi"; // Asegúrate de importar la función PUT

interface VentasModalProps {
  isOpen: boolean;
  onClose: () => void;
  ventas: Ventas | null;
  isEditMode?: boolean;
  onSaveSuccess?: () => void; // Nuevo: para actualizar la lista al guardar
}

export default function DetallesVentas({ isOpen, onClose, ventas, isEditMode = false, onSaveSuccess }: VentasModalProps) {
  const [formData, setFormData] = useState<Ventas | null>(ventas);
  const [isSaving, setIsSaving] = useState(false); // Estado para deshabilitar botón mientras guarda

  // Sincronizar estado cuando cambia la venta seleccionada
  useEffect(() => {
    setFormData(ventas);
  }, [ventas]);

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
      await putVentas(formData.id, formData); // Enviar datos al backend
      alert("Venta actualizada correctamente"); // Mensaje de éxito
      onSaveSuccess?.(); // Actualizar lista en `putDesechosList.tsx`
      onClose(); // Cerrar modal
    } catch (error) {
      alert("Error al actualizar la venta");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose} title={isEditMode ? "Editar Venta" : "Detalles de la Venta"}>
      <div>
        {isEditMode ? (
          // Modo edición: Inputs editables
          <>
            <Input label="Fk_Cosecha" name="fk_Cosecha" value={formData.fk_Cosecha} onChange={handleChange} />
            <Input label="PrecioUnitario" name="precioUnitario" value={formData.precioUnitario} onChange={handleChange} />
            <Input label="Fecha" name="fecha" value={formData.fecha} onChange={handleChange} />
          </>
        ) : (
          // Modo lectura: Solo muestra datos
          <>
            <p><strong>ID:</strong> {formData.id}</p>
            <p><strong>FK_COSECHA:</strong> {formData.fk_Cosecha}</p>
            <p><strong>PRECIO-UNITARIO:</strong> {formData.precioUnitario}</p>
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
