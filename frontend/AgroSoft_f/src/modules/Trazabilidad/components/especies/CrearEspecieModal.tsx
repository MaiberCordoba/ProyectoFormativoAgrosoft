import { useState } from "react";
import { usePostEspecies } from "../../hooks/especies/usePostEspecies";
import { useGetTiposEspecie } from "../../hooks/tiposEspecie/useGetTiposEpecie";
import { useGetVariedad } from "../../hooks/variedad/useGetVariedad";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { CrearTiposEspecieModal } from "../tiposEspecie/CrearTiposEspecieModal";
import { CrearVariedadModal } from "../variedad/CrearVariedadModal";

interface CrearEspecieModalProps {
  onClose: () => void;
  onCreate: (nuevaEspecie: { id: number }) => void;
}

const opcionesCrecimiento = [
  { value: "perennes", label: "Perennes" },
  { value: "semiperennes", label: "Semiperennes" },
  { value: "transitorio", label: "Transitorio" },
];

export const CrearEspecieModal = ({ onClose, onCreate }: CrearEspecieModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [img, setImg] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [tiempocrecimiento, setTiempocrecimiento] = useState<string | "">("");
  const [fk_tipoespecie, setFk_tipoespecie] = useState<number | null>(null);
  const [fk_variedad, setFk_variedad] = useState<number | null>(null);

  const [modalTipoEspecieVisible, setModalTipoEspecieVisible] = useState(false);
  const [modalVariedadVisible, setModalVariedadVisible] = useState(false);

  const { mutate, isPending } = usePostEspecies();
  const { data: tiposEspecie, isLoading: isLoadingTiposEspecie, refetch: refetchTipos } = useGetTiposEspecie();
  const { data: variedades, isLoading: isLoadingVariedades, refetch: refetchVariedades } = useGetVariedad();

  const handleSubmit = () => {
    if (!nombre || !descripcion || !img || !tiempocrecimiento || !fk_tipoespecie || !fk_variedad) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("img", img);
    formData.append("tiempocrecimiento", tiempocrecimiento);
    formData.append("fk_tipoespecie", String(fk_tipoespecie));
    formData.append("fk_variedad", String(fk_variedad));

    mutate(formData, {
      onSuccess: (data) => {
        onCreate(data);
        onClose();
        setNombre("");
        setDescripcion("");
        setImg(null);
        setPreview(null);
        setTiempocrecimiento("");
        setFk_tipoespecie(null);
        setFk_variedad(null);
      },
    });
  };

  const handleTipoEspecieCreada = (nuevoTipo: { id: number }) => {
    refetchTipos();
    setFk_tipoespecie(nuevoTipo.id);
    setModalTipoEspecieVisible(false);
  };

  const handleVariedadCreada = (nuevaVariedad: { id: number }) => {
    refetchVariedades();
    setFk_variedad(nuevaVariedad.id);
    setModalVariedadVisible(false);
  };

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Especie"
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
          label="Nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <Input
          label="Descripción"
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />

        <Select
          label="Tiempo de Crecimiento"
          placeholder="Selecciona una opción"
          selectedKeys={tiempocrecimiento ? [tiempocrecimiento] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            setTiempocrecimiento(String(selected));
          }}
        >
          {opcionesCrecimiento.map((op) => (
            <SelectItem key={op.value}>{op.label}</SelectItem>
          ))}
        </Select>

        {/* Tipo de Especie con botón de creación */}
        {isLoadingTiposEspecie ? (
          <p>Cargando tipos de especie...</p>
        ) : (
          <div className="flex items-end gap-2 mt-4">
            <div className="flex-1">
              <Select
                label="Tipo de Especie"
                placeholder="Selecciona un tipo"
                selectedKeys={fk_tipoespecie ? [fk_tipoespecie.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_tipoespecie(Number(selectedKey));
                }}
              >
                {(tiposEspecie || []).map((tipo) => (
                  <SelectItem key={tipo.id.toString()}>{tipo.nombre}</SelectItem>
                ))}
              </Select>
            </div>
            <Button
              onPress={() => setModalTipoEspecieVisible(true)}
              color="success"
              radius="full"
              size="sm"
              title="Agregar nuevo tipo de especie"
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        )}

        {/* Variedad con botón de creación */}
        <div className="mt-4 flex items-end gap-2">
          <div className="flex-1">
            {isLoadingVariedades ? (
              <p>Cargando variedades...</p>
            ) : (
              <Select
                label="Variedad"
                placeholder="Selecciona una variedad"
                selectedKeys={fk_variedad ? [fk_variedad.toString()] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setFk_variedad(Number(selectedKey));
                }}
              >
                {(variedades || []).map((variedad) => (
                  <SelectItem key={variedad.id.toString()}>{variedad.nombre}</SelectItem>
                ))}
              </Select>
            )}
          </div>
          <Button
            onPress={() => setModalVariedadVisible(true)}
            color="success"
            radius="full"
            size="sm"
            title="Agregar nueva variedad"
          >
            <Plus className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Imagen */}
        <div className="mt-4">
          <Button
            type="button"
            variant="solid"
            onPress={() => document.getElementById("imgEspecieInput")?.click()}
          >
            Seleccionar imagen
          </Button>

          <input
            id="imgEspecieInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImg(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
        </div>

        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Vista previa"
              className="w-48 h-48 object-cover rounded-lg border border-gray-300"
            />
          </div>
        )}
      </ModalComponent>

      {modalTipoEspecieVisible && (
        <CrearTiposEspecieModal
          onClose={() => setModalTipoEspecieVisible(false)}
          onCreate={handleTipoEspecieCreada}
        />
      )}

      {modalVariedadVisible && (
        <CrearVariedadModal
          onClose={() => setModalVariedadVisible(false)}
          onCreate={handleVariedadCreada}
        />
      )}
    </>
  );
};
