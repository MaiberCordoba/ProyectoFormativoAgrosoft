import { useEffect, useState } from "react";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import ModalComponent from "@/components/Modal";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { useGetAfecciones } from "../../hooks/afecciones/useGetAfecciones";
import { EstadoAfeccion, AfeccionesCultivo } from "../../types";
import { usePostAfeccionCultivo } from "../../hooks/afeccionescultivo/usePostAfeccionescultivo";
import { Plus } from "lucide-react";

import { CrearAfeccionModal } from "../afecciones/CrearAfeccionModal";
import { CrearPlantacionModal } from "@/modules/Trazabilidad/components/plantaciones/CrearPlantacionesModal";

interface CrearAfeccionCultivoModalProps {
  onClose: () => void;
}

export const CrearAfeccionCultivoModal = ({ onClose }: CrearAfeccionCultivoModalProps) => {
  const [fk_Plantacion, setFk_Plantacion] = useState<number | null>(null);
  const [fk_Plaga, setFk_Plaga] = useState<number | null>(null);
  const [fechaEncuentro, setFechaEncuentro] = useState<string>("");
  const [estado, setEstado] = useState<keyof typeof EstadoAfeccion>("ST");

  const { data: plantacionesData, refetch: refetchPlantaciones } = useGetPlantaciones();
  const { data: tiposPlagaData, refetch: refetchAfecciones } = useGetAfecciones();
  const { mutate, isPending } = usePostAfeccionCultivo();

  const [plantaciones, setPlantaciones] = useState<any[]>([]);
  const [tiposPlaga, setTiposPlaga] = useState<any[]>([]);

  const [mostrarModalAfeccion, setMostrarModalAfeccion] = useState(false);
  const [mostrarModalPlantacion, setMostrarModalPlantacion] = useState(false);

  useEffect(() => {
    if (plantacionesData) setPlantaciones(plantacionesData);
  }, [plantacionesData]);

  useEffect(() => {
    if (tiposPlagaData) setTiposPlaga(tiposPlagaData);
  }, [tiposPlagaData]);

  const handleSubmit = () => {
    if (!fk_Plantacion || !fk_Plaga || !estado || !fechaEncuentro) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    const data: AfeccionesCultivo = {
      fk_Plantacion,
      fk_Plaga,
      estado,
      fechaEncuentro,
      id: 0,
    };

    mutate(data, {
      onSuccess: () => {
        onClose();
        setFk_Plantacion(null);
        setFk_Plaga(null);
        setEstado("ST");
        setFechaEncuentro("");
      },
    });
  };

  const handleNuevaAfeccion = async () => {
    await refetchAfecciones();
    const nuevas = await useGetAfecciones().data;
    if (nuevas && nuevas.length > 0) {
      const nueva = nuevas[nuevas.length - 1];
      setTiposPlaga(nuevas);
      setFk_Plaga(nueva.id);
    }
  };

  const handleNuevaPlantacion = async () => {
    await refetchPlantaciones();
    const nuevas = await useGetPlantaciones().data;
    if (nuevas && nuevas.length > 0) {
      const nueva = nuevas[nuevas.length - 1];
      setPlantaciones(nuevas);
      setFk_Plantacion(nueva.id);
    }
  };

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Afección Cultivo"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            variant: "light",
            onClick: handleSubmit,
          },
        ]}
      >
        {/* Selector de Plantación con botón para crear */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1">
            <Select
              label="Plantación"
              placeholder="Selecciona una plantación"
              selectedKeys={fk_Plantacion ? [fk_Plantacion.toString()] : []}
              onSelectionChange={(keys) => setFk_Plantacion(Number(Array.from(keys)[0]))}
            >
              {plantaciones.map((plantacion) => (
                <SelectItem key={plantacion.id.toString()}>{plantacion.id}</SelectItem>
              ))}
            </Select>
          </div>
          <Button onPress={() => setMostrarModalPlantacion(true)} color="success" radius="full" size="sm">
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Selector de Plaga/Afección con botón para crear */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1">
            <Select
              label="Afectación"
              placeholder="Selecciona una Afectación"
              selectedKeys={fk_Plaga ? [fk_Plaga.toString()] : []}
              onSelectionChange={(keys) => setFk_Plaga(Number(Array.from(keys)[0]))}
            >
              {tiposPlaga.map((tipo) => (
                <SelectItem key={tipo.id.toString()}>{tipo.nombre}</SelectItem>
              ))}
            </Select>
          </div>
          <Button onPress={() => setMostrarModalAfeccion(true)} color="success" radius="full" size="sm">
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </div>

        <Select
          label="Estado de la Afección"
          selectedKeys={[estado]}
          onSelectionChange={(keys) => setEstado(Array.from(keys)[0] as keyof typeof EstadoAfeccion)}
        >
          {Object.entries(EstadoAfeccion).map(([key, label]) => (
            <SelectItem key={key}>{label}</SelectItem>
          ))}
        </Select>

        <Input
          label="Fecha del Encuentro"
          type="date"
          value={fechaEncuentro}
          onChange={(e) => setFechaEncuentro(e.target.value)}
          required
        />
      </ModalComponent>

      {/* Modal crear nueva afectación */}
      {mostrarModalAfeccion && (
        <CrearAfeccionModal
          onClose={() => setMostrarModalAfeccion(false)}
          onCreate={handleNuevaAfeccion}
        />
      )}

      {/* Modal crear nueva plantación */}
      {mostrarModalPlantacion && (
        <CrearPlantacionModal
          onClose={() => setMostrarModalPlantacion(false)}
          onCreate={handleNuevaPlantacion}
        />
      )}
    </>
  );
};
