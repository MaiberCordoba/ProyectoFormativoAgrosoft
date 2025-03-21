import { useParams, useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
import { Lote } from "@/modules/Trazabilidad/types";
import { Button, Input } from "@heroui/react";

export function LoteEdit() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [lote, setLote] = useState<Lote | null>(null);
  const [formData, setFormData] = useState<Partial<Lote>>({});

  useEffect(() => {
    const fetchLote = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/lote/${id}/`);
        if (!response.ok) throw new Error("Error al obtener el lote");

        const data = await response.json();
        console.log("Datos recibidos del servidor:", data);
        setLote(data);
        setFormData(data);
      } catch (error) {
        console.error("Error al obtener el lote:", error);
      }
    };

    fetchLote();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) || "" : type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      const sanitizedData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        tamX: Number(formData.tamX),
        tamY: Number(formData.tamY),
        estado: formData.estado, 
        posX: Number(formData.posX),
        posY: Number(formData.posY),
      };

      console.log("Datos enviados al servidor:", sanitizedData);

      const response = await fetch(`http://127.0.0.1:8000/api/lote/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar el lote: ${errorText}`);
      }

      alert("Lote actualizado correctamente");
      navigate("/lotes"); 
    } catch (error) {
      console.error("Error en la actualización:", error);
      alert("Hubo un error al actualizar el lote");
    }
  };

  if (!lote) return <p>Cargando lote...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Editar Lote</h1>

      <label>ID:</label>
      <Input type="number" name="id" value={formData.id?.toString() ?? ""} disabled />

      <label>Nombre:</label>
      <Input type="text" name="nombre" value={formData.nombre ?? ""} onChange={handleChange} />

      <label>Descripción:</label>
      <Input type="text" name="descripcion" value={formData.descripcion ?? ""} onChange={handleChange} />

      <label>Tamaño X:</label>
      <Input type="number" name="tamX" value={formData.tamX?.toString() ?? ""} onChange={handleChange} />

      <label>Tamaño Y:</label>
      <Input type="number" name="tamY" value={formData.tamY?.toString() ?? ""} onChange={handleChange} />

      <label>Estado:</label>
      <Input type="checkbox" name="estado" checked={formData.estado ?? false} onChange={handleChange} />

      <label>Posición X:</label>
      <Input type="number" name="posX" step="0.01" value={formData.posX?.toString() ?? ""} onChange={handleChange} />

      <label>Posición Y:</label>
      <Input type="number" name="posY" step="0.01" value={formData.posY?.toString() ?? ""} onChange={handleChange} />

      <br />
      <Button color="success" size="md" onClick={handleSave}>Guardar Cambios</Button>
    </div>
  );
}
