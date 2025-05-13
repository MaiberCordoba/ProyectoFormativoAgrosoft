import { useState } from "react";
import { usePostCosecha } from "../../hooks/cosechas/usePostCosechas";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { useGetCultivos } from "@/modules/Trazabilidad/hooks/cultivos/useGetCultivos";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { Cosechas, UnidadesMedida } from "../../types";
import { CrearCultivoModal } from "@/modules/Trazabilidad/components/cultivos/CrearCultivosModal";
import { Cultivos } from "@/modules/Trazabilidad/types";
import { CrearUnidadesMedidaModal } from "../unidadesMedida/CrearUnidadesMedidaModal";

interface CrearCosechasModalProps {
  onClose: () => void;
  onCreate: (nuevaCosecha:Cosechas) => void;
}

export const CrearCosechasModal = ({ onClose,onCreate }: CrearCosechasModalProps) => {
  const [fk_Cultivo, setFk_Cultivo] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState<number>(0);  // Inicializado en 0
  const [fk_UnidadMedida, setFk_UnidadMedida] = useState<number | null>(null);
  const [fecha, setFecha] = useState("");
//Creacion de estados para abrir modales
  const [unidadMedidaModal,setUnidadMedidaModal] = useState(false)
  const [cultivoModal,setCultivoModal] = useState(false)

  const { data: cultivos, isLoading: isLoadingCultivos, refetch: refetchCultivo } = useGetCultivos();
  const { data: UnidadMedida, isLoading: isLoadingUnidadMedida, refetch: refetchUnidadMedida  } = useGetUnidadesMedida();
  const { mutate, isPending } = usePostCosecha();

  const handleSubmit = () => {
    if (!fk_Cultivo || cantidad <= 0 || !fk_UnidadMedida || !fecha ) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { fk_Cultivo, cantidad, fk_UnidadMedida, fecha},
      {
        onSuccess: (data) => {
          onClose();
          onCreate(data)
          setFk_Cultivo(null);
          setCantidad(0)
          setFk_UnidadMedida(null) // Restablecer a 0
          setFecha("");
        },
      }
    );
  };
  const handleCultivoCreado = (nuevoCultivo : Cultivos) =>{
    refetchCultivo()
    setFk_Cultivo(nuevoCultivo.id)
    setCultivoModal(false)
  }
  const handleUnidadMedidaCreada = (nuevaUnidadMedida : UnidadesMedida) =>{
    refetchUnidadMedida()
    setFk_Cultivo(nuevaUnidadMedida.id)
    setCultivoModal(false)
  }

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Cosechas"
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
          label="Fecha de Cosecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
        <Input
          label="Cantidad cosechada"
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          required
        />

        {isLoadingCultivos ? (
          <p>Cargando cultivos...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                label="Cultivo"
                placeholder="Selecciona un cultivo"
                selectedKeys={fk_Cultivo ? [fk_Cultivo.toString()] : []} 
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0]; 
                  setFk_Cultivo(selectedKey ? Number(selectedKey) : null);
                }}
              >
                {(cultivos || []).map((cultivo) => (
                  <SelectItem key={cultivo.id.toString()}>{cultivo.nombre}</SelectItem>
                ))}
              </Select>
            </div>
            <Button
            onPress={() => setCultivoModal(true)}
            color="success"
            title="Crear nuevo cultivo"
            radius="full"
            size="sm"
            >
              <Plus className="w-5 h-5 text-white"/>
            </Button>
          </div>
        )}
        {isLoadingUnidadMedida ? (
          <p>Cargando unidades de medida...</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                label="Unidad de medida"
                placeholder="Selecciona una unidad de medida"
                selectedKeys={fk_UnidadMedida ? [fk_UnidadMedida.toString()] : []} 
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0]; 
                  setFk_UnidadMedida(selectedKey ? Number(selectedKey) : null);
                }}
              >
                {(UnidadMedida || []).map((unidadesMedida) => (
                  <SelectItem key={unidadesMedida.id.toString()}>{unidadesMedida.nombre}</SelectItem>
                ))}
              </Select>
            </div>
             <Button
            onPress={() => setUnidadMedidaModal(true)}
            color="success"
            title="Crear nueva Unidad de Medida"
            radius="full"
            size="sm"
            >
              <Plus className="w-5 h-5 text-white"/>
            </Button>
          </div>
        )}
      </ModalComponent>
      {cultivoModal && (
        <CrearCultivoModal
        onClose={() => setCultivoModal(false)}
        onCreate={handleCultivoCreado}
        />
      )}
      {unidadMedidaModal && (
        <CrearUnidadesMedidaModal
        onClose={() => setUnidadMedidaModal(false)}
        onCreate={handleUnidadMedidaCreada}
        />
      )}
    </>
  );
};
