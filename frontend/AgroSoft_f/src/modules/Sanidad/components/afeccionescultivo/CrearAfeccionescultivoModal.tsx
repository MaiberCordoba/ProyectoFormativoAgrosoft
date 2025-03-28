import { useState } from "react";
import { Input, Select, SelectItem, toast } from "@heroui/react";
import ModalComponent from "@/components/Modal";
//import { useGetTipoAfecciones } from "../../hooks/tiposAfecciones/useGetTipoAfecciones";
import { useGetAfecciones } from "../../hooks/afecciones/useGetAfecciones";
import { EstadoAfeccion } from "../../types"; // Asegúrate de importar el enum EstadoAfeccion
import { usePostAfeccionCultivo } from "../../hooks/afeccionescultivo/usePostAfeccionescultivo"; // Hook para manejar la creación de AfecciónCultivo

interface CrearAfeccionCultivoModalProps {
  onClose: () => void;
}

export const CrearAfeccionCultivoModal = ({ onClose }: CrearAfeccionCultivoModalProps) => {
  const [fk_Plantacion, setFk_Plantacion] = useState<number | null>(null); // Relación con la plantación
  const [fk_Plaga, setFk_Plaga] = useState<number | null>(null); // Relación con la plaga
  const [fechaEncuentro, setFechaEncuentro] = useState<string>(""); // Fecha del encuentro
  const [estado, setEstado] = useState<EstadoAfeccion | "">(EstadoAfeccion.Detectado); // Estado de la afección

  const { data: tiposPlaga, isLoading: isLoadingTiposPlaga } = useGetAfecciones(); // Obtener los tipos de plaga
  const { mutate, isPending } = usePostAfeccionCultivo(); // Usar el hook adecuado para crear afección en cultivo

  const handleSubmit = () => {
    if (!fk_Plantacion || !fk_Plaga || !estado || !fechaEncuentro) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { fk_Plantacion, fk_Plaga, estado, fechaEncuentro }, // Enviar los datos al backend
      {
        onSuccess: () => {
          onClose();
          setFk_Plantacion(null); // Limpiar la relación con plantación
          setFk_Plaga(null); // Limpiar la relación con plaga
          setEstado(EstadoAfeccion.Detectado); // Resetear el estado
          setFechaEncuentro(""); // Limpiar la fecha
        },
      }
    );
  };

  return (
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
      {/* Selector de Plantación 
      <Input
        label="Plantación"
        type="number"
        value={fk_Plantacion || ""}
        onChange={(e) => setFk_Plantacion(Number(e.target.value))}
        required
      />
      */}

      {/* Selector de Plaga */}
      {isLoadingTiposPlaga ? (
        <p>Cargando tipos de plaga...</p>
      ) : (
        <Select
          label="Tipo de Plaga"
          placeholder="Selecciona un tipo de plaga"
          selectedKeys={fk_Plaga ? [fk_Plaga.toString()] : []} // HeroUI espera un array de strings
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0]; // HeroUI devuelve un Set
            setFk_Plaga(Number(selectedKey)); // Actualiza el estado con el nuevo ID
          }}
        >
          {(tiposPlaga || []).map((tipo) => (
            <SelectItem key={tipo.id.toString()}>
              {tipo.nombre}
            </SelectItem>
          ))}
        </Select>
      )}

      {/* Selector de estado de la afección */}
      <Select
        label="Estado de la Afección"
        placeholder="Selecciona el estado"
        selectedKeys={estado ? [estado] : []}
        onSelectionChange={(keys) => {
          const selectedState = Array.from(keys)[0];
          setEstado(selectedState as EstadoAfeccion); // Actualiza el estado de la afección
        }}
      >
        {Object.values(EstadoAfeccion).map((estado) => (
          <SelectItem key={estado}>{estado}</SelectItem>
        ))}
      </Select>

      {/* Campo de fecha de encuentro */}
      <Input
        label="Fecha del Encuentro"
        type="date"
        value={fechaEncuentro}
        onChange={(e) => setFechaEncuentro(e.target.value)}
        required
      />
    </ModalComponent>
  );
};
