import { useState } from "react";
import { usePostCultivos } from "../../hooks/cultivos/usePostCultivos";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem, Switch, Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { CrearEspecieModal } from "../especies/CrearEspecieModal";

interface CrearCultivoModalProps {
  onClose: () => void;
}

export const CrearCultivoModal = ({ onClose }: CrearCultivoModalProps) => {
  const [nombre, setNombre] = useState<string>("");
  const [activo, setActivo] = useState<boolean>(true);
  const [fk_Especie, setFk_Especie] = useState<{ nombre: string } | null>(null);

  const [mostrarModalEspecie, setMostrarModalEspecie] = useState(false);

  const { mutate, isPending } = usePostCultivos();
  const {
    data: especies,
    isLoading: isLoadingEspecies,
    refetch: refetchEspecies,
  } = useGetEspecies();

  const handleSubmit = () => {
    if (!nombre || !fk_Especie?.nombre) {
      console.log("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const especie = especies?.find((e) => e.nombre === fk_Especie.nombre);
    if (!especie) {
      console.log("Especie no encontrada.");
      return;
    }

    mutate(
      {
        nombre,
        activo,
        fk_Especie: especie.id, 
      },
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setFk_Especie(null);
          setActivo(true);
        },
      }
    );
  };

  const handleEspecieCreada = (nuevaEspecie: { id: number; nombre: string }) => {
    refetchEspecies();
    setFk_Especie({ nombre: nuevaEspecie.nombre });
    setMostrarModalEspecie(false);
  };

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Cultivo"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            variant: "light",
            onClick: handleSubmit,
          },
        ]}
      >
        <Input
          label="Nombre del Cultivo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <div className="flex items-center gap-2 mt-4">
          <div className="flex-1">
            {isLoadingEspecies ? (
              <p>Cargando especies...</p>
            ) : (
              <Select
                label="Especie"
                placeholder="Selecciona una especie"
                selectedKeys={fk_Especie ? [fk_Especie.nombre] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  if (selectedKey) {
                    setFk_Especie({ nombre: selectedKey.toString() });
                  }
                }}
              >
                {(especies || []).map((especie) => (
                  <SelectItem key={especie.nombre}>{especie.nombre}</SelectItem>
                ))}
              </Select>
            )}
          </div>
          <Button
            onPress={() => setMostrarModalEspecie(true)}
            color="success"
            radius="full"
            size="sm"
            title="Agregar nueva especie"
          >
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <Switch
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            color="success"
          >
            {activo ? "Activo" : "Inactivo"}
          </Switch>
        </div>
      </ModalComponent>

      {mostrarModalEspecie && (
        <CrearEspecieModal
          onClose={() => setMostrarModalEspecie(false)}
          onCreate={handleEspecieCreada}
        />
      )}
    </>
  );
};
