import { useEffect, useState } from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { Sprout, Calculator, ArrowLeft } from "lucide-react";
import { addToast } from "@heroui/toast";
import EvapotranspiracionCard from "./EvapotranspiracionCard";
import EvapotranspiracionChart from "./EvapotranspiracionChart";

type Plantacion = {
  id: number;
  fechaSiembra: string;
  fk_Cultivo: {
    id: string;
    nombre: string;
  };
  fk_Era: {
    id: string;
    fk_lote: {
      id: string;
      nombre: string;
    };
  };
};

export default function EvapotranspiracionC() {
  const [evapotranspiracion, setEvapotranspiracion] = useState<any>(null);
  const [plantaciones, setPlantaciones] = useState<Plantacion[]>([]);
  const [selectedPlantacion, setSelectedPlantacion] = useState<number | string>("");
  const [errorET, setErrorET] = useState<string | null>(null);
  const [kcValue, setKcValue] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/plantaciones/');
        const plantacionesData = await response.json();
        setPlantaciones(plantacionesData);
      } catch (error) {
        console.error("Error cargando datos:", error);
        addToast({
          title: "Error",
          description: "Error al cargar los datos necesarios",
          variant: "flat",
          color: "danger",
        });
      }
    };
    fetchData();
  }, []);

  const calcularEvapotranspiracion = async () => {
    if (!selectedPlantacion) {
      setErrorET("Selecciona una plantación");
      addToast({
        title: "Error",
        description: "Debes seleccionar una plantación para calcular la evapotranspiración.",
        variant: "flat",
        color: "danger",
      });
      return;
    }

    try {
      const params = new URLSearchParams({
        plantacion_id: String(selectedPlantacion)
      });
      
      if (kcValue) params.append('kc', kcValue);

      const response = await fetch(`http://localhost:8000/api/evapotranspiracion/?${params}`);
      
      if (!response.ok) throw new Error("Error al calcular evapotranspiración");
      
      const data = await response.json();
      
      setEvapotranspiracion({
        ...data,
        fecha: data.fecha || new Date().toISOString()
      });
      
      setErrorET(null);
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      setErrorET(message);
      addToast({
        title: "Error",
        description: `Error al calcular: ${message}`,
        variant: "flat",
        color: "danger",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
        {!evapotranspiracion && (
            <div className="bg-white/800 rounded-xl shadow-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center justify-center gap-2 text-center">
              <Calculator className="text-green-600 w-6 h-6 -mr-1" style={{ color: "#2ECC71" }}/>
              Calculadora de Evapotranspiración
            </h2>
            
            <div className="flex flex-col gap-4">
              <Select
              label="Seleccionar Plantación"
              placeholder="Selecciona una plantación"
              selectedKeys={selectedPlantacion ? [String(selectedPlantacion)] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedPlantacion(selected);
                setErrorET(null);
              }}
              className={`w-full ${errorET ? "border border-red-500" : ""}`}
              errorMessage={errorET}
              color={errorET ? "danger" : undefined}
              >
              {plantaciones.map(plantacion => (
                <SelectItem 
                key={String(plantacion.id)} 
                >
                {`Cultivo ${plantacion.fk_Cultivo || 'N/D'}, Lote ${plantacion.fk_Era|| 'N/D'} (${new Date(plantacion.fechaSiembra).toLocaleDateString()})`}
                </SelectItem>
              ))}
              </Select>

              <Input
                label="Coeficiente de Cultivo (Kc - Opcional)"
                placeholder="Dejar vacío para cálculo automático"
                type="number"
                min="0"
                step="0.01"
                value={kcValue}
                onChange={(e) => setKcValue(e.target.value)}
                description="Valor numérico que representa el coeficiente del cultivo"
                className="w-full"
              />

              <div className="flex justify-end gap-4">
                <Button 
                  color="success" 
                  onClick={calcularEvapotranspiracion}
                  disabled={!selectedPlantacion}
                  className="w-full sm:w-auto"
                >
                  Calcular
                </Button>
              </div>
            </div>
          </div>
        )}

        {evapotranspiracion && (
          <div className="bg-blue-50 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setEvapotranspiracion(null)}
                className="p-0 m-0 bg-transparent border-none outline-none hover:bg-transparent focus:ring-0"
                style={{ lineHeight: 0 }}
                aria-label="Volver"
                type="button"
              >
                <ArrowLeft className="h-6 w-6 text-blue-700" strokeWidth={2} style={{ color: "#2ECC71" }} />
              </button>
                <h2 className="text-2xl font-bold text-blue-800 text-center">
                <strong>Evapotranspiración (ETc)</strong>
                </h2>
              <div className="w-10"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
              <div className="bg-white/80 rounded-2xl shadow-md p-6 w-full max-w-md flex flex-col justify-between">
                <h3 className="text-base font-semibold text-black mb-3 flex items-center gap-2">
                  <Sprout className="text-green-700" size={20} style={{ color: "#2ECC71" }} />
                    Detalles de la Plantación
                </h3>
                <br/>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-black">Cultivo:</span>
                    <span className="text-black">{evapotranspiracion.detalles.cultivo}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-black">Lote:</span>
                    <span className="text-black">{evapotranspiracion.detalles.lote}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-black">Fecha Siembra:</span>
                    <span className="text-black">{new Date(evapotranspiracion.detalles.fecha_siembra).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-black">Días desde siembra:</span>
                    <span className="text-black">{evapotranspiracion.detalles.dias_siembra}</span>
                  </div>
                </div>
              </div>

                <EvapotranspiracionCard
                  etReal={evapotranspiracion.evapotranspiracion_mm_dia}
                  kc={evapotranspiracion.kc}
                  detalles={{
                    temperatura: evapotranspiracion.sensor_data.temperatura,
                    viento: evapotranspiracion.sensor_data.viento,
                    iluminacion: evapotranspiracion.sensor_data.iluminacion,
                    humedad_ambiente: evapotranspiracion.sensor_data.humedad
                  }}
                />
              </div>
              <div className="p-8 rounded-xl">
                <br/>
                <br/>
                <EvapotranspiracionChart 
                  plantacionId={selectedPlantacion.toString()}
                  nuevoDato={{
                    fecha: new Date().toISOString(),
                    et_mm_dia: evapotranspiracion.evapotranspiracion_mm_dia,
                    kc: evapotranspiracion.kc,
                    temperatura: evapotranspiracion.sensor_data.temperatura,
                    humedad: evapotranspiracion.sensor_data.humedad,
                    dias_desde_siembra: evapotranspiracion.detalles.dias_desde_siembra
                  }}
                  showAdditionalInfo={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}