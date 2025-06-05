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
import { CrearEspecieModal } from "../especies/CrearEspecieModal";
import { CrearCultivoModal } from "../cultivos/CrearCultivosModal";
import { CrearSemilleroModal } from "../semillero/CrearSemilleroModal";
import { CrearEraModal } from "../eras/CrearEraModal";
import { addToast } from "@heroui/toast";

interface CrearPlantacionModalProps {
  onClose: () => void;
  onCreate: (nuevaPlantacion: Plantaciones) => void;
}

export const CrearPlantacionModal = ({ onClose, onCreate }: CrearPlantacionModalProps) => {
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
    if (!fk_Era || !fk_Cultivo || !unidades || !fechaSiembra) {
      addToast({
        title: "Campos Obligatorios",
        description: "Por favor completa todos los campos antes de guardar.",
        color: "warning",
      });
      return;
    }

    mutate(
      {
        fk_Cultivo,
        fk_Era,
        fk_semillero, // puede ser null
        unidades,
        fechaSiembra,
      },
      {
        onSuccess: (data) => {
          onCreate(data);
          onClose();
          setFk_Especie(null);
          setFk_Cultivo(null);
          setFk_semillero(null);
          setFk_Era(null);
          setUnidades(0);
          setFechaSiembra("");
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
    } else {
      setUnidades(0);
      setFechaSiembra("");
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
        {/* Especie */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Select
              label="Especie"
              placeholder="Selecciona una especie"
              size="sm"
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
              size="sm"
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

        {/* Semillero (opcional) */}
        <div className="flex items-end gap-2 mt-4">
          <div className="flex-1">
            <Select
              label="Semillero (opcional)"
              placeholder="Selecciona un semillero"
              size="sm"
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

        {/* Unidades y fecha siembra */}
        <Input
          className="mt-4"
          label="Unidades"
          type="number"
          size="sm"
          value={unidades.toString()}
          onChange={(e) => setUnidades(Number(e.target.value))}
          isReadOnly={fk_semillero !== null}
        />
        <Input
          className="mt-2"
          label="Fecha Siembra"
          type="date"
          size="sm"
          value={fechaSiembra}
          onChange={(e) => setFechaSiembra(e.target.value)}
          isReadOnly={fk_semillero !== null}
        />

        {/* Era */}
        <div className="flex items-end gap-2 mt-4">
          <div className="flex-1">
            <Select
              label="Era"
              placeholder="Selecciona una era"
              size="sm"
              selectedKeys={fk_Era ? [fk_Era.toString()] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setFk_Era(Number(selected));
              }}
            >
              {eras.map((era: Eras) => (
                <SelectItem key={era.id.toString()}>
                  {`Era ${era.tipo} en ${era.Lote?.nombre || "sin lote"}`}
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
