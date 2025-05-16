import { useState } from "react";
import { Input, Button, addToast } from "@heroui/react";

type FaseCrecimiento = {
  nombre: string;
  dias_desde_siembra: number;
  kc_valor: number;
};

export default function KcForm({ cultivoId, onSuccess }: { cultivoId: number; onSuccess: () => void }) {
  const [fases, setFases] = useState<FaseCrecimiento[]>([
    { nombre: "Inicial", dias_desde_siembra: 0, kc_valor: 0.4 },
    { nombre: "Desarrollo", dias_desde_siembra: 20, kc_valor: 0.7 },
    { nombre: "Medios", dias_desde_siembra: 40, kc_valor: 1.0 },
    { nombre: "Final", dias_desde_siembra: 60, kc_valor: 0.8 }
  ]);

  const handleChange = (index: number, field: keyof FaseCrecimiento, value: any) => {
    const newFases = [...fases];
    newFases[index] = { ...newFases[index], [field]: value };
    setFases(newFases);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/coeficientes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cultivo_id: cultivoId,
          fases
        })
      });

      if (!response.ok) throw new Error("Error al guardar coeficientes");

      addToast({
        title: "Éxito",
        description: "Coeficientes Kc guardados correctamente",
        variant: "flat",
        color: "success",
      });

      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      addToast({
        title: "Error",
        description: "No se pudieron guardar los coeficientes",
        variant: "flat",
        color: "danger",
      });
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-md p-5 rounded-2xl shadow-md space-y-4 max-w-4xl mx-auto">
      <h3 className="text-base md:text-lg font-semibold text-gray-800">Configurar coeficientes Kc para el cultivo</h3>

      <div className="space-y-5">
        {fases.map((fase, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Nombre de fase"
              value={fase.nombre}
              size="sm"
              onChange={(e) => handleChange(index, 'nombre', e.target.value)}
            />
            <Input
              label="Días desde siembra"
              type="number"
              size="sm"
              key={fase.dias_desde_siembra}
              onChange={(e) => handleChange(index, 'dias_desde_siembra', parseInt(e.target.value))}
            />
            <Input
              label="Valor Kc"
              type="number"
              step="0.01"
              size="sm"
              key={fase.kc_valor}
              onChange={(e) => handleChange(index, 'kc_valor', parseFloat(e.target.value))}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button color="primary" size="sm" onClick={handleSubmit}>
          Guardar Coeficientes
        </Button>
      </div>
    </div>
  );
}
