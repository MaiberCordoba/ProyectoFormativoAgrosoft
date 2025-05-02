import { useState } from "react";
import { usePostCultivos } from "../../hooks/cultivos/usePostCultivos";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem, Switch, Button } from "@heroui/react";
import { useGetSemilleros } from "../../hooks/semilleros/useGetSemilleros";
import { Plus } from "lucide-react";
import { CrearEspecieModal } from "../especies/CrearEspecieModal";
import { CrearSemilleroModal } from "../semillero/CrearSemilleroModal";

interface CrearCultivoModalProps {
  onClose: () => void;
}

export const CrearCultivoModal = ({ onClose }: CrearCultivoModalProps) => {
  const [unidades, setUnidades] = useState<string>("");
  const [fechaSiembra, setFechaSiembra] = useState<string>("");
  const [fk_Especie, setFk_Especie] = useState<number | null>(null);
  const [fk_semillero, setFk_Semillero] = useState<number | null>(null);
  const [activo, setActivo] = useState<boolean>(true);

  const [mostrarModalEspecie, setMostrarModalEspecie] = useState(false);
  const [mostrarModalSemillero, setMostrarModalSemillero] = useState(false);

  const { mutate, isPending } = usePostCultivos();
  const {
    data: especies,
    isLoading: isLoadingEspecies,
    refetch: refetchEspecies,
  } = useGetEspecies();
  const {
    data: semilleros,
    isLoading: isLoadingSemilleros,
    refetch: refetchSemilleros,
  } = useGetSemilleros();

  const handleSubmit = () => {
    const unidadesNum = parseInt(unidades, 10);
    if (!unidadesNum || !fechaSiembra || !fk_Especie || !fk_semillero) {
      console.log("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const payload = {
      unidades: unidadesNum,
      fechaSiembra,
      fk_Especie,
      fk_semillero,
      activo,
    };

    mutate(payload, {
      onSuccess: () => {
        onClose();
        setUnidades("");
        setFechaSiembra("");
        setFk_Especie(null);
        setFk_Semillero(null);
        setActivo(true);
      },
    });
  };

  const handleEspecieCreada = (nuevaEspecie: { id: number }) => {
    refetchEspecies();
    setFk_Especie(nuevaEspecie.id);
    setMostrarModalEspecie(false);
  };

  const handleSemilleroCreado = (nuevoSemillero: { id: number }) => {
    refetchSemilleros();
    setFk_Semillero(nuevoSemillero.id);
    setMostrarModalSemillero(false);
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
          label="Unidades"
          type="number"
          value={unidades}
          onChange={(e) => setUnidades(e.target.value)}
          required
        />

        <Input
          label="Fecha de Siembra"
          type="date"
          value={fechaSiembra}
          onChange={(e) => setFechaSiembra(e.target.value)}
          required
        />

        {/* Select Especie + botón */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            {isLoadingEspecies ? (
              <p>Cargando especies...</p>
            ) : (
              <Select
                label="Especie"
                placeholder="Selecciona una especie"
                selectedKeys={fk_Especie ? [fk_Especie.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_Especie(Number(selectedKey));
                }}
              >
                {(especies || []).map((especie) => (
                  <SelectItem key={especie.id.toString()}>
                    {especie.nombre}
                  </SelectItem>
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

        {/* Select Semillero + botón */}
        <div className="flex items-center gap-2 mt-4">
          <div className="flex-1">
            {isLoadingSemilleros ? (
              <p>Cargando semilleros...</p>
            ) : (
              <Select
                label="Semillero"
                placeholder="Selecciona un semillero"
                selectedKeys={fk_semillero ? [fk_semillero.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_Semillero(Number(selectedKey));
                }}
              >
                {(semilleros || []).map((semillero) => (
                  <SelectItem key={semillero.id.toString()}>
                    {semillero.id}
                  </SelectItem>
                ))}
              </Select>
            )}
          </div>
          <Button
            onPress={() => setMostrarModalSemillero(true)}
            color="success"
            radius="full"
            size="sm"
            title="Agregar nuevo semillero"
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

      {mostrarModalSemillero && (
        <CrearSemilleroModal
          onClose={() => setMostrarModalSemillero(false)}
          onCreate={handleSemilleroCreado}
        />
      )}
    </>
  );
};
