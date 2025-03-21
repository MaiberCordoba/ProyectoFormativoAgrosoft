import { useParams, useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
import { Especies } from "@/modules/Trazabilidad/types";
import { Button, Input } from "@heroui/react";

export function EspecieEdit() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [especie, setEspecie] = useState<Especies | null>(null);
  const [formData, setFormData] = useState<Partial<Especies>>({});

  useEffect(() => {
    const fetchEspecie = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/especies/${id}/`);
        if (!response.ok) throw new Error("Error al obtener la especie");

        const data = await response.json();
        console.log("Datos recibidos del servidor:", data);
        setEspecie(data);
        setFormData(data);
      } catch (error) {
        console.error("Error al obtener la especie:", error);
      }
    };

    fetchEspecie();
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
        fk_TipoEspecie: Number(formData.fk_TiposEspecie),
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        img: formData.img,
        tiempoCrecimiento: Number(formData.tiempoCrecimiento),
      };

      console.log("Datos enviados al servidor:", sanitizedData);

      const response = await fetch(`http://127.0.0.1:8000/api/especies/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar la especie: ${errorText}`);
      }

      alert("Especie actualizada correctamente");
      navigate("/especies"); 
    } catch (error) {
      console.error("Error en la actualización:", error);
      alert("Hubo un error al actualizar la especie");
    }
  };

  if (!especie) return <p>Cargando especie...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Editar Especie</h1>

      <label>ID:</label>
      <Input type="number" name="id" value={formData.id?.toString() ?? ""} disabled />

      <label>Tipo de Especie:</label>
      <Input type="number" name="fk_TipoEspecie" value={formData.fk_TiposEspecie?.toString() ?? ""} onChange={handleChange} />

      <label>Nombre:</label>
      <Input type="text" name="nombre" value={formData.nombre ?? ""} onChange={handleChange} />

      <label>Descripción:</label>
      <Input type="text" name="descripcion" value={formData.descripcion ?? ""} onChange={handleChange} />

      <label>Imagen (URL):</label>
      <Input type="text" name="img" value={formData.img ?? ""} onChange={handleChange} />

      <label>Tiempo de Crecimiento (días):</label>
      <Input type="number" name="tiempoCrecimiento" value={formData.tiempoCrecimiento?.toString() ?? ""} onChange={handleChange} />

      <br />
      <Button color="success" size="md" onClick={handleSave}>Guardar Cambios</Button>
    </div>
  );
}
