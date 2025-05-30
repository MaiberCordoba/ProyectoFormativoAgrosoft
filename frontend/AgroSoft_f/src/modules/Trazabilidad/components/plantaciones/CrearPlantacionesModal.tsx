import { useEffect, useState } from "react";
import { usePostPlantaciones } from "../../hooks/plantaciones/usePostPlantaciones";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";
import { useGetEras } from "../../hooks/eras/useGetEras";
import { useGetCultivos } from "../../hooks/cultivos/useGetCultivos";
import { useGetSemilleros } from "../../hooks/semilleros/useGetSemilleros";
import ModalComponent from "@/components/Modal";
import { Select, SelectItem, Input, Button } from "@heroui/react";
import { Plus } from "lucide-react";
import type { Especies, Cultivo, Semillero, Eras, Plantaciones } from "../../types";

// Importa los modales
import { CrearEspecieModal } from "../especies/CrearEspecieModal";
import { CrearCultivoModal } from "../cultivos/CrearCultivosModal";
import { CrearSemilleroModal } from "../semillero/CrearSemilleroModal";
import { CrearEraModal } from "../eras/CrearEraModal";

interface CrearPlantacionModalProps {
  onClose: () => void;
  onCreate: (nuevaPlantacion: Plantaciones) => void;
}

export const CrearPlantacionModal = ({ onClose }: CrearPlantacionModalProps) => {
  const [fk_Especie, setFk_Especie] = useState<number | null>(null);
  const [fk_Cultivo, setFk_Cultivo] = useState<number | null>(null);
  const [fk_semillero, setFk_semillero] = useState<number | null>(null);
  const [fk_Era, setFk_Era] = useState<number | null>(null);
  const [unidades, setUnidades] = useState<number>(0);
  const [fechaSiembra, setFechaSiembra] = useState<string>("");

  const [modalEspecieVisible, setModalEspecieVisible] = useState(false);
  const [modalCultivoVisible, setModalCultivoVisible] = useState(false);
  const [modalSemilleroVisible, setModalSemilleroVisible] = useState(false);
  const [modalEraVisible, setModalEraVisible] = useState(false);

  const { mutate, isPending } = usePostPlantaciones();
  const { data: especies = [], refetch: refetchEspecies } = useGetEspecies();
  const { data: cultivos = [], refetch: refetchCultivos } = useGetCultivos();
  const { data: semilleros = [], refetch: refetchSemilleros } = useGetSemilleros();
  const { data: eras = [], refetch: refetchEras } = useGetEras();

  const cultivosFiltrados = cultivos.filter((c: Cultivo) => c.fk_Especie === fk_Especie);
  const semillerosFiltrados = semilleros.filter((s: Semillero) => s.fk_Cultivo === fk_Cultivo);

  const handleSubmit = () => {
    if (!fk_Era || !fk_Cultivo || !fk_semillero || !unidades || !fechaSiembra) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      {
        fk_Cultivo,
        fk_Era,
        fk_semillero,
        unidades,
        fechaSiembra,
      },
      {
        onSuccess: () => {
          onClose();
          setFk_Especie(null);
          setFk_Cultivo(null);
          setFk_semillero(null);
          setFk_Era(null);
        },
      }
    );
  };

  useEffect(() => {
    if (fk_semillero != null) {
      const semilleroSeleccionado = semilleros.find((s) => s.id === fk_semillero);
      if (semilleroSeleccionado) {
        setUnidades(semilleroSeleccionado.unidades);
        setFechaSiembra(semilleroSeleccionado.fechasiembra);
      }
    }
  }, [fk_semillero]);

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Plantación"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            variant: "light",
            onClick: handleSubmit,
          },
        ]}
      >
        {/* Select de Especie */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Select
              label="Especie"
              placeholder="Selecciona una especie"
              selectedKeys={fk_Especie ? [fk_Especie.toString()] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setFk_Especie(Number(selected));
                setFk_Cultivo(null);
                setFk_semillero(null);
              }}
            >
              {especies.map((especie: Especies) => (
                <SelectItem key={especie.id.toString()}>{especie.nombre}</SelectItem>
              ))}
            </Select>
          </div>
          <Button onPress={() => setModalEspecieVisible(true)} color="success" radius="full" size="sm">
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Cultivo */}
        <div className="flex items-end gap-2 mt-4">
          <div className="flex-1">
            <Select
              label="Cultivo"
              placeholder="Selecciona un cultivo"
              selectedKeys={fk_Cultivo ? [fk_Cultivo.toString()] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setFk_Cultivo(Number(selected));
                setFk_semillero(null);
              }}
              isDisabled={!fk_Especie}
            >
              {cultivosFiltrados.map((cultivo: Cultivo) => (
                <SelectItem key={cultivo.id.toString()}>{cultivo.nombre}</SelectItem>
              ))}
            </Select>
          </div>
          <Button onPress={() => setModalCultivoVisible(true)} color="success" radius="full" size="sm">
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Semillero */}
        <div className="flex items-end gap-2 mt-4">
          <div className="flex-1">
            <Select
              label="Semillero"
              placeholder="Selecciona un semillero"
              selectedKeys={fk_semillero ? [fk_semillero.toString()] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setFk_semillero(Number(selected));
              }}
              isDisabled={!fk_Cultivo}
            >
              {semillerosFiltrados.map((semillero: Semillero) => (
                <SelectItem key={semillero.id.toString()}>
                  {`Semillero #${semillero.id} - ${semillero.unidades} unidades`}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Button onPress={() => setModalSemilleroVisible(true)} color="success" radius="full" size="sm">
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Campos automáticos */}
        <Input className="mt-4" label="Unidades" value={unidades.toString()} isReadOnly />
        <Input className="mt-2" label="Fecha Siembra" value={fechaSiembra} isReadOnly />

        {/* Era */}
        <div className="flex items-end gap-2 mt-4">
          <div className="flex-1">
            <Select
              label="Era"
              placeholder="Selecciona una era"
              selectedKeys={fk_Era ? [fk_Era.toString()] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setFk_Era(Number(selected));
              }}
            >
              {eras.map((era: Eras) => (
                <SelectItem key={era.id.toString()}>
                  {`Era ${era.tipo} en ${era.fk_lote?.nombre}`}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Button onPress={() => setModalEraVisible(true)} color="success" radius="full" size="sm">
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </div>
      </ModalComponent>

      {/* Modales secundarios */}
      {modalEspecieVisible && (
        <CrearEspecieModal
          onClose={() => setModalEspecieVisible(false)}
          onCreate={(nuevaEspecie) => {
            refetchEspecies();
            setFk_Especie(nuevaEspecie.id);
            setModalEspecieVisible(false);
          }}
        />
      )}

      {modalCultivoVisible && (
        <CrearCultivoModal
          onClose={() => setModalCultivoVisible(false)}
          onCreate={(nuevoCultivo) => {
            refetchCultivos();
            setFk_Cultivo(nuevoCultivo.id);
            setModalCultivoVisible(false);
          }}
        />
      )}

      {modalSemilleroVisible && (
        <CrearSemilleroModal
          onClose={() => setModalSemilleroVisible(false)}
          onCreate={(nuevoSemillero) => {
            refetchSemilleros();
            setFk_semillero(nuevoSemillero.id);
            setModalSemilleroVisible(false);
          }}
        />
      )}

      {modalEraVisible && (
        <CrearEraModal
          onClose={() => setModalEraVisible(false)}
          onCreate={(nuevaEra) => {
            refetchEras();
            setFk_Era(nuevaEra.id);
            setModalEraVisible(false);
          }}
        />
      )}
    </>
  );
};
