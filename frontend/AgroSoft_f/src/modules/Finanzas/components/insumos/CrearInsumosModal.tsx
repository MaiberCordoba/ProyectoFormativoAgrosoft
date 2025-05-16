import { useState } from "react";
import { usePostInsumo } from "../../hooks/insumos/usePostInsumos";
import ModalComponent from "@/components/Modal";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useGetUnidadesMedida } from "@/modules/Finanzas/hooks/unidadesMedida/useGetUnidadesMedida";
import { Insumos, UnidadesMedida } from "../../types";
import { Plus } from "lucide-react";
import { CrearUnidadesMedidaModal } from "../unidadesMedida/CrearUnidadesMedidaModal";

interface CrearInsumosModalProps {
  onClose: () => void;
  onCreate : (nuevoInsumo : Insumos) => void
}

export const CrearInsumosModal = ({ onClose }: CrearInsumosModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number | null>(null);
  const [compuestoActivo, setCompuestoActivo] = useState("");
  const [contenido, setContenido] = useState<number | null>(null);
  const [fichaTecnica, setFichaTecnica] = useState<File | null>(null); 
  const [unidades, setUnidades] = useState<number | null>(null);
  const [fk_UnidadMedida, setfk_UnidadMedida] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null)

  const [unidadMedidaModal, setUnidadeMedidaModal] = useState(false)

  const { data: unidadesMedida, isLoading: isLoadingUnidad, refetch: refetchUnidadMedida } = useGetUnidadesMedida();
  const { mutate, isPending } = usePostInsumo();

  const handleSubmit = () => {
    if (
      !nombre ||
      !descripcion ||
      precio === null ||
      !compuestoActivo ||
      contenido === null ||
      unidades === null ||
      fk_UnidadMedida === null
    ) {
      console.log("Por favor, completa todos los campos.");
      return;
    }
      const formData = new FormData()
      formData.append("nombre",nombre)
      formData.append("descripcion",descripcion)
      formData.append("precio",precio.toString())
      formData.append("compuestoActivo",compuestoActivo)
      formData.append("contenido",contenido.toString())
      formData.append("fichaTecnica",fichaTecnica)
      formData.append("unidades",unidades.toString())
      formData.append("fk_UnidadMedida",fk_UnidadMedida.toString())

    mutate(formData,
      {
        onSuccess: () => {
          onClose();
          // Limpiar campos
          setNombre("");
          setDescripcion("");
          setPrecio(null);
          setCompuestoActivo("");
          setContenido(null);
          setFichaTecnica(null);
          setUnidades(null);
          setfk_UnidadMedida(null);
        },
      }
    );
  };
  const handleUnidadMedidaCreada = (nuevaUnidadMedida : UnidadesMedida) =>{
    refetchUnidadMedida()
    setfk_UnidadMedida(nuevaUnidadMedida.id)
    setUnidadeMedidaModal(false)
  }

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Insumos"
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
          label="Nombre Insumo"
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
        <Input
          label="Precio unidad insumo"
          type="number"
          value={precio}
          onChange={(e) => setPrecio(Number(e.target.value))}
          required
          />
        <Input
          label="Compuesto activo"
          type="text"
          value={compuestoActivo}
          onChange={(e) => setCompuestoActivo(e.target.value)}
          required
          />
          <Input
            label="Unidades compradas"
            type="number"
            value={unidades ?? ""}
            onChange={(e) => setUnidades(Number(e.target.value))}
            required
          />
        <Input
          label="Contenido del insumo"
          type="number"
          value={contenido ?? ""}
          onChange={(e) => setContenido(Number(e.target.value))}
          required
          />
          {isLoadingUnidad ? (
            <p>Cargando unidades de medida...</p>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Select
                  label="Unidad de Medida"
                  placeholder="Selecciona la Unidad de Medida"
                  selectedKeys={fk_UnidadMedida ? [fk_UnidadMedida.toString()] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    setfk_UnidadMedida(selectedKey ? Number(selectedKey) : null);
                  }}
                  >
                  {(unidadesMedida || []).map((unidad) => (
                    <SelectItem key={unidad.id.toString()}>{unidad.nombre}</SelectItem>
                  ))}
                </Select>
              </div>
              <Button
              onPress={()=> setUnidadeMedidaModal(true)}
              color="success"
              title="Crear unidad medida"
              size="sm"
              >
                  <Plus className="w-5 h-5 text-white"/>
              </Button>
            </div>
          )}
          <div className="mt-4">
            <input 
            id="imagenFichaTecnica"
            type="file" 
            accept="image/"
            onChange={(e)=>{
              const file = e.target.files?.[0]
              if (file)
                setFichaTecnica(file)
                setPreview(URL.createObjectURL(file!))
            }}
            className="hidden"
            />
            <Button
            type="submit"
            variant="solid"
            onPress={()=> document.getElementById("imagenFichaTecnica")?.click()}
            >
              Ficha Tecnica
            </Button>
            <span className="flex-1 p-3">Cargar ficha tecnica</span>
          </div>
          {preview && (
            <div className="mt-4">
              <img
              src={preview}
              alt="Vista Previa"
              className="w-48 h-48 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}
      </ModalComponent>
      {unidadMedidaModal && (
      <CrearUnidadesMedidaModal
      onClose={()=>setUnidadeMedidaModal(false)}
      onCreate={handleUnidadMedidaCreada}
            /> 
      )}
    </>
  );
};
