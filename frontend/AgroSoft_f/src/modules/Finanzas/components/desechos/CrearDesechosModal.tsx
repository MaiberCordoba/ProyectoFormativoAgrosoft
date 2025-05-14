import { useState } from "react";
import { usePostDesecho } from "../../hooks/desechos/usePostDesechos";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { useGetTiposDesechos } from "../../hooks/tiposDesechos/useGetTiposDesechos";
import { useGetCultivos } from "@/modules/Trazabilidad/hooks/cultivos/useGetCultivos";
import { TiposDesechos } from "../../types";
import { Cultivos } from "@/modules/Trazabilidad/types";
import { Plus } from "lucide-react";
import { CrearCultivoModal } from "@/modules/Trazabilidad/components/cultivos/CrearCultivosModal";
import { CrearTiposDesechosModal } from "../tiposDesechos/CrearTiposDesechosModal";

interface CrearDesechosModalProps {
  onClose: () => void;
}

export const CrearDesechosModal = ({ onClose }: CrearDesechosModalProps) => {
  const [fk_Cultivo, setFk_Cultivo] = useState<number | null>(null); // Cambiado a número o null
  const [fk_TipoDesecho, setFk_TipoDesecho] = useState<number | null>(null); 
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  //Creacion modales 
  const [cultivoModal, setCultivoModal] = useState(false)
  const [tipoDesechosModal, setTiposDesechosModal] = useState(false)

  const { data: tiposDesechos, isLoading: isLoadingTiposDesechos,refetch:refretchTiposDesechos } = useGetTiposDesechos();
  const { data: cultivos, isLoading: isLoadingCultivos,refetch:refretchCultivo } = useGetCultivos();
  const { mutate, isPending } = usePostDesecho();

  const handleSubmit = () => {
    if (!fk_Cultivo || !fk_TipoDesecho || !nombre || !descripcion) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { fk_Cultivo, fk_TipoDesecho, nombre, descripcion },
      {
        onSuccess: () => {
          onClose();
          setFk_Cultivo(null);
          setFk_TipoDesecho(null);
          setNombre("");
          setDescripcion("");
        },
      }
    );
  };
  const handleTipoDesechoCreado = (nuevoTipoDesecho:TiposDesechos)=>{
    refretchTiposDesechos()
    setFk_TipoDesecho(nuevoTipoDesecho.id)
    setTiposDesechosModal(false)
  }
  const handleCultivoCreado = (nuevoCultivo:Cultivos)=>{
    refretchCultivo()
    setFk_TipoDesecho(nuevoCultivo.id)
    setCultivoModal(false)
  }

  return (
    <>

      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Desechos"
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

        {/* Selector de Cultivos */}
        {isLoadingCultivos ? (
          <p>Cargando cultivos...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                label="Cultivo"
                placeholder="Selecciona un cultivo"
                selectedKeys={fk_Cultivo ? [fk_Cultivo.toString()] : []} // HeroUI espera un array de strings
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0]; // HeroUI devuelve un Set
                  setFk_Cultivo(selectedKey ? Number(selectedKey) : null); // Actualiza el estado con el nuevo ID
                }}
              >
                {(cultivos || []).map((cultivo) => (
                  <SelectItem key={cultivo.id.toString()}>
                    {cultivo.nombre}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button
            onPress={()=> setCultivoModal(true)}
            color="success"
            title="Crear Cultivo"
            size="sm"
            >
                <Plus className="w-5 h-5 text-white"/>
            </Button>
          </div>
        )}

        {/* Selector de Tipos de Desechos */}
        {isLoadingTiposDesechos ? (
          <p>Cargando tipos de desechos...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                label="Tipo de desecho"
                placeholder="Selecciona un tipo de desecho"
                selectedKeys={fk_TipoDesecho ? [fk_TipoDesecho.toString()] : []} // HeroUI espera un array de strings
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0]; // HeroUI devuelve un Set
                  setFk_TipoDesecho(selectedKey ? Number(selectedKey) : null); // Actualiza el estado con el nuevo ID
                }}
              >
                {(tiposDesechos || []).map((tipo) => (
                  <SelectItem key={tipo.id.toString()}>
                    {tipo.nombre}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button
            onPress={()=> setTiposDesechosModal(true)}
            color="success"
            title="Crear tipo de desecho"
            size="sm"
            >
                <Plus className="w-5 h-5 text-white"/>
            </Button>
          </div>
        )}
      </ModalComponent>
      {cultivoModal && (
        <CrearCultivoModal
        onClose={()=>{setCultivoModal(false)}}
        onCreate={handleCultivoCreado}
        />
      )}
      {tipoDesechosModal && (
        <CrearTiposDesechosModal
        onClose={()=>{setTiposDesechosModal(false)}}
        onCreate={handleTipoDesechoCreado}
        />
      )}
    </>
  );
};
