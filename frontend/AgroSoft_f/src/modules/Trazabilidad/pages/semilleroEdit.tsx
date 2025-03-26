import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Semilleros } from "@/modules/Trazabilidad/types";
import { Button, Input } from "@heroui/react";

export function SemilleroEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [semillero, setSemillero] = useState<Semilleros | null>(null);
  const [formData, setFormData] = useState<Partial<Semilleros>>({});

  useEffect(() => {
    const fetchSemillero = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/semilleros/${id}/`);
        if (!response.ok) throw new Error("Error al obtener el semillero");

        const data = await response.json();
        console.log("Datos recibidos del servidor:", data);
        setSemillero(data);
        setFormData(data);
      } catch (error) {
        console.error("Error al obtener el semillero:", error);
      }
    };

    fetchSemillero();
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
        unidades: Number(formData.unidades),
        fechaSiembra: formData.fechaSiembra ? new Date(formData.fechaSiembra).toISOString().split("T")[0] : "",
        fechaEstimada: formData.fechaEstimada ? new Date(formData.fechaEstimada).toISOString().split("T")[0] : "",
      };

      console.log("Datos enviados al servidor:", sanitizedData);

      const response = await fetch(`http://127.0.0.1:8000/api/semilleros/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar el semillero: ${errorText}`);
      }

      alert("Semillero actualizado correctamente");
      navigate("/semilleros");
    } catch (error) {
      console.error("Error en la actualización:", error);
      alert("Hubo un error al actualizar el semillero");
    }
  };

  if (!semillero) return <p>Cargando semillero...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Editar Semillero</h1>

      <label>ID:</label>
      <Input type="number" name="id" value={formData.id?.toString() ?? ""} disabled />

      <label>Especie:</label>
      <Input type="number" name="fk_especie" value={formData.fk_Especie?.toString() ?? ""} onChange={handleChange} />

      <label>Unidades:</label>
      <Input type="number" name="unidades" value={formData.unidades ?? ""} onChange={handleChange} />

      <label>Fecha de Siembra:</label>
      <Input type="date" name="fechaSiembra" value={formData.fechaSiembra ?? ""} onChange={handleChange} />

      <label>Fecha Estimada:</label>
      <Input type="date" name="fechaEstimada" value={formData.fechaEstimada ?? ""} onChange={handleChange} />

      <br />
      <Button color="success" size="md" onClick={handleSave}>Guardar Cambios</Button>
    </div>
  );
}
