import { useParams, useNavigate } from "react-router-dom"; // Hook para navegación
import { useEffect, useState } from "react";
import { Cultivos } from "@/modules/Trazabilidad/types";
import { Button, Input } from "@heroui/react";

export function CultivoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cultivo, setCultivo] = useState<Cultivos | null>(null);
  const [formData, setFormData] = useState<Partial<Cultivos>>({});

  useEffect(() => {
    const fetchCultivo = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/cultivos/${id}/`);
        if (!response.ok) throw new Error("Error al obtener el cultivo");

        const data = await response.json();
        console.log("Datos recibidos del servidor:", data);
        setCultivo(data);
        setFormData(data);
      } catch (error) {
        console.error("Error al obtener el cultivo:", error);
      }
    };

    fetchCultivo();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) || "" : value,
    }));
  };

  const handleSave = async () => {
    try {
      const sanitizedData = {
        fk_especie: Number(formData.fk_Especie),
        nombre: formData.nombre,
        unidades: Number(formData.unidades),
        activo: formData.activo,
        fechaSiembra: formData.fechaSiembra 
          ? new Date(formData.fechaSiembra).toISOString().split("T")[0] 
          : "",
      };

      console.log("Datos enviados al servidor:", sanitizedData);

      const response = await fetch(`http://127.0.0.1:8000/api/cultivos/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar el cultivo: ${errorText}`);
      }

      alert("Cultivo actualizado correctamente");
      navigate("/cultivos"); // Redirige a la lista de cultivos
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Hubo un error al actualizar el cultivo: ${error.message}`);
        alert(`Hubo un error al actualizar el cultivo: ${error.message}`);
      } else {
        console.error("Error desconocido:", error);
        alert("Hubo un error inesperado.");
      }
    }
  };

  if (!cultivo) return <p>Cargando cultivo...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Editar Cultivo</h1>

      <label>ID:</label>
      <Input type="number" name="id" value={formData.id?.toString() ?? ""} disabled />

      <label>Especie:</label>
      <Input type="number" name="fk_especie" value={formData.fk_Especie?.toString() ?? ""} onChange={handleChange} />

      <label>Nombre:</label>
      <Input type="text" name="nombre" value={formData.nombre ?? ""} onChange={handleChange} />

      <label>Unidades:</label>
      <Input type="number" name="unidades" value={formData.unidades?.toString() ?? ""} onChange={handleChange} />

      <label>Activo:</label>
      <Input type="checkbox" name="activo" checked={formData.activo ?? false} onChange={(e) => setFormData({ ...formData, activo: e.target.checked })} />

      <label>Fecha de Siembra:</label>
      <Input type="date" name="fechasiembra" value={formData.fechaSiembra ?? ""} onChange={handleChange} />

      <br />
      <Button color="success" size="md" onClick={handleSave}>Guardar Cambios</Button>
    </div>
  );
}
